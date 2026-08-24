// -----------------------------------------------------------------------------
// Client for the MiniStore backend (auth-service + product-service, routed
// through api-gateway). See ../MINI SHOP BACKEND/README.md for the stack.
//
// If the backend is unreachable, every call falls back to the local mock data
// in ./data so the site keeps working during development.
// -----------------------------------------------------------------------------

import { products as localProducts, getProduct as getLocalProduct, type Product } from "./data";

export type { Product };

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";
export const AUTH_BASE_URL = process.env.NEXT_PUBLIC_AUTH_BASE_URL ?? "http://127.0.0.1:8081";
const COMMENT_SERVICE_URL = process.env.NEXT_PUBLIC_COMMENT_SERVICE_URL ?? "http://127.0.0.1:9003";
const BLOG_SERVICE_URL = process.env.NEXT_PUBLIC_BLOG_SERVICE_URL ?? "http://127.0.0.1:9004";

/** Sanitize input to prevent SQL injection and XSS */
function sanitizeInput(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const sanitized = String(value).slice(0, 100).trim();
  // Only allow alphanumeric, hyphens, underscores, spaces
  if (!/^[a-zA-Z0-9\-_ ]*$/.test(sanitized)) {
    return undefined;
  }
  return sanitized;
}

function sanitizeNumber(value: number | undefined): number | undefined {
  if (value === undefined) return undefined;
  const num = Math.max(0, Math.min(10000, Math.floor(value)));
  return num;
}

/** Filters the local mock data the same way the backend query params would. */
function filterLocal(params?: { category?: string; brand?: string; featured?: boolean }): Product[] {
  let result = localProducts;
  if (params?.featured) result = result.filter((p) => p.featured);
  if (params?.category && params.category !== "All")
    result = result.filter((p) => p.category === params.category);
  if (params?.brand) result = result.filter((p) => p.brand === params.brand);
  return result;
}

export async function fetchProducts(params?: {
  category?: string;
  tag?: string;
  brand?: string;
  featured?: boolean;
  page?: number;
  size?: number;
}): Promise<Product[]> {
  const search = new URLSearchParams();
  // Sanitize all inputs before sending to API
  if (params?.category) search.set("category", sanitizeInput(params.category) || "");
  if (params?.tag) search.set("tag", sanitizeInput(params.tag) || "");
  if (params?.brand) search.set("brand", sanitizeInput(params.brand) || "");
  if (params?.featured) search.set("featured", "true");
  if (params?.page !== undefined) {
    const page = sanitizeNumber(params.page);
    if (page !== undefined) search.set("page", String(page));
  }
  if (params?.size !== undefined) {
    const size = sanitizeNumber(params.size);
    if (size !== undefined) search.set("size", String(size));
  }
  const qs = search.toString();

  try {
    const res = await fetch(`${API_BASE_URL}/api/products${qs ? `?${qs}` : ""}`, {
      cache: "force-cache",
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`Products API returned ${res.status}`);
    let data = await res.json();
    // Handle both array response and paginated response
    let products = Array.isArray(data) ? data : (data.content || data);

    // Merge with local data to add missing images
    const categoryImageMap: Record<string, string[]> = {
      "Phones": ["/images/iphone-12-pro-blue.jpg", "/images/iphone-14-pro-black.jpg", "/images/iphone-15-white.jpg", "/images/iphone-16-black-titanium.jpg"],
      "Watches": ["/images/smartwatch-1.jpg", "/images/smartwatch-2.jpg", "/images/smartwatch-3.jpg", "/images/smartwatch-4.jpg"],
      "Accessories": ["/images/headphone-1.jpg", "/images/headphone-2.jpg", "/images/headphone-3.jpg"],
      "Tablets": ["/images/product-item1.jpg", "/images/product-item2.jpg", "/images/product-item3.jpg"],
    };

    let categoryCounters: Record<string, number> = {};

    products = products.map((p: any) => {
      let image = p.image;

      // Try local products first
      if (!image) {
        const localProduct = localProducts.find(lp => lp.slug === p.slug);
        image = localProduct?.image;
      }

      // Fall back to category images
      if (!image && p.category) {
        const categoryImages = categoryImageMap[p.category] || [];
        if (categoryImages.length > 0) {
          const counter = categoryCounters[p.category] || 0;
          image = categoryImages[counter % categoryImages.length];
          categoryCounters[p.category] = counter + 1;
        }
      }

      // Final fallback
      if (!image) {
        image = "/images/product-item1.jpg";
      }

      return {
        ...p,
        image,
      };
    });

    return products;
  } catch (err) {
    console.warn("[api] Backend unreachable, using local product data.", err);
    return filterLocal(params);
  }
}

// ---- Orders -----------------------------------------------------------------

const JWT_STORAGE_KEY = "ministore_jwt";

/** Reads the JWT saved after a Google login (browser only). */
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(JWT_STORAGE_KEY);
}

