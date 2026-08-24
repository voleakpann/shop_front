import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import { fetchProducts } from "@/lib/api";

// Input validation - prevent XSS & SQL injection
function validateInput(value: string | undefined): string | undefined {
  if (!value) return undefined;

  // Only allow alphanumeric, hyphens, and underscores for category/tag
  const sanitized = String(value).slice(0, 50); // Max 50 chars
  if (!/^[a-zA-Z0-9\-_]*$/.test(sanitized)) {
    return undefined;
  }
  return sanitized;
}

function validateNumber(value: string | undefined): number {
  const num = parseInt((value || "0"), 10);
  return isNaN(num) || num < 0 ? 0 : num;
}

export default async function ShopContent({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams;

  // Validate inputs - prevent injection attacks
  const page = validateNumber(params.page as string);
  const category = validateInput(params.category as string);
  const tag = validateInput(params.tag as string);
  const priceRange = validateInput(params.price as string);

  // Fetch server-side like home page
  const allProducts = await fetchProducts({ size: 100 });

  // Filter with validated inputs only
  let filtered = allProducts;
  if (category) {
    filtered = filtered.filter(p => p.category === category);
  }
  if (tag) {
    filtered = filtered.filter(p => p.tags?.includes(tag));
  }
  if (priceRange) {
    const parts = priceRange.split('-').map(p => {
      const num = parseInt(p, 10);
      return isNaN(num) ? 0 : Math.max(0, num);
    });
    if (parts.length === 2) {
      const [min, max] = parts;
      filtered = filtered.filter(p => p.price >= min && p.price <= max);
    }
  }

  const productsPerPage = 9;
  const totalPages = Math.max(1, Math.ceil(filtered.length / productsPerPage));

  // Check if page is out of range
  const isPageOutOfRange = page > 0 && page >= totalPages;

  const startIndex = page * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const paginatedProducts = isPageOutOfRange ? [] : filtered.slice(startIndex, endIndex);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <p className="text-sm text-muted">
          {filtered.length > 0
            ? `Showing ${startIndex + 1}–${Math.min(endIndex, filtered.length)} of ${filtered.length} results`
            : 'No products found'}
        </p>
      </div>

      {paginatedProducts.length === 0 ? (
        <div className="flex min-h-96 items-center justify-center">
          <p className="text-center text-muted">
            {filtered.length === 0
              ? 'No products found with these filters.'
              : 'No products on this page.'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
            {paginatedProducts.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </>
      )}

      {totalPages > 1 && !isPageOutOfRange && (
        <div className="mt-16 py-8 border-t border-line">
          <Pagination pages={totalPages} active={page + 1} />
        </div>
      )}
    </div>
  );
}
