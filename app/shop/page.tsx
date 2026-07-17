import PageHeader from "@/components/PageHeader";
import ProductCard from "@/components/ProductCard";
import ShopSidebar from "@/components/ShopSidebar";
import Pagination from "@/components/Pagination";
import Newsletter from "@/components/Newsletter";
import ShopInsta from "@/components/ShopInsta";
import { ChevronDown } from "@/components/icons";
import { fetchProducts } from "@/lib/api";

export const metadata = { title: "Shop — MiniStore" };

export default async function ShopPage() {
  const products = await fetchProducts();

  return (
    <>
      <PageHeader title="Shop" crumbs={[{ label: "Home", href: "/" }, { label: "Shop" }]} />

      <section className="container-x py-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_260px]">
          {/* Products */}
          <div>
            <div className="mb-8 flex items-center justify-between">
              <p className="text-sm text-muted">
                Showing 1–9 of {products.length} results
              </p>
              <button className="flex items-center gap-2 text-sm text-muted hover:text-ink">
                Default sorting <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>

            <Pagination pages={3} active={1} />
          </div>

          {/* Sidebar */}
          <ShopSidebar />
        </div>
      </section>

      <Newsletter />
      <ShopInsta />
    </>
  );
}
