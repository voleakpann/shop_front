import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import AccountView from "@/components/AccountView";
import Newsletter from "@/components/Newsletter";
import ShopInsta from "@/components/ShopInsta";

export const metadata = { title: "My Account — MiniStore" };

export default function AccountPage() {
  return (
    <>
      <PageHeader title="My Account" crumbs={[{ label: "Home", href: "/" }, { label: "Account" }]} />
      <section className="container-x py-14">
        <Suspense>
          <AccountView />
        </Suspense>
      </section>
      <Newsletter />
      <ShopInsta />
    </>
  );
}