export type OrderItemPayload = { slug: string; name: string; price: number; qty: number };

export type OrderPayload = {
  customerName: string;
  phone: string;
  address: string;
  city: string;
  stateRegion: string;
  zip: string;
  notes?: string;
  items: OrderItemPayload[];
};

export type OrderResult =
  | { ok: true; order: { id: number; total: number; status: string } }
  | { ok: false; error: string };

/** Places an order via the backend. Requires a valid JWT (Google login). */
export async function createOrder(payload: OrderPayload): Promise<OrderResult> {
  const token = getAuthToken();
  if (!token) {
    return { ok: false, error: "You must sign in with Google before placing an order." };
  }
  try {
    const res = await fetch(`${API_BASE_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (res.status === 401) {
      return { ok: false, error: "Your session expired. Please sign in with Google again." };
    }
    if (!res.ok) {
      return { ok: false, error: `Order failed (${res.status}). Is the backend running?` };
    }
    const order = await res.json();
    return { ok: true, order };
  } catch {
    return { ok: false, error: "Could not reach the order service. Is the backend running?" };
  }
}

export type PaymentIntentResult =
  | { ok: true; clientSecret: string }
  | { ok: false; error: string };

/** Creates a Stripe PaymentIntent for an already-created order, for use with an embedded card form. */
export async function createPaymentIntent(orderId: number): Promise<PaymentIntentResult> {
  const token = getAuthToken();
  if (!token) {
    return { ok: false, error: "You must sign in with Google before paying." };
  }
  try {
    const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/payment-intent`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      return { ok: false, error: `Could not start payment (${res.status}).` };
    }
    const { clientSecret } = (await res.json()) as { clientSecret: string };
    return { ok: true, clientSecret };
  } catch {
    return { ok: false, error: "Could not reach the order service. Is the backend running?" };
  }
}

export async function fetchProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products/${slug}`, {
      cache: "force-cache",
      next: { revalidate: 60 }
    });
    // A 404 may be a genuine "no such product" OR a foreign app answering on the
    // API port while the real backend is down. Prefer local data if we have it,
    // so detail pages stay consistent with the homepage/shop fallback behaviour.
    if (res.status === 404) return getLocalProduct(slug) ?? null;
    if (!res.ok) throw new Error(`Product API returned ${res.status}`);
    let product = await res.json() as Product;

    // Add image if missing using local data or category images
    if (!product.image) {
      const localProduct = (localProducts as any[]).find(p => p.slug === slug);
      if (localProduct?.image) product.image = localProduct.image;
    }

    return product;
  } catch (err) {
    console.warn(`[api] Backend unreachable, using local data for "${slug}".`, err);
    return getLocalProduct(slug) ?? null;
  }
}

// ---- Comments -----------------------------------------------------------------

export type CommentThread = {
  id: number;
  userName: string;
  userEmail: string;
  content: string;
  createdAt: string;
  deleted?: boolean;
  likeCount?: number;
  pinned?: boolean;
  pinnedBy?: string;
  pinnedAt?: string;
  replies: CommentThread[];
};

export type ReactionResponse = {
  id: number;
  emoji: string;
  userName: string;
  userEmail: string;
  createdAt: string;
};

/** Lists a product's comments as a thread. Public — no auth required. */
export async function fetchComments(slug: string): Promise<CommentThread[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_COMMENT_SERVICE_URL || COMMENT_SERVICE_URL}/api/comments/${slug}`, {
      cache: "force-cache",
      next: { revalidate: 30 }
    });
    if (!res.ok) throw new Error(`Comments API returned ${res.status}`);
    return (await res.json()) as CommentThread[];
  } catch (err) {
    console.warn(`[api] Could not load comments for "${slug}".`, err);
    return [];
  }
}

export type PostCommentResult = { ok: true } | { ok: false; error: string };

/**
 * Posts a comment on a product, or a reply when parentId is set. Requires a
 * valid JWT (Google login) — the author is always taken from the token.
 */
export async function postComment(
  slug: string,
  content: string,
  parentId?: number
): Promise<PostCommentResult> {
  const token = getAuthToken();
  if (!token) {
    return { ok: false, error: "You must sign in with Google before commenting." };
  }
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_COMMENT_SERVICE_URL || COMMENT_SERVICE_URL}/api/comments/${slug}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content, parentId: parentId ?? null }),
    });
    if (res.status === 401) {
      return { ok: false, error: "Your session expired. Please sign in with Google again." };
    }
    if (!res.ok) {
      return { ok: false, error: `Could not post comment (${res.status}).` };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not reach the comment service. Is the backend running?" };
  }
}

