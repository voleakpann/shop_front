"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";
import Ph from "@/components/Ph";
import { ChevronDown } from "@/components/icons";
import { fetchBlogPosts, type BlogApiResponse } from "@/lib/api";

export default function BlogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "0");
  const category = searchParams.get("category");
  const tag = searchParams.get("tag");
  const q = searchParams.get("q");
  const [data, setData] = useState<BlogApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"latest" | "oldest">("latest");

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      const result = await fetchBlogPosts({
        page,
        size: 9,
        category: category || undefined,
        tag: tag || undefined,
        q: q || undefined,
      });
      setData(result);
      setLoading(false);
    };

    loadPosts();
  }, [page, category, tag, q]);

  const grid = data?.content.map((post) => ({
    ...post,
    image: post.coverImage || "/images/post-image.jpg",
    date: new Date(post.publishedAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  })) || [];

  const getFilterLabel = () => {
    if (q) return `Search results for "${q}"`;
    if (category) return `Posts in ${category}`;
    if (tag) return `Posts tagged ${tag}`;
    return "All posts";
  };

  const handleClearFilters = () => {
    router.push("/blog");
  };

  return (
    <div>
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-ink">{getFilterLabel()}</p>
            <p className="text-xs text-muted">
              {loading ? "Loading..." : `${data?.totalElements || 0} results found`}
            </p>
          </div>
          <button className="flex items-center gap-2 text-sm text-muted hover:text-ink">
            {sortBy === "latest" ? "Latest" : "Oldest"} <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>

        {(category || tag || q) && (
          <button
            onClick={handleClearFilters}
            className="text-xs text-brand hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <p>Loading posts...</p>
        </div>
      ) : grid.length === 0 ? (
        <div className="flex h-40 items-center justify-center">
          <p className="text-muted">No posts found. Try a different search or filter.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {grid.map((post) => (
              <article key={post.slug} className="group">
                <Link href={`/blog/${post.slug}`} className="block aspect-[4/3] overflow-hidden">
                  <Ph
                    src={post.image}
                    alt={post.title}
                    sizes="(max-width: 768px) 100vw, 300px"
                    className="h-full w-full transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>
                <p className="mt-4 text-[11px] uppercase tracking-[0.1em] text-muted">
                  {post.date} · {post.category}
                </p>
                <h3 className="mt-2 text-sm font-medium uppercase tracking-[0.04em] text-ink group-hover:text-brand">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <Link
                  href={`/blog/${post.slug}#comments`}
                  className="mt-3 inline-block text-xs text-muted hover:text-brand transition-colors"
                >
                  💬 Read & Comment
                </Link>
              </article>
            ))}
          </div>

          {data && data.totalPages > 1 && <Pagination pages={data.totalPages} active={page + 1} />}
        </>
      )}
    </div>
  );
}
