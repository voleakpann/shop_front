import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import ShopSidebar from "@/components/ShopSidebar";
import Newsletter from "@/components/Newsletter";
import ShopContent from "./ShopContent";

export const metadata = { title: "Shop — MiniStore" };
export const revalidate = 0;

export default function ShopPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  return (
    <>
      <PageHeader title="Shop" crumbs={[{ label: "Home", href: "/" }, { label: "Shop" }]} />

      <section className="container-x py-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_260px]">
          {/* Products */}
          <Suspense fallback={<p>Loading products...</p>}>
            <ShopContent searchParams={searchParams} />
          </Suspense>

          {/* Sidebar */}
          <ShopSidebar />
        </div>
      </section>

      <Newsletter />
    </>
  );
}
