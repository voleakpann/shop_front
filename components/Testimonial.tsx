"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper";
import { QuoteIcon, StarIcon, ChevronLeft, ChevronRight } from "./icons";
import { testimonials } from "@/lib/data";

import "swiper/css";

/** Star rating with half-star support (e.g. 3.5). */
function Stars({ value }: { value: number }) {
  return (
    <div className="flex items-center justify-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.max(0, Math.min(1, value - i)); // 0..1 for this star
        return (
          <span key={i} className="relative inline-block">
            <StarIcon className="h-4 w-4 text-line" />
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <StarIcon className="h-4 w-4 text-brand" />
            </span>
          </span>
        );
      })}
    </div>
  );
}

export default function Testimonial() {
  const swiperRef = useRef<SwiperClass | null>(null);

  return (
    <section className="container-x py-16">
      <div className="relative mx-auto max-w-4xl">
        {/* Prev arrow */}
        <button
          aria-label="Previous"
          onClick={() => swiperRef.current?.slidePrev()}
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 text-line transition hover:text-brand"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>

        <QuoteIcon className="mx-auto mb-6 h-8 w-8 text-ink/20" />

        <Swiper
          onSwiper={(s) => (swiperRef.current = s)}
          slidesPerView={1}
          loop
          grabCursor
          spaceBetween={40}
        >
          {testimonials.map((t, i) => (
            <SwiperSlide key={i}>
              <div className="mx-auto max-w-3xl px-8 text-center">
                <blockquote className="text-xl font-light leading-relaxed text-ink sm:text-2xl md:text-[1.7rem] md:leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="mt-6">
                  <Stars value={t.rating} />
                </div>
                <p className="mt-3 text-xs font-medium uppercase tracking-[0.12em] text-ink">
                  {t.name}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Next arrow */}
        <button
          aria-label="Next"
          onClick={() => swiperRef.current?.slideNext()}
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 text-line transition hover:text-brand"
        >
          <ChevronRight className="h-8 w-8" />
        </button>
      </div>
    </section>
  );
}
