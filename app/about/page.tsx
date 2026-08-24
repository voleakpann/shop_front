import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import FeatureBar from "@/components/FeatureBar";
import Testimonial from "@/components/Testimonial";
import Newsletter from "@/components/Newsletter";
import Ph from "@/components/Ph";
import { aboutImage } from "@/lib/data";

export const metadata = { title: "About Us — MiniStore" };

export default function AboutPage() {
  return (
    <>
      <PageHeader title="About Us" crumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]} />

      <FeatureBar />

      {/* Story */}
      <section className="container-x py-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/3] bg-[#f2f3f5]">
            <Ph src={aboutImage} alt="MiniStore story" sizes="(max-width: 1024px) 100vw, 560px" className="h-full w-full" />
            <button
              aria-label="Play video"
              className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-lg transition hover:scale-105"
            >
              <span className="ml-1 border-y-8 border-l-[14px] border-y-transparent border-l-ink" />
            </button>
          </div>

          <div>
            <h2 className="text-2xl font-light uppercase tracking-[0.06em] text-ink">
              How Was MiniStore Found?
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-muted">
              MiniStore started as a small side project between friends who
              wanted a simpler way to shop for everyday tech — no clutter, no
              pressure, just products worth owning at prices that make sense.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Today we work with a small team of curators who test everything
              we sell, so you can trust that what lands in your cart is worth
              the price tag.
            </p>
            <Link href="/shop" className="btn-dark mt-7">Shop Our Store</Link>
          </div>
        </div>
      </section>

      <Testimonial />
      <Newsletter />
    </>
  );
}
