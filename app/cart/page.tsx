import PageHeader from "@/components/PageHeader";
import CartView from "@/components/CartView";
import Newsletter from "@/components/Newsletter";
import ShopInsta from "@/components/ShopInsta";

export const metadata = { title: "Cart — MiniStore" };

export default function CartPage() {
  return (
    <>
      <PageHeader title="Cart" crumbs={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
      <section className="container-x py-14">
        <CartView />
      </section>
      <Newsletter />
      <ShopInsta />
    </>
  );
}
