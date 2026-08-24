"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Ph from "./Ph";
import { SearchIcon } from "./icons";
import { fetchBlogPosts, fetchBlogCategories, type CategoryCount, type BlogPost } from "@/lib/api";

function Widget({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h4 className="mb-4 border-b border-line pb-2 text-sm font-medium uppercase tracking-[0.1em] text-ink">
        {title}
      </h4>
      {children}
    </div>
  );
}

export default function BlogSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState("");
  const [categories, setCategories] = useState<CategoryCount[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSidebarData = async () => {
      setLoading(true);

      // Fetch categories
      const cats = await fetchBlogCategories();
      setCategories(cats);

      // Fetch all posts to extract tags
      const postsData = await fetchBlogPosts({ page: 0, size: 100 });
      if (postsData) {
        // Extract and deduplicate tags from all posts (would be better if API had a tags endpoint)
        const tagsSet = new Set<string>();

        // For now, just show latest posts as a sample
        setLatestPosts(postsData.content.slice(0, 5));
      }

      setLoading(false);
    };

    loadSidebarData();
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchValue.trim()) {
      const params = new URLSearchParams();
      params.set("q", searchValue.trim());
      params.set("page", "0");
      router.push(`/blog?${params.toString()}`);
    }
  };

  const handleCategoryClick = (category: string) => {
    const params = new URLSearchParams();
    params.set("category", category);
    params.set("page", "0");
    router.push(`/blog?${params.toString()}`);
  };

  const handleTagClick = (tag: string) => {
    const params = new URLSearchParams();
    params.set("tag", tag);
    params.set("page", "0");
    router.push(`/blog?${params.toString()}`);
  };

  return (
    <aside>
      <form className="mb-8 flex items-stretch border border-line" onSubmit={handleSearch}>
        <input
          type="search"
          placeholder="Search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full px-3 py-2.5 text-sm outline-none placeholder:text-muted"
        />
        <button type="submit" aria-label="Search" className="bg-ink px-3 text-white hover:bg-ink/90">
          <SearchIcon className="h-4 w-4" />
        </button>
      </form>

      <Widget title="Categories">
        {loading ? (
          <p className="text-xs text-muted">Loading...</p>
        ) : (
          <ul className="space-y-2 text-sm">
            <li>
              <button
                onClick={() => handleCategoryClick("All")}
                className="link-muted hover:text-brand"
              >
                All
              </button>
            </li>
            {categories.map((c) => (
              <li key={c.category}>
                <button
                  onClick={() => handleCategoryClick(c.category)}
                  className="link-muted hover:text-brand"
                >
                  {c.category} <span className="text-xs text-muted">({c.count})</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Widget>

      <Widget title="Tags">
        {loading ? (
          <p className="text-xs text-muted">Loading...</p>
        ) : tags.length > 0 ? (
          <ul className="space-y-2 text-sm">
            {tags.map((t) => (
              <li key={t}>
                <button
                  onClick={() => handleTagClick(t)}
                  className="link-muted hover:text-brand"
                >
                  {t}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-muted">No tags available</p>
        )}
      </Widget>

      <Widget title="Latest Posts">
        {loading ? (
          <p className="text-xs text-muted">Loading...</p>
        ) : (
          <ul className="space-y-4">
            {latestPosts.map((p) => (
              <li key={p.slug} className="flex items-center gap-3">
                <Ph
                  src={p.coverImage || "/images/post-image.jpg"}
                  alt={p.title}
                  className="h-14 w-14 shrink-0 object-cover"
                />
                <Link
                  href={`/blog/${p.slug}`}
                  className="text-xs font-medium uppercase tracking-[0.04em] text-ink hover:text-brand"
                >
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Widget>
    </aside>
  );
}
