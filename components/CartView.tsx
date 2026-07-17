"use client";

import Link from "next/link";
import Ph from "./Ph";
import { useCart } from "@/lib/cart";

export default function CartView() {
  const { items, subtotal, setQty, removeFromCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted">Your cart is empty.</p>
        <Link href="/shop" className="btn-dark mt-6">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <>
      {/* Header row */}
      <div className="hidden grid-cols-[2fr_1fr_1fr_auto] gap-4 border-b border-line pb-3 text-xs font-medium uppercase tracking-[0.12em] text-muted sm:grid">
        <span>Product</span>
        <span>Quantity</span>
        <span>Subtotal</span>
        <span className="w-6" />
      </div>

      {items.map((l) => (
        <div
          key={l.slug}
          className="grid grid-cols-1 items-center gap-4 border-b border-line py-6 sm:grid-cols-[2fr_1fr_1fr_auto]"
        >
          {/* Product */}
          <div className="flex items-center gap-4">
            <Ph
              src={l.image}
              glyph={l.category === "Watches" ? "watch" : "product"}
              alt={l.name}
              sizes="64px"
              className="h-16 w-16 shrink-0"
            />
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.04em] text-ink">{l.name}</p>
              <p className="text-sm text-brand">${l.price.toFixed(2)}</p>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <div className="inline-flex items-center border border-line">
              <button onClick={() => setQty(l.slug, l.qty - 1)} className="px-3 py-2 text-muted hover:text-ink" aria-label="Decrease">−</button>
              <span className="w-10 text-center text-sm">{l.qty}</span>
              <button onClick={() => setQty(l.slug, l.qty + 1)} className="px-3 py-2 text-muted hover:text-ink" aria-label="Increase">+</button>
            </div>
          </div>

          {/* Subtotal */}
          <span className="text-sm font-medium text-brand">${(l.price * l.qty).toFixed(2)}</span>

          {/* Remove */}
          <button onClick={() => removeFromCart(l.slug)} className="justify-self-start text-muted hover:text-ink sm:justify-self-center" aria-label={`Remove ${l.name}`}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.6}>
              <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      ))}

      {/* Cart totals */}
      <div className="mt-12 max-w-md">
        <h3 className="mb-4 text-lg font-light uppercase tracking-[0.08em] text-ink">Cart Totals</h3>
        <div className="flex justify-between border-b border-line py-3 text-sm">
          <span className="uppercase tracking-[0.08em] text-ink">Subtotal</span>
          <span className="text-brand">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between border-b border-line py-3 text-sm">
          <span className="uppercase tracking-[0.08em] text-ink">Total</span>
          <span className="text-brand">${subtotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/shop" className="btn-dark">Continue Shopping</Link>
        <Link href="/checkout" className="btn-dark">Proceed To Checkout</Link>
      </div>
    </>
  );
}
