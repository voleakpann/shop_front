import { notFound } from "next/navigation";
import Link from "next/link";
import ProductDetail from "@/components/ProductDetail";
import ProductCard from "@/components/ProductCard";
import Dots from "@/components/Dots";
import Newsletter from "@/components/Newsletter";
import ShopInsta from "@/components/ShopInsta";
import { fetchProduct, fetchProducts } from "@/lib/api";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await fetchProduct(slug);
  return { title: product ? `${product.name} — MiniStore` : "Product — MiniStore" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await fetchProduct(slug);
  if (!product) notFound();

  const allProducts = await fetchProducts();
  const related = allProducts.filter((p) => p.slug !== product.slug).slice(0, 4);

  return (
    <>
      <section className="container-x py-14">
        <ProductDetail product={product} />
      </section>

      {/* Related products */}
      <section className="container-x py-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="section-heading">Related Products</h2>
          <Link href="/shop" className="text-xs font-medium uppercase tracking-[0.12em] text-muted hover:text-brand">
            Go To Shop
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
        <div className="mt-8">
          <Dots count={3} active={0} />
        </div>
      </section>

      <Newsletter />
      <ShopInsta />
    </>
  );
}
