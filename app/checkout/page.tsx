import PageHeader from "@/components/PageHeader";
import CheckoutForm from "@/components/CheckoutForm";
import Newsletter from "@/components/Newsletter";

export const metadata = { title: "Checkout — MiniStore" };

export default function CheckoutPage() {
  return (
    <>
      <PageHeader title="Checkout" crumbs={[{ label: "Home", href: "/" }, { label: "Checkout" }]} />
      <section className="container-x py-14">
        <CheckoutForm />
      </section>
      <Newsletter />
    </>
  );
}
