import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import BlogSidebar from "@/components/BlogSidebar";
import Newsletter from "@/components/Newsletter";
import BlogContent from "./BlogContent";

export const revalidate = 0;

export default function BlogPage() {
  return (
    <>
      <PageHeader title="Blog" crumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]} />

      <section className="container-x py-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[260px_1fr]">
          <BlogSidebar />

          <Suspense fallback={<p>Loading posts...</p>}>
            <BlogContent />
          </Suspense>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
