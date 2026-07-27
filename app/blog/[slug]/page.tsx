import { notFound } from "next/navigation";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import BlogCommentForm from "@/components/BlogCommentForm";
import Newsletter from "@/components/Newsletter";
import Ph from "@/components/Ph";
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  LinkedinIcon,
  MailIcon,
  ChevronLeft,
  ChevronRight,
} from "@/components/icons";
import { posts, getPost, blogInlineImage, commentAvatars } from "@/lib/data";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  return { title: post ? `${post.title} — MiniStore` : "Blog — MiniStore" };
}

const comments = [
  { name: "Sam Smith", date: "Feb 22, 2023", text: "Great breakdown, this helped me decide what to upgrade first." },
  { name: "Jantie Mary", date: "Feb 22, 2023", reply: true, text: "Agreed — battery life matters way more than people give it credit for." },
  { name: "Marlon Rosa", date: "Feb 22, 2023", text: "Would love a follow-up post comparing specific models." },
];

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = posts.filter((p) => p.slug !== post.slug);
  const idx = posts.findIndex((p) => p.slug === post.slug);
  const prev = posts[(idx - 1 + posts.length) % posts.length];
  const next = posts[(idx + 1) % posts.length];

  return (
    <>
      <PageHeader title="Blog" crumbs={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: post.category }]} />

      <article className="container-x py-14">
        <div className="mx-auto max-w-3xl">
          <p className="text-[11px] uppercase tracking-[0.1em] text-muted">
            {post.date} · {post.category}
          </p>
          <h1 className="mt-3 text-2xl font-normal uppercase tracking-[0.04em] text-ink sm:text-3xl">
            {post.title}
          </h1>

          <Ph src={post.image} alt={post.title} sizes="(max-width: 768px) 100vw, 768px" className="mt-8 aspect-[16/9] w-full" />

          <div className="mt-8 space-y-5 text-sm leading-relaxed text-muted">
            <p>
              Technology moves fast, and it&apos;s easy to fall behind on the small
              upgrades that actually make a difference day to day. In this post
              we break down what&apos;s worth your attention right now, and why
              it matters more than the marketing hype suggests.
            </p>

            <blockquote className="border-l-2 border-ink py-2 pl-6 text-lg font-light italic leading-relaxed text-ink">
              &ldquo;The best upgrades aren&apos;t always the flashiest ones —
              they&apos;re the ones you stop noticing because they just work.&rdquo;
            </blockquote>

            <h3 className="pt-2 text-sm font-medium uppercase tracking-[0.1em] text-ink">Are You Amazed?</h3>
            <ul className="list-disc space-y-2 pl-5">
              <li>Faster performance without a bigger price tag.</li>
              <li>Battery life that actually lasts a full day.</li>
              <li>Build quality that holds up to daily wear and tear.</li>
            </ul>

            <p>
              None of this is about chasing every new release. It&apos;s about
              knowing which features are genuinely useful versus which ones are
              just there to sell you an upgrade you don&apos;t need.
            </p>

            <div className="grid grid-cols-1 gap-6 py-4 sm:grid-cols-[200px_1fr] sm:items-center">
              <Ph src={blogInlineImage} alt="Detail" sizes="200px" className="aspect-square w-full" />
              <div>
                <h4 className="text-sm font-medium uppercase tracking-[0.1em] text-ink">
                  What To Look For
                </h4>
                <p className="mt-2">
                  Focus on build quality, real-world battery life, and how well
                  a product fits into what you already own.
                </p>
              </div>
            </div>

            <p>
              Whichever option you choose, make sure it solves an actual problem
              you have rather than one a product page invented for you.
            </p>
          </div>

          {/* Tags + share */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-line py-5">
            <p className="text-xs text-muted">
              Tags: <span className="text-ink">Gadgets</span>
            </p>
            <div className="flex items-center gap-4 text-muted">
              <span className="text-xs uppercase tracking-[0.1em]">Share:</span>
              <a href="#" className="hover:text-brand"><FacebookIcon /></a>
              <a href="#" className="hover:text-brand"><InstagramIcon /></a>
              <a href="#" className="hover:text-brand"><TwitterIcon /></a>
              <a href="#" className="hover:text-brand"><LinkedinIcon /></a>
              <a href="#" className="hover:text-brand"><MailIcon /></a>
            </div>
          </div>

          {/* Prev / next */}
          <div className="mt-6 flex items-center justify-between gap-4">
            <Link href={`/blog/${prev.slug}`} className="flex items-center gap-2 text-xs uppercase tracking-[0.08em] text-muted hover:text-brand">
              <ChevronLeft className="h-4 w-4" /> {prev.title}
            </Link>
            <Link href={`/blog/${next.slug}`} className="flex items-center gap-2 text-right text-xs uppercase tracking-[0.08em] text-brand hover:text-ink">
              {next.title} <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Comments */}
          <div className="mt-14">
            <h3 className="mb-8 text-lg font-light uppercase tracking-[0.08em] text-ink">3 Comments</h3>
            <ul className="space-y-6">
              {comments.map((c, i) => (
                <li key={i} className={`flex gap-4 ${c.reply ? "ml-10" : ""}`}>
                  <Ph src={commentAvatars[i % commentAvatars.length]} alt={c.name} sizes="48px" className="h-12 w-12 shrink-0 rounded-full" />
                  <div>
                    <p className="text-sm font-medium text-ink">
                      {c.name} <span className="ml-2 text-xs font-normal text-muted">{c.date}</span>
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {c.text}
                    </p>
                    <button className="mt-1 text-xs font-medium text-brand hover:text-ink">Read More</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Leave a comment */}
          <div className="mt-14">
            <h3 className="mb-6 text-lg font-light uppercase tracking-[0.08em] text-ink">Leave A Comment</h3>
            <BlogCommentForm />
          </div>
        </div>
      </article>

      {/* Related posts */}
      <section className="container-x py-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="section-heading">Related Posts</h2>
          <Link href="/blog" className="text-xs font-medium uppercase tracking-[0.12em] text-muted hover:text-brand">
            Read Blogs
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {related.map((p) => (
            <article key={p.slug} className="group">
              <Link href={`/blog/${p.slug}`} className="block aspect-[4/3] overflow-hidden">
                <Ph src={p.image} alt={p.title} sizes="(max-width: 768px) 100vw, 380px" className="h-full w-full transition-transform duration-500 group-hover:scale-105" />
              </Link>
              <p className="mt-4 text-[11px] uppercase tracking-[0.1em] text-muted">{p.date} · {p.category}</p>
              <h3 className="mt-2 text-sm font-medium uppercase tracking-[0.04em] text-ink group-hover:text-brand">
                <Link href={`/blog/${p.slug}`}>{p.title}</Link>
              </h3>
            </article>
          ))}
        </div>
      </section>

      <Newsletter />
    </>
  );
}
