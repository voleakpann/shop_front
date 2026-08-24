import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";
import ProductRow from "@/components/ProductRow";
import Newsletter from "@/components/Newsletter";
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

export const revalidate = 60;

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await fetchProduct(slug);
  if (!product) notFound();

  // Get 1 related product per category
  const allProducts = await fetchProducts({ size: 50 });
  const filtered = allProducts.filter((p) => p.slug !== product.slug);
  const categories = ["Phones", "Watches", "Accessories", "Tablets"];
  const related = categories
    .map((cat) => filtered.find((p) => p.category === cat))
    .filter((p): p is typeof p & {} => p !== undefined);

  return (
    <>
      <section className="container-x py-14">
        <ProductDetail product={product} />
      </section>

      {/* Related products carousel */}
      <ProductRow title="Related Products" products={related} />

      <Newsletter />
    </>
  );
}
