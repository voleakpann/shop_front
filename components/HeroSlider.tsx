"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Ph from "./Ph";
import { ChevronLeft, ChevronRight } from "./icons";
import { heroImage } from "@/lib/data";

const slides = [
  { title: "Technology Hack You Won't Get", cta: "Shop Product", href: "/shop", image: "/images/item_pc.png" },
  { title: "Your Products Are Great.", cta: "Shop Product", href: "/shop", image: heroImage },
  { title: "New Year Sale Is On.", cta: "Shop Sale", href: "/shop", image: "/images/compare_iphone17.png" },
];

// Clone the last slide before the first and the first after the last, so the
// track can always move in the SAME direction and never scroll backwards.
// Rendered order: [cloneLast, s0, s1, s2, cloneFirst]  → positions 0..count+1
const extended = [slides[slides.length - 1], ...slides, slides[0]];

export default function HeroSlider() {
  const count = slides.length;
  const [pos, setPos] = useState(1); // 1 = first real slide (after the prepended clone)
  const [animate, setAnimate] = useState(true);

  const realIndex = (pos - 1 + count) % count;

  const go = useCallback((dir: number) => setPos((p) => p + dir), []);
  const jumpTo = (i: number) => setPos(i + 1);

  // When we land on a clone, snap (without animation) to the matching real slide.
  const handleTransitionEnd = () => {
    if (pos === count + 1) {
      setAnimate(false);
      setPos(1);
    } else if (pos === 0) {
      setAnimate(false);
      setPos(count);
    }
  };

  // Re-enable the transition on the next frame after a silent snap.
  useEffect(() => {
    if (!animate) {
      const id = setTimeout(() => setAnimate(true), 20);
      return () => clearTimeout(id);
    }
  }, [animate]);

  // Auto-play every 5s; pause while hovering the billboard.
  const paused = useRef(false);
  useEffect(() => {
    const id = setInterval(() => {
      if (!paused.current) setPos((p) => p + 1);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="billboard"
      className="relative overflow-hidden bg-band"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      {/* Track */}
      <div
        className="flex"
        onTransitionEnd={handleTransitionEnd}
        style={{
          transform: `translateX(-${pos * 100}%)`,
          transition: animate ? "transform 700ms ease-out" : "none",
        }}
      >
        {extended.map((slide, i) => (
          <div key={i} className="w-full shrink-0">
            {/* .container */}
            <div className="container-x">
              {/* .row d-flex align-items-center */}
              <div className="flex flex-col items-center gap-8 py-8 md:flex-row md:justify-between md:py-10">
                {/* .col-md-6 → banner-content */}
                <div className="w-full md:w-1/2">
                  <div className="text-center md:text-left">
                    <h1 className="pb-5 text-5xl font-light uppercase leading-[1.05] tracking-[0.02em] text-ink sm:text-6xl lg:text-7xl">
                      {slide.title}
                    </h1>
                    <Link href={slide.href} className="btn-dark px-8 py-4">
                      {slide.cta}
                    </Link>
                  </div>
                </div>
                {/* .col-md-5 → image-holder */}
                <div className="w-full md:w-1/2">
                  <Ph
                    src={slide.image}
                    fit="contain"
                    alt="banner"
                    sizes="(max-width: 768px) 90vw, 620px"
                    className="mx-auto aspect-square w-full max-w-md lg:max-w-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls: prev arrow · dots · next arrow */}
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-4">
        <button
          aria-label="Previous slide"
          onClick={() => go(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-ink text-ink transition hover:border-brand hover:bg-brand hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => jumpTo(i)}
              className={`h-3 w-3 rounded-full transition-colors ${
                i === realIndex ? "bg-ink" : "bg-ink/25 hover:bg-ink/50"
              }`}
            />
          ))}
        </div>

        <button
          aria-label="Next slide"
          onClick={() => go(1)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-ink text-ink transition hover:border-brand hover:bg-brand hover:text-white"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
