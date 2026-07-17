"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import ProductCard from "./ProductCard";
import type { Product } from "@/lib/data";

import "swiper/css";
import "swiper/css/pagination";

/**
 * A titled, Swiper-powered product carousel.
 * - loop + grabCursor + clickable pagination + nav arrows
 * - drags with mouse (desktop) and touch (mobile)
 * - responsive slidesPerView (1 / 2 / 4)
 */
export default function ProductRow({
  title,
  products,
  id,
}: {
  title: string;
  products: Product[];
  id?: string;
}) {
  return (
    <section id={id} className="container-x scroll-mt-24 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="section-heading">{title}</h2>
        <Link
          href="/shop"
          className="text-xs font-medium uppercase tracking-[0.12em] text-muted hover:text-brand"
        >
          Go To Shop
        </Link>
      </div>

      <Swiper
        modules={[Pagination]}
        spaceBetween={24}
        slidesPerView={1}
        loop
        grabCursor
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
        // theme Swiper's dots to the site ink colour + small room for the dots
        style={
          {
            "--swiper-theme-color": "#1e1e1e",
            paddingBottom: "2.25rem",
          } as React.CSSProperties
        }
      >
        {products.map((p) => (
          <SwiperSlide key={p.slug} className="h-auto">
            <ProductCard product={p} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
