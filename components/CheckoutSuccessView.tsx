"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/lib/cart";

export default function CheckoutSuccessView() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const { clearCart } = useCart();
  const cleared = useRef(false);

  // Payment succeeded (Stripe only redirects here after a completed Checkout
  // Session), so this is where the cart actually gets emptied.
  useEffect(() => {
    if (!cleared.current) {
      cleared.current = true;
      clearCart();
    }
  }, [clearCart]);

  return (
    <div className="mx-auto max-w-md py-10 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand/10">
        <svg viewBox="0 0 24 24" className="h-8 w-8 text-brand" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h2 className="text-2xl font-light uppercase tracking-[0.06em] text-ink">Payment received!</h2>
      <p className="mt-4 text-sm text-muted">
        Thank you.{" "}
        {orderId ? (
          <>
            Your order <span className="text-brand">#{orderId}</span> has been paid and is being processed.
          </>
        ) : (
          "Your payment has been received."
        )}
      </p>
      <Link href="/shop" className="btn-dark mt-8">Continue Shopping</Link>
    </div>
  );
}
