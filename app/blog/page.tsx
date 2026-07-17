import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import BlogSidebar from "@/components/BlogSidebar";
import Pagination from "@/components/Pagination";
import Newsletter from "@/components/Newsletter";
import ShopInsta from "@/components/ShopInsta";
import Ph from "@/components/Ph";
import { ChevronDown } from "@/components/icons";
import { posts, blogGridImages } from "@/lib/data";

export const metadata = { title: "Blog — MiniStore" };

// Fill a 9-card grid, cycling posts for copy but giving each its own image.
const grid = Array.from({ length: 9 }, (_, i) => ({
  ...posts[i % posts.length],
  image: blogGridImages[i],
}));

export default function BlogPage() {
  return (
    <>
      <PageHeader title="Blog" crumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]} />

      <section className="container-x py-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[260px_1fr]">
          <BlogSidebar />

          <div>
            <div className="mb-8 flex items-center justify-between">
              <p className="text-sm text-muted">Showing 1–9 of 15 results</p>
              <button className="flex items-center gap-2 text-sm text-muted hover:text-ink">
                Latest <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {grid.map((post, i) => (
                <article key={`${post.slug}-${i}`} className="group">
                  <Link href={`/blog/${post.slug}`} className="block aspect-[4/3] overflow-hidden">
                    <Ph src={post.image} alt={post.title} sizes="(max-width: 768px) 100vw, 300px" className="h-full w-full transition-transform duration-500 group-hover:scale-105" />
                  </Link>
                  <p className="mt-4 text-[11px] uppercase tracking-[0.1em] text-muted">
                    {post.date} · {post.category}
                  </p>
                  <h3 className="mt-2 text-sm font-medium uppercase tracking-[0.04em] text-ink group-hover:text-brand">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                </article>
              ))}
            </div>

            <Pagination pages={3} active={1} />
          </div>
        </div>
      </section>

      <Newsletter />
      <ShopInsta />
    </>
  );
}
