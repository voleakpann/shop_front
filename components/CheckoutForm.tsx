"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useCart } from "@/lib/cart";
import { createOrder, createPaymentIntent } from "@/lib/api";
import { getStripe } from "@/lib/stripe";
import CardField from "@/components/CardField";

const inputClass =
  "w-full border border-line px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted focus:border-brand";
const labelClass = "block text-sm text-ink";

const payments = [
  {
    id: "card",
    title: "Credit / Debit card",
    text: "Enter your card details below, securely processed by Stripe.",
  },
  {
    id: "cash",
    title: "Cash on delivery",
    text: "Pay with cash when your order arrives. No online payment needed.",
  },
];

const money = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function CheckoutFormInner() {
  const { items, subtotal, clearCart } = useCart();
  const stripe = useStripe();
  const elements = useElements();
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash">("card");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [country, setCountry] = useState("United States");
  const [address, setAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [stateRegion, setStateRegion] = useState("Florida");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [placedOrder, setPlacedOrder] = useState<{ id: number; total: number } | null>(null);

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (items.length === 0) {
      setError("Your cart is empty. Add a product before placing an order.");
      return;
    }
    if (!firstName.trim() || !lastName.trim() || !address.trim() || !city.trim() || !zip.trim() || !phone.trim()) {
      setError("Please fill in all required billing fields.");
      return;
    }

    const cardNumber = paymentMethod === "card" ? elements?.getElement(CardNumberElement) : null;
    if (paymentMethod === "card" && (!stripe || !elements || !cardNumber)) {
      setError("Payment form isn't ready yet. Please wait a moment and try again.");
      return;
    }

    setSubmitting(true);
    const result = await createOrder({
      customerName: `${firstName} ${lastName}`.trim(),
      phone,
      address: [address, apartment].filter(Boolean).join(", "),
      city,
      stateRegion,
      zip,
      notes,
      items: items.map((l) => ({ slug: l.slug, name: l.name, price: l.price, qty: l.qty })),
    });

    if (!result.ok) {
      setSubmitting(false);
      setError(result.error);
      return;
    }

    if (paymentMethod === "cash") {
      // No online payment step — the order is confirmed immediately and paid
      // for in person on delivery.
      setSubmitting(false);
      setPlacedOrder({ id: result.order.id, total: result.order.total });
      clearCart();
      return;
    }

    // Card: create the PaymentIntent for this order, then confirm it with the
    // card details already entered on this page.
    const intent = await createPaymentIntent(result.order.id);
    if (!intent.ok) {
      setSubmitting(false);
      setError(intent.error);
      return;
    }

    const { error: confirmError, paymentIntent } = await stripe!.confirmCardPayment(intent.clientSecret, {
      payment_method: { card: cardNumber! },
    });
    setSubmitting(false);

    if (confirmError) {
      setError(confirmError.message ?? "Payment failed. Please check your card details.");
      return;
    }
    if (paymentIntent?.status === "succeeded") {
      setPlacedOrder({ id: result.order.id, total: result.order.total });
      clearCart();
    } else {
      setError("Payment was not completed. Please try again.");
    }
  };

  // ---- Confirmation (cash order placed, or card payment succeeded) ----
  if (placedOrder) {
    return (
      <div className="mx-auto max-w-md py-10 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand/10">
          <svg viewBox="0 0 24 24" className="h-8 w-8 text-brand" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="text-2xl font-light uppercase tracking-[0.06em] text-ink">
          {paymentMethod === "card" ? "Payment received!" : "Order placed!"}
        </h2>
        <p className="mt-4 text-sm text-muted">
          Thank you. Your order <span className="text-brand">#{placedOrder.id}</span> for{" "}
          <span className="text-brand">${money(placedOrder.total)}</span>{" "}
          {paymentMethod === "card"
            ? "has been paid and is being processed."
            : "will be paid in cash on delivery."}
        </p>
        <Link href="/shop" className="btn-dark mt-8">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <form className="grid grid-cols-1 gap-12 lg:grid-cols-2" onSubmit={placeOrder}>
      {/* Billing details */}
      <div>
        <h2 className="mb-6 text-2xl font-light uppercase tracking-[0.06em] text-ink">
          Billing Details
        </h2>
        <div className="space-y-4">
          <div>
            <label className={labelClass} htmlFor="fname">First Name*</label>
            <input id="fname" className={`${inputClass} mt-2`} value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          </div>
          <div>
            <label className={labelClass} htmlFor="lname">Last Name*</label>
            <input id="lname" className={`${inputClass} mt-2`} value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </div>
          <div>
            <label className={labelClass} htmlFor="cname">Company Name (optional)</label>
            <input id="cname" className={`${inputClass} mt-2`} value={company} onChange={(e) => setCompany(e.target.value)} />
          </div>
          <div>
            <label className={labelClass} htmlFor="country">Country / Region*</label>
            <select id="country" className={`${inputClass} mt-2`} value={country} onChange={(e) => setCountry(e.target.value)}>
              <option>United States</option>
              <option>UK</option>
              <option>Australia</option>
              <option>Canada</option>
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="adr">Street Address*</label>
            <input id="adr" className={`${inputClass} mt-2`} placeholder="House number and street name" value={address} onChange={(e) => setAddress(e.target.value)} required />
            <input className={`${inputClass} mt-3`} placeholder="Apartments, suite, etc." value={apartment} onChange={(e) => setApartment(e.target.value)} />
          </div>
          <div>
            <label className={labelClass} htmlFor="city">Town / City *</label>
            <input id="city" className={`${inputClass} mt-2`} value={city} onChange={(e) => setCity(e.target.value)} required />
          </div>
          <div>
            <label className={labelClass} htmlFor="state">State *</label>
            <select id="state" className={`${inputClass} mt-2`} value={stateRegion} onChange={(e) => setStateRegion(e.target.value)}>
              <option>Florida</option>
              <option>New York</option>
              <option>Chicago</option>
              <option>Texas</option>
              <option>San Jose</option>
              <option>Houston</option>
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="zip">Zip Code *</label>
            <input id="zip" className={`${inputClass} mt-2`} value={zip} onChange={(e) => setZip(e.target.value)} required />
          </div>
          <div>
            <label className={labelClass} htmlFor="phone">Phone *</label>
            <input id="phone" className={`${inputClass} mt-2`} value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
          <div>
            <label className={labelClass} htmlFor="email">Email address *</label>
            <input id="email" type="email" className={`${inputClass} mt-2`} value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
        </div>
      </div>

      {/* Additional info + cart totals */}
      <div>
        <h2 className="mb-6 text-2xl font-light uppercase tracking-[0.06em] text-ink">
          Additional Information
        </h2>
        <label className={labelClass} htmlFor="notes">Order notes (optional)</label>
        <textarea
          id="notes"
          className={`${inputClass} mt-2 min-h-28 resize-y`}
          placeholder="Notes about your order. Like special notes for delivery."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <h2 className="mb-6 mt-10 text-2xl font-light uppercase tracking-[0.06em] text-ink">
          Your Order
        </h2>

        {/* Line items */}
        {items.length === 0 ? (
          <p className="text-sm text-muted">
            Your cart is empty. <Link href="/shop" className="text-brand hover:underline">Browse products</Link>.
          </p>
        ) : (
          <div className="border-b border-line pb-2">
            {items.map((l) => (
              <div key={l.slug} className="flex justify-between py-2 text-sm">
                <span className="text-ink">
                  {l.name} <span className="text-muted">× {l.qty}</span>
                </span>
                <span className="text-brand">${money(l.price * l.qty)}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between border-b border-line py-3 text-sm uppercase tracking-[0.08em]">
          <span className="font-medium text-ink">Subtotal</span>
          <span className="text-brand">${money(subtotal)}</span>
        </div>
        <div className="flex justify-between border-b border-line py-3 text-sm uppercase tracking-[0.08em]">
          <span className="font-medium text-ink">Total</span>
          <span className="text-brand">${money(subtotal)}</span>
        </div>

        {/* Payment methods */}
        <div className="mt-8 space-y-4">
          {payments.map((p) => (
            <div key={p.id}>
              <label className="flex gap-3">
                <input
                  type="radio"
                  name="payment"
                  value={p.id}
                  checked={paymentMethod === p.id}
                  onChange={() => setPaymentMethod(p.id as "card" | "cash")}
                  className="mt-1 h-4 w-4 shrink-0 accent-brand"
                />
                <span>
                  <strong className="block text-sm uppercase tracking-[0.04em] text-ink">
                    {p.title}
                  </strong>
                  <small className="mt-1 block text-xs leading-relaxed text-muted">{p.text}</small>
                </span>
              </label>

              {/* Card fields nested right under the "Credit / Debit card" option, not after the whole list */}
              {p.id === "card" && paymentMethod === "card" && (
                <div className="ml-7 mt-4 space-y-4">
                  <CardField label="Card Number" Element={CardNumberElement} />
                  <div className="grid grid-cols-2 gap-4">
                    <CardField label="Expiry Date" Element={CardExpiryElement} />
                    <CardField label="CVC" Element={CardCvcElement} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {error && <p className="mt-6 text-sm text-brand">{error}</p>}

        <button
          type="submit"
          className="btn-dark mt-8"
          disabled={submitting || (paymentMethod === "card" && !stripe)}
        >
          {submitting
            ? "Placing order…"
            : paymentMethod === "card" ? "Pay Now" : "Place Order (Cash on Delivery)"}
        </button>
      </div>
    </form>
  );
}

export default function CheckoutForm() {
  return (
    <Elements stripe={getStripe()}>
      <CheckoutFormInner />
    </Elements>
  );
}
