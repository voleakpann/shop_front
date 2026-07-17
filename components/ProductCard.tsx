"use client";

import Link from "next/link";
import Ph from "./Ph";
import { CartIcon } from "./icons";
import type { Product } from "@/lib/data";
import { useCart } from "@/lib/cart";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const glyph = product.category === "Watches" ? "watch" : "product";
  return (
    <div className="group">
      <div
        className="relative overflow-hidden bg-[#f2f3f5]"
        style={{ aspectRatio: "310 / 418" }}
      >
        <Link href={`/product/${product.slug}`} className="block h-full w-full">
          <Ph
            src={product.image || undefined}
            glyph={glyph}
            alt={product.name}
            className="h-full w-full transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        {/* Add-to-cart bar slides up on hover */}
        <button
          onClick={() => addToCart(product)}
          className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center gap-2 bg-ink py-3 text-xs font-medium uppercase tracking-[0.12em] text-white transition-transform duration-300 group-hover:translate-y-0"
        >
          Add To Cart <CartIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2">
        <Link
          href={`/product/${product.slug}`}
          className="text-sm font-medium uppercase tracking-[0.06em] text-ink hover:text-brand"
        >
          {product.name}
        </Link>
        <span className="text-sm font-medium text-brand">${product.price}</span>
      </div>
    </div>
  );
}
