import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import FeatureBar from "@/components/FeatureBar";
import Testimonial from "@/components/Testimonial";
import Newsletter from "@/components/Newsletter";
import ShopInsta from "@/components/ShopInsta";
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
              Risus augue condim itum evasus congue velit at. Sed vitae risus id
              lorem ipsum ferto referum a nation velit et pellentesque hercios
              ridiculus id. Et libero vulputate amet elit sed volutpat integer.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Sed vitae mosus nibh ultrices. Nulla adipiscing pharetra pellentesque
              maecenas odio arcu ac. Et libero vulputate amet duis at volutpat.
            </p>
            <Link href="/shop" className="btn-dark mt-7">Shop Our Store</Link>
          </div>
        </div>
      </section>

      <Testimonial />
      <Newsletter />
      <ShopInsta />
    </>
  );
}
