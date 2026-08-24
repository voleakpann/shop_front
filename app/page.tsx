import { Suspense } from "react";
import Link from "next/link";
import Ph from "@/components/Ph";
import HeroSlider from "@/components/HeroSlider";
import FeatureBar from "@/components/FeatureBar";
import ProductSections from "@/components/ProductSections";
import ProductRowSkeleton from "@/components/ProductRowSkeleton";
import Testimonial from "@/components/Testimonial";
import Newsletter from "@/components/Newsletter";
import AnimatedBlock from "@/components/AnimatedBlock";
import { saleImage } from "@/lib/data";
import { fetchBlogPosts } from "@/lib/api";

export default async function HomePage() {
  const blogData = await fetchBlogPosts({ page: 0, size: 3 });
  const posts = blogData?.content.map((post) => ({
    ...post,
    image: post.coverImage || "/images/post-image.jpg",
    date: new Date(post.publishedAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  })) || [];

  return (
    <>
      {/* Hero — NOT animated on scroll (above fold, has own transition) */}
      <HeroSlider />

      <AnimatedBlock as="div">
        <FeatureBar />
      </AnimatedBlock>

      <AnimatedBlock as="div">
        <Suspense
          fallback={
            <>
              <ProductRowSkeleton title="Mobile Products" />
              <ProductRowSkeleton title="Smart Watches" />
            </>
          }
        >
          <ProductSections />
        </Suspense>
      </AnimatedBlock>

      {/* Sale banner — full-bleed light band with the image as a right-aligned background */}
      <AnimatedBlock
        as="section"
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
      </AnimatedBlock>

      {/* Latest posts */}
      <AnimatedBlock as="section" className="container-x py-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="section-heading">Latest Posts</h2>
          <Link href="/blog" className="text-xs font-medium uppercase tracking-[0.12em] text-muted hover:text-brand">
            Read Blogs
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {posts.map((post, idx) => (
            <article
              key={post.slug}
              className="card-cascade group"
              style={{ transitionDelay: `${idx * 80}ms` }}
            >
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
      </AnimatedBlock>

      <AnimatedBlock as="div">
        <Testimonial />
      </AnimatedBlock>

      <AnimatedBlock as="div">
        <Newsletter />
      </AnimatedBlock>
    </>
  );
}
