import ProductRow from "./ProductRow";
import { fetchProducts } from "@/lib/api";

export default async function ProductSections() {
  const products = await fetchProducts();
  const phones = products.filter((p) => p.category === "Phones");
  const watches = products.filter((p) => p.category === "Watches");

  return (
    <>
      <ProductRow id="products" title="Mobile Products" products={phones} />
      <ProductRow id="watches" title="Smart Watches" products={watches} />
    </>
  );
}
