// -----------------------------------------------------------------------------
// Client for the MiniStore backend (auth-service + product-service, routed
// through api-gateway). See ../MINI SHOP BACKEND/README.md for the stack.
//
// If the backend is unreachable, every call falls back to the local mock data
// in ./data so the site keeps working during development.
// -----------------------------------------------------------------------------

import { products as localProducts, getProduct as getLocalProduct, type Product } from "./data";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";
export const AUTH_BASE_URL = process.env.NEXT_PUBLIC_AUTH_BASE_URL ?? "http://localhost:8081";

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
  brand?: string;
  featured?: boolean;
}): Promise<Product[]> {
  const search = new URLSearchParams();
  if (params?.category) search.set("category", params.category);
  if (params?.brand) search.set("brand", params.brand);
  if (params?.featured) search.set("featured", "true");
  const qs = search.toString();

  try {
    const res = await fetch(`${API_BASE_URL}/api/products${qs ? `?${qs}` : ""}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Products API returned ${res.status}`);
    return (await res.json()) as Product[];
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
    const res = await fetch(`${API_BASE_URL}/api/products/${slug}`, { cache: "no-store" });
    // A 404 may be a genuine "no such product" OR a foreign app answering on the
    // API port while the real backend is down. Prefer local data if we have it,
    // so detail pages stay consistent with the homepage/shop fallback behaviour.
    if (res.status === 404) return getLocalProduct(slug) ?? null;
    if (!res.ok) throw new Error(`Product API returned ${res.status}`);
    return (await res.json()) as Product;
  } catch (err) {
    console.warn(`[api] Backend unreachable, using local data for "${slug}".`, err);
    return getLocalProduct(slug) ?? null;
  }
}

// ---- Comments -----------------------------------------------------------------

export type CommentThread = {
  id: number;
  userName: string;
  content: string;
  createdAt: string;
  replies: CommentThread[];
};

/** Lists a product's comments as a thread. Public — no auth required. */
export async function fetchComments(slug: string): Promise<CommentThread[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/comments/${slug}`, { cache: "no-store" });
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
    const res = await fetch(`${API_BASE_URL}/api/comments/${slug}`, {
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