/** Deletes your own comment (soft delete). Requires a valid JWT. */
export async function deleteComment(commentId: number): Promise<PostCommentResult> {
  const token = getAuthToken();
  if (!token) {
    return { ok: false, error: "You must sign in with Google." };
  }
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_COMMENT_SERVICE_URL || COMMENT_SERVICE_URL}/api/comments/${commentId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401) {
      return { ok: false, error: "Your session expired. Please sign in with Google again." };
    }
    if (!res.ok) {
      return { ok: false, error: `Could not delete comment (${res.status}).` };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not reach the comment service. Is the backend running?" };
  }
}

/** Fetch reactions for a comment. Public - no auth required. */
export async function fetchReactions(commentId: number): Promise<ReactionResponse[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_COMMENT_SERVICE_URL || COMMENT_SERVICE_URL}/api/comments/${commentId}/reactions`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Reactions API returned ${res.status}`);
    return (await res.json()) as ReactionResponse[];
  } catch (err) {
    console.warn(`[api] Could not load reactions for comment ${commentId}.`, err);
    return [];
  }
}

/** Add a reaction to a comment. Requires a valid JWT. */
export async function addReaction(commentId: number, emoji: string): Promise<PostCommentResult> {
  const token = getAuthToken();
  if (!token) {
    return { ok: false, error: "You must sign in with Google to react." };
  }
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_COMMENT_SERVICE_URL || COMMENT_SERVICE_URL}/api/comments/${commentId}/reactions/${encodeURIComponent(emoji)}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401) {
      return { ok: false, error: "Your session expired. Please sign in with Google again." };
    }
    if (!res.ok) {
      return { ok: false, error: `Could not add reaction (${res.status}).` };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not reach the comment service. Is the backend running?" };
  }
}

/** Remove a reaction from a comment. Requires a valid JWT. */
export async function removeReaction(commentId: number, emoji: string): Promise<PostCommentResult> {
  const token = getAuthToken();
  if (!token) {
    return { ok: false, error: "You must sign in with Google." };
  }
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_COMMENT_SERVICE_URL || COMMENT_SERVICE_URL}/api/comments/${commentId}/reactions/${encodeURIComponent(emoji)}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401) {
      return { ok: false, error: "Your session expired. Please sign in with Google again." };
    }
    if (!res.ok) {
      return { ok: false, error: `Could not remove reaction (${res.status}).` };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not reach the comment service. Is the backend running?" };
  }
}

/** Pin a comment (admin only). Requires a valid JWT. */
export async function pinComment(commentId: number): Promise<PostCommentResult> {
  const token = getAuthToken();
  if (!token) {
    return { ok: false, error: "You must sign in to pin comments." };
  }
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_COMMENT_SERVICE_URL || COMMENT_SERVICE_URL}/api/comments/${commentId}/pin`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401) {
      return { ok: false, error: "You don't have permission to pin comments." };
    }
    if (res.status === 403) {
      return { ok: false, error: "Admin access required." };
    }
    if (!res.ok) {
      return { ok: false, error: `Could not pin comment (${res.status}).` };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not reach the comment service." };
  }
}

/** Unpin a comment (admin only). Requires a valid JWT. */
export async function unpinComment(commentId: number): Promise<PostCommentResult> {
  const token = getAuthToken();
  if (!token) {
    return { ok: false, error: "You must sign in to unpin comments." };
  }
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_COMMENT_SERVICE_URL || COMMENT_SERVICE_URL}/api/comments/${commentId}/pin`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401) {
      return { ok: false, error: "You don't have permission to unpin comments." };
    }
    if (res.status === 403) {
      return { ok: false, error: "Admin access required." };
    }
    if (!res.ok) {
      return { ok: false, error: `Could not unpin comment (${res.status}).` };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not reach the comment service." };
  }
}

// ---- Blog Posts -----------------------------------------------------------------

export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  coverImage?: string;
  publishedAt: string;
};

export type BlogApiResponse = {
  content: BlogPost[];
  totalElements: number;
  totalPages: number;
  page: number;
};

export type CategoryCount = {
  category: string;
  count: number;
};

export type BlogFilter = {
  page?: number;
  size?: number;
  category?: string;
  tag?: string;
  q?: string;
};

/** Fetch blog posts with pagination and optional filters. Disabled - Blog service not in use. */
export async function fetchBlogPosts(filters: BlogFilter = {}): Promise<BlogApiResponse | null> {
  console.warn("[api] Blog service is disabled.");
  return null;
}

/** Fetch blog categories with post counts. Disabled - Blog service not in use. */
export async function fetchBlogCategories(): Promise<CategoryCount[]> {
  console.warn("[api] Blog service is disabled.");
  return [];
}
