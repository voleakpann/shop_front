"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SearchIcon, UserIcon, CartIcon, ChevronDown } from "./icons";
import { useCart } from "@/lib/cart";

const mainLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/#services" },
  { label: "Products", href: "/#products" },
  { label: "Watches", href: "/#watches" },
  { label: "Sale", href: "/#sale" },
  // { label: "Blog", href: "/blog" }, // Temporarily hidden
];

const pagesLinks = [
  { label: "About", href: "/about" },
  // { label: "Blog", href: "/blog" }, // Temporarily hidden
  { label: "Shop", href: "/shop" },
  { label: "Cart", href: "/cart" },
  { label: "Checkout", href: "/checkout" },
  // { label: "Single Post", href: "/blog/technology-hack-you-wont-get" }, // Temporarily hidden
  { label: "Single Product", href: "/product/pink-watch" },
  { label: "Contact", href: "/contact" },
];

const sectionIds = ["services", "products", "watches", "sale"];

export default function Navbar() {
  const pathname = usePathname();
  const { count: cartCount } = useCart();
  const [open, setOpen] = useState(false);
  // id of the home-page section currently in view ("" = none / top of page)
  const [activeSection, setActiveSection] = useState("");

  // Scrollspy: highlight the nav link for whichever section is on screen.
  // Only runs on the home page (where the #sections live).
  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection("");
      return;
    }

    // A section becomes active once its top passes just below the sticky navbar.
    // We pick the LAST section whose top is above that line.
    const onScroll = () => {
      const line = 120; // px from top of viewport (navbar is 80px tall)
      let current = "";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/" && activeSection === "";
    if (href.startsWith("/#")) return pathname === "/" && href.slice(2) === activeSection;
    return pathname === href;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur">
      <div className="container-x flex h-20 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-semibold tracking-tight text-ink">
          Mini<span className="font-light">Store</span>
          <span className="text-brand">.</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 text-xs font-medium uppercase tracking-[0.12em] xl:flex">
          {mainLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className={isActive(l.href) ? "text-brand" : "text-ink hover:text-brand"}
            >
              {l.label}
            </Link>
          ))}

          {/* Pages dropdown */}
          <div className="group relative">
            <button className="flex items-center gap-1 text-ink hover:text-brand">
              Pages <ChevronDown className="h-3 w-3" />
            </button>
            <div className="invisible absolute left-1/2 top-full z-50 w-48 -translate-x-1/2 translate-y-2 rounded-sm border border-line bg-white py-2 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              {pagesLinks.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="block px-5 py-2 text-[11px] normal-case tracking-normal text-muted hover:bg-band hover:text-ink"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <a href="#" className="font-semibold text-ink hover:text-brand">
            Get Pro
          </a>
        </nav>

        {/* Right icons */}
        <div className="flex items-center gap-5 text-ink">
          <button aria-label="Search" className="hover:text-brand">
            <SearchIcon />
          </button>
          <Link href="/account" aria-label="Account" className="hover:text-brand">
            <UserIcon />
          </Link>
          <Link href="/cart" aria-label="Cart" className="relative hover:text-brand">
            <CartIcon />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-medium text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Mobile toggle */}
          <button
            aria-label="Menu"
            className="xl:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            <div className="space-y-1.5">
              <span className={`block h-0.5 w-6 bg-ink transition ${open ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`block h-0.5 w-6 bg-ink transition ${open ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-6 bg-ink transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="border-t border-line bg-white xl:hidden">
          <div className="container-x flex flex-col py-3 text-sm uppercase tracking-[0.12em]">
            {mainLinks.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`py-2.5 ${isActive(l.href) ? "text-brand" : "text-ink"}`}
              >
                {l.label}
              </Link>
            ))}
            <a href="#" onClick={() => setOpen(false)} className="py-2.5 font-semibold text-ink">
              Get Pro
            </a>
            <div className="mt-1 border-t border-line pt-2 text-[10px] text-muted">Pages</div>
            {pagesLinks.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-2 pl-3 text-xs normal-case tracking-normal text-muted"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
