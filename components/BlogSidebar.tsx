"use client";

import Link from "next/link";
import Ph from "./Ph";
import { SearchIcon } from "./icons";
import { categories, productTags, posts } from "@/lib/data";

const socialLinks = ["Facebook", "Instagram", "Twitter", "Youtube", "Pinterest"];

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
  return (
    <aside>
      <form className="mb-8 flex items-stretch border border-line" onSubmit={(e) => e.preventDefault()}>
        <input type="search" placeholder="Search" className="w-full px-3 py-2.5 text-sm outline-none placeholder:text-muted" />
        <button aria-label="Search" className="bg-ink px-3 text-white">
          <SearchIcon className="h-4 w-4" />
        </button>
      </form>

      <Widget title="Categories">
        <ul className="space-y-2 text-sm">
          {categories.map((c) => (
            <li key={c}><a href="#" className="link-muted">{c}</a></li>
          ))}
        </ul>
      </Widget>

      <Widget title="Tags">
        <ul className="space-y-2 text-sm">
          {productTags.map((t) => (
            <li key={t}><a href="#" className="link-muted">{t}</a></li>
          ))}
        </ul>
      </Widget>

      <Widget title="Latest Posts">
        <ul className="space-y-4">
          {posts.map((p) => (
            <li key={p.slug} className="flex items-center gap-3">
              <Ph glyph="photo" alt={p.title} className="h-14 w-14 shrink-0" />
              <Link href={`/blog/${p.slug}`} className="text-xs font-medium uppercase tracking-[0.04em] text-ink hover:text-brand">
                {p.title}
              </Link>
            </li>
          ))}
        </ul>
      </Widget>

      <Widget title="Social Links">
        <ul className="space-y-2 text-sm">
          {socialLinks.map((s) => (
            <li key={s}><a href="#" className="link-muted">{s}</a></li>
          ))}
        </ul>
      </Widget>
    </aside>
  );
}
