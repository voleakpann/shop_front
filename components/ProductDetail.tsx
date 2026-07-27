"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Ph from "./Ph";
import { StarIcon } from "./icons";
import type { Product } from "@/lib/data";
import { useCart } from "@/lib/cart";
import CommentThread from "./CommentThread";

const colors = [
  { name: "Orange", value: "#e08a4b" },
  { name: "Green", value: "#4b9e6a" },
  { name: "Blue", value: "#4b74e0" },
  { name: "Black", value: "#1e1e1e" },
];
const sizes = ["XL", "L", "M", "S"];
const tabs = ["Description", "Additional Information", "Comments"];

export default function ProductDetail({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [color, setColor] = useState(colors[0].name);
  const [size, setSize] = useState("M");
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState(0);

  const buyNow = () => {
    addToCart(product, qty);
    router.push("/checkout");
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Image */}
        <div className="aspect-square bg-[#f2f3f5]">
          <Ph
            src={product.image || undefined}
            glyph={product.category === "Watches" ? "watch" : "product"}
            alt={product.name}
            fit="contain"
            sizes="(max-width: 1024px) 100vw, 560px"
            className="h-full w-full"
            downloadable
            downloadName={`${product.slug}.${(product.image || "jpg").split(".").pop()}`}
          />
        </div>

        {/* Info */}
        <div>
          <h1 className="text-2xl font-normal uppercase tracking-[0.06em] text-ink">
            {product.name}
          </h1>
          <div className="mt-2 flex items-center gap-2 text-sm text-ink">
            <StarIcon className="h-4 w-4 text-brand" /> 5.0
          </div>
          <p className="mt-4 text-3xl font-light text-brand">
            ${product.price.toFixed(2)}
          </p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
            A refined blend of premium materials and everyday durability,
            designed to keep up with your routine without compromising on
            style or performance.
          </p>

          {/* Color */}
          <div className="mt-6">
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.1em] text-ink">Color</p>
            <div className="flex items-center gap-3">
              {colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setColor(c.name)}
                  className={`text-sm ${color === c.name ? "text-brand" : "text-muted hover:text-ink"}`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="mt-5">
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.1em] text-ink">Size</p>
            <div className="flex items-center gap-4">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`text-sm ${size === s ? "font-medium text-brand" : "text-muted hover:text-ink"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-5 text-xs text-muted">2 in stock</p>

          {/* Qty + actions */}
          <div className="mt-4 flex flex-wrap items-stretch gap-3">
            <div className="flex items-center border border-line">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-3 py-2.5 text-muted hover:text-ink"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-10 text-center text-sm">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="px-3 py-2.5 text-muted hover:text-ink"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button onClick={buyNow} className="btn-brand">Buy Now</button>
            <button onClick={() => addToCart(product, qty)} className="btn-dark">Add To Cart</button>
          </div>

          {/* Meta */}
          <div className="mt-6 space-y-1 text-xs text-muted">
            <p>SKU: 1223</p>
            <p>Category: {product.category}, Screen Touch</p>
            <p>Tags: {product.tags.join(", ")}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-16">
        <div className="flex flex-wrap items-center justify-center gap-8 border-b border-line">
          {tabs.map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              className={`-mb-px border-b-2 pb-3 text-sm font-medium uppercase tracking-[0.08em] ${
                tab === i ? "border-brand text-brand" : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="py-8 text-sm leading-relaxed text-muted">
          {tab === 0 && (
            <div className="space-y-4">
              <p className="font-medium text-ink">Product Description</p>
              <p>
                Built for daily use, this product pairs a clean, modern design
                with reliable performance. Every detail, from the finish to
                the fit, is crafted to feel premium while staying practical
                for everyday life.
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Durable, premium-grade materials</li>
                <li>Lightweight and comfortable for all-day use</li>
              </ul>
              <p>
                Backed by our standard warranty and satisfaction guarantee,
                it&apos;s designed to be a dependable part of your routine for
                years to come.
              </p>
            </div>
          )}
          {tab === 1 && (
            <ul className="max-w-md space-y-2">
              <li className="flex justify-between border-b border-line py-2"><span className="text-ink">Weight</span><span>0.3 kg</span></li>
              <li className="flex justify-between border-b border-line py-2"><span className="text-ink">Colors</span><span>Orange, Green, Blue, Black</span></li>
              <li className="flex justify-between border-b border-line py-2"><span className="text-ink">Sizes</span><span>XL, L, M, S</span></li>
            </ul>
          )}
          {tab === 2 && <CommentThread slug={product.slug} />}
        </div>
      </div>
    </>
  );
}
