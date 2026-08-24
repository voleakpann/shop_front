"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { SearchIcon } from "./icons";
import { categories, productTags, brands } from "@/lib/data";

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

function CategoryLinks({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 text-sm">
      {items.map((it) => (
        <li key={it}>
          <Link
            href={it === "All" ? "/shop" : `/shop?category=${it}`}
            className="link-muted hover:text-brand"
          >
            {it}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function TagLinks({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 text-sm">
      {items.map((it) => (
        <li key={it}>
          <Link href={`/shop?tag=${it}`} className="link-muted hover:text-brand">
            {it}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function BrandLinks({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 text-sm">
      {items.map((it) => (
        <li key={it}>
          <Link href={`/shop?brand=${it}`} className="link-muted hover:text-brand">
            {it}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function PriceLinks() {
  const priceRanges = [
    { label: "Less than $50", value: "0-50" },
    { label: "$50 - $250", value: "50-250" },
    { label: "$250 - $500", value: "250-500" },
    { label: "$500 - $750", value: "500-750" },
    { label: "$750 - $1000", value: "750-1000" },
  ];
  return (
    <ul className="space-y-2 text-sm">
      {priceRanges.map((range) => (
        <li key={range.value}>
          <Link href={`/shop?price=${range.value}`} className="link-muted hover:text-brand">
            {range.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function FeaturedLinks() {
  return (
    <ul className="space-y-2 text-sm">
      <li>
        <Link href="/shop" className="link-muted hover:text-brand">
          All Products
        </Link>
      </li>
      <li>
        <Link href="/shop?featured=true" className="link-muted hover:text-brand">
          Featured Only
        </Link>
      </li>
    </ul>
  );
}

export default function ShopSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get("q") || "";

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("q") as string;
    if (query) {
      router.push(`/shop?q=${encodeURIComponent(query)}`);
    } else {
      router.push("/shop");
    }
  };

  const handleClearSearch = () => {
    router.push("/shop");
  };

  return (
    <aside>
      {/* Search */}
      <form className="mb-8 flex items-stretch border border-line" onSubmit={handleSearch}>
        <input
          type="text"
          name="q"
          placeholder="Search"
          defaultValue={currentQuery}
          className="w-full px-3 py-2.5 text-sm outline-none placeholder:text-muted"
        />
        {currentQuery && (
          <button
            type="button"
            onClick={handleClearSearch}
            aria-label="Clear search"
            className="px-3 text-muted hover:text-ink"
          >
            ✕
          </button>
        )}
        <button aria-label="Search" className="bg-ink px-3 text-white hover:bg-ink/80">
          <SearchIcon className="h-4 w-4" />
        </button>
      </form>

      <Widget title="Categories"><CategoryLinks items={categories} /></Widget>
      <Widget title="Tags"><TagLinks items={productTags} /></Widget>
      <Widget title="Filter By Price"><PriceLinks /></Widget>
    </aside>
  );
}
