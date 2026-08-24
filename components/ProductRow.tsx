"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import ProductCard from "./ProductCard";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";
import type { Product } from "@/lib/data";

import "swiper/css";
import "swiper/css/pagination";

export default function ProductRow({
  title,
  products,
  id,
}: {
  title: string;
  products: Product[];
  id?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const { ref: containerRef } = useInViewAnimation<HTMLElement>({
    threshold: 0.15,
  });

  useEffect(() => setMounted(true), []);

  return (
    <section ref={containerRef} id={id} className="container-x scroll-mt-24 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="section-heading">{title}</h2>
        <Link href="/shop" className="text-xs font-medium uppercase tracking-[0.12em] text-muted hover:text-brand">
          Go To Shop
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-muted">No products available</p>
      ) : !mounted ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((p, idx) => (
            <div
              key={p.slug}
              className="card-cascade"
              style={{ transitionDelay: `${idx * 80}ms` }}
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      ) : (
        <Swiper
          modules={[Pagination]}
          spaceBetween={24}
          loop={products.length > 1}
          grabCursor
          observer
          observeParents
          pagination={{ clickable: true }}
          breakpoints={{
            0: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 4 },
          }}
          style={{ "--swiper-theme-color": "#1e1e1e", paddingBottom: "2.25rem" } as React.CSSProperties}
        >
          {products.map((p, idx) => (
            <SwiperSlide key={p.slug} className="!h-auto">
              <div
                className="card-cascade"
                style={{ transitionDelay: `${idx * 80}ms` }}
              >
                <ProductCard product={p} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  );
}
