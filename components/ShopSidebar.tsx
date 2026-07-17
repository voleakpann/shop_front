"use client";

import { SearchIcon } from "./icons";
import { categories, productTags, brands, priceRanges } from "@/lib/data";

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

function LinkList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 text-sm">
      {items.map((it) => (
        <li key={it}>
          <a href="#" className="link-muted">{it}</a>
        </li>
      ))}
    </ul>
  );
}

export default function ShopSidebar() {
  return (
    <aside>
      {/* Search */}
      <form className="mb-8 flex items-stretch border border-line" onSubmit={(e) => e.preventDefault()}>
        <input
          type="search"
          placeholder="Search"
          className="w-full px-3 py-2.5 text-sm outline-none placeholder:text-muted"
        />
        <button aria-label="Search" className="bg-ink px-3 text-white">
          <SearchIcon className="h-4 w-4" />
        </button>
      </form>

      <Widget title="Categories"><LinkList items={categories} /></Widget>
      <Widget title="Tags"><LinkList items={productTags} /></Widget>
      <Widget title="Brands"><LinkList items={brands} /></Widget>
      <Widget title="Filter By Price"><LinkList items={priceRanges} /></Widget>
    </aside>
  );
}
