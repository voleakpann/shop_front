"use client";

// -----------------------------------------------------------------------------
// Shopping cart state, shared across the app via React Context.
// Persists to localStorage so the cart survives page reloads.
// -----------------------------------------------------------------------------

import { createContext, useContext, useEffect, useState } from "react";
import type { Product } from "./data";

export type CartLine = {
  slug: string;
  name: string;
  price: number;
  image: string;
  category: string;
  qty: number;
};

type CartContextValue = {
  items: CartLine[];
  count: number;
  subtotal: number;
  addToCart: (product: Product, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  removeFromCart: (slug: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "ministore_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  // Load once on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore corrupt storage */
    }
    setReady(true);
  }, []);

  // Persist whenever the cart changes (after the initial load).
  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const addToCart = (product: Product, qty = 1) =>
    setItems((prev) => {
      const existing = prev.find((l) => l.slug === product.slug);
      if (existing) {
        return prev.map((l) => (l.slug === product.slug ? { ...l, qty: l.qty + qty } : l));
      }
      return [
        ...prev,
        {
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          qty,
        },
      ];
    });

  const setQty = (slug: string, qty: number) =>
    setItems((prev) => prev.map((l) => (l.slug === slug ? { ...l, qty: Math.max(1, qty) } : l)));

  const removeFromCart = (slug: string) =>
    setItems((prev) => prev.filter((l) => l.slug !== slug));

  const clearCart = () => setItems([]);

  const count = items.reduce((n, l) => n + l.qty, 0);
  const subtotal = items.reduce((s, l) => s + l.price * l.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, count, subtotal, addToCart, setQty, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
