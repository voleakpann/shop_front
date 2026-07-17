import Link from "next/link";
import Ph from "@/components/Ph";
import HeroSlider from "@/components/HeroSlider";
import FeatureBar from "@/components/FeatureBar";
import ProductRow from "@/components/ProductRow";
import Testimonial from "@/components/Testimonial";
import Newsletter from "@/components/Newsletter";
import ShopInsta from "@/components/ShopInsta";
import { posts, saleImage } from "@/lib/data";
import { fetchProducts } from "@/lib/api";

export default async function HomePage() {
  const products = await fetchProducts();
  const phones = products.filter((p) => p.category === "Phones");
  const watches = products.filter((p) => p.category === "Watches");

  return (
    <>
      {/* Hero */}
      <HeroSlider />

      <FeatureBar />

      <ProductRow id="products" title="Mobile Products" products={phones} />
      <ProductRow id="watches" title="Smart Watches" products={watches} />

      {/* Sale banner — full-bleed light band with the image as a right-aligned background */}
      <section
        id="sale"
        className="relative mt-12 flex min-h-[660px] scroll-mt-20 items-center overflow-hidden bg-band bg-no-repeat"
        style={{
          backgroundImage: `url('${saleImage}')`,
          backgroundPosition: "right center",
          backgroundSize: "auto 100%",
          height: "600px",
        }}
      >
        <div className="container-x w-full py-16">
          <div className=" text-center md:pl-8 md:text-left">
            <h3 className="text-xl font-normal text-ink">10% off</h3>
            <h2 className="mt-3 pb-5 text-5xl font-light uppercase tracking-[0.03em] text-ink lg:text-7xl"
            style={{
              paddingBottom: "70px"
            }}>
              New Year Sale
            </h2>
            <Link href="/shop" className="btn-dark px-8 py-4" >
              Shop Sale
            </Link>
          </div>
        </div>
      </section>

      {/* Latest posts */}
      <section className="container-x py-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="section-heading">Latest Posts</h2>
          <Link href="/blog" className="text-xs font-medium uppercase tracking-[0.12em] text-muted hover:text-brand">
            Read Blogs
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {posts.map((post) => (
            <article key={post.slug} className="group">
              <Link href={`/blog/${post.slug}`} className="block aspect-[4/3] overflow-hidden">
                <Ph src={post.image} alt={post.title} sizes="(max-width: 768px) 100vw, 380px" className="h-full w-full transition-transform duration-500 group-hover:scale-105" />
              </Link>
              <p className="mt-4 text-[11px] uppercase tracking-[0.1em] text-muted">
                {post.date} · {post.category}
              </p>
              <h3 className="mt-2 text-base font-normal uppercase tracking-[0.04em] text-ink group-hover:text-brand">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h3>
            </article>
          ))}
        </div>
      </section>

      <Testimonial />
      <Newsletter />
      <ShopInsta />
    </>
  );
}
