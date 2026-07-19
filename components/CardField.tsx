"use client";

import { useState } from "react";
import type { CardNumberElement, CardExpiryElement, CardCvcElement } from "@stripe/react-stripe-js";
import type { StripeCardNumberElementOptions } from "@stripe/stripe-js";

const labelClass = "block text-sm text-ink";
const boxClass = "border border-line px-4 py-3 transition-colors";

export const elementStyle: StripeCardNumberElementOptions["style"] = {
  base: {
    fontSize: "14px",
    fontFamily: "inherit",
    color: "#1a1a1a",
    "::placeholder": { color: "#9a9a9a" },
  },
  invalid: { color: "#c0392b" },
};

/** Wraps a Stripe split-card Element with a label and a border that matches the rest of the form (including a focus ring, since focus can't be styled from inside the Element's iframe). */
export default function CardField({
  label,
  Element,
}: {
  label: string;
  Element: typeof CardNumberElement | typeof CardExpiryElement | typeof CardCvcElement;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label className={`${labelClass} mb-2`}>{label}</label>
      <div className={`${boxClass} ${focused ? "border-brand" : ""}`}>
        <Element
          options={{ style: elementStyle }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </div>
    </div>
  );
}
