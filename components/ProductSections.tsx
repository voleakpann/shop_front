import ProductRow from "./ProductRow";
import { fetchProducts } from "@/lib/api";

export default async function ProductSections() {
  const products = await fetchProducts({ size: 50 });
  const phones = products.filter((p) => p.category === "Phones");
  const watches = products.filter((p) => p.category === "Watches");
  const accessories = products.filter((p) => p.category === "Accessories");
  const tablets = products.filter((p) => p.category === "Tablets");

  return (
    <>
      <ProductRow id="products" title="Mobile Products" products={phones} />
      <ProductRow id="watches" title="Smart Watches" products={watches} />
      <ProductRow id="accessories" title="Headphones & Audio" products={accessories} />
      <ProductRow id="tablets" title="Laptops & Tablets" products={tablets} />
    </>
  );
}
