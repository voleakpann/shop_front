import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import CheckoutSuccessView from "@/components/CheckoutSuccessView";

export const metadata = { title: "Payment Successful — MiniStore" };

export default function CheckoutSuccessPage() {
  return (
    <>
      <PageHeader title="Payment Successful" crumbs={[{ label: "Home", href: "/" }, { label: "Checkout" }]} />
      <section className="container-x py-14">
        <Suspense>
          <CheckoutSuccessView />
        </Suspense>
      </section>
    </>
  );
}
