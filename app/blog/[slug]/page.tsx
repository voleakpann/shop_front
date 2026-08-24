import { notFound } from "next/navigation";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import CommentThread from "@/components/CommentThread";
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
import { blogInlineImage } from "@/lib/data";

async function fetchBlogPost(slug: string) {
  try {
    const url = `/api/blog-posts/${slug}`;
    console.log("Fetching blog post from:", url);
    const res = await fetch(url, {
      cache: "no-store",
    });
    console.log("Blog post response status:", res.status, res.statusText);
    if (!res.ok) {
      console.error("Failed to fetch blog post: non-200 response");
      return null;
    }
    const data = await res.json();
    console.log("Blog post fetched successfully:", data.title);
    return data;
  } catch (err) {
    console.error("Failed to fetch blog post:", err);
    return null;
  }
}

async function fetchAllPosts() {
  try {
    const res = await fetch("/api/blog-posts?page=0&size=100", {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.content || [];
  } catch (err) {
    console.error("Failed to fetch posts:", err);
    return [];
  }
}

export function generateStaticParams() {
  return [{ slug: "technology-hack-you-wont-get" }];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await fetchBlogPost(slug);
  return { title: post ? `${post.title} — MiniStore` : "Blog — MiniStore" };
}

type BlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  coverImage?: string;
  authorName?: string;
};

function getImageForPost(post: BlogPost): string {
  // Use API image directly
  return post.coverImage || "/images/post-image.jpg";
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await fetchBlogPost(slug);
  if (!post) notFound();

  const allPosts = await fetchAllPosts();
  const related = allPosts.filter((p: BlogPost) => p.slug !== post.slug).slice(0, 3);
  const idx = allPosts.findIndex((p: BlogPost) => p.slug === post.slug);
  const prev = allPosts[(idx - 1 + allPosts.length) % allPosts.length];
  const next = allPosts[(idx + 1) % allPosts.length];

  const postDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <>
      <PageHeader title="Blog" crumbs={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: post.category }]} />

      <article className="container-x py-14">
        <div className="mx-auto max-w-3xl">
          <p className="text-[11px] uppercase tracking-[0.1em] text-muted">
            {postDate} · {post.category}
          </p>
          <h1 className="mt-3 text-2xl font-normal uppercase tracking-[0.04em] text-ink sm:text-3xl">
            {post.title}
          </h1>

          <Ph src={getImageForPost(post)} alt={post.title} sizes="(max-width: 768px) 100vw, 768px" className="mt-8 aspect-[16/9] w-full" />

          <div className="mt-8 space-y-5 text-sm leading-relaxed text-muted">
            <p>{post.excerpt}</p>

            <div className="grid grid-cols-1 gap-6 py-4 sm:grid-cols-[200px_1fr] sm:items-center">
              <Ph src={blogInlineImage} alt="Detail" sizes="200px" className="aspect-square w-full" />
              <div>
                <h4 className="text-sm font-medium uppercase tracking-[0.1em] text-ink">
                  {post.title}
                </h4>
                <p className="mt-2">
                  {post.excerpt}
                </p>
              </div>
            </div>
          </div>

          {/* Tags + share */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-line py-5">
            <p className="text-xs text-muted">
              Tags: <span className="text-ink">{post.category}</span>
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

          {/* Comments — real, auth-aware (logged-in users just type; others are
              prompted to sign in with Google; name/email come from the account) */}
          <div id="comments" className="mt-14 scroll-mt-20">
            <CommentThread slug={`blog-${post.slug}`} />
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
          {related.map((p: BlogPost) => {
            const relatedDate = new Date(p.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            });
            return (
              <article key={p.slug} className="group">
                <Link href={`/blog/${p.slug}`} className="block aspect-[4/3] overflow-hidden">
                  <Ph src={getImageForPost(p)} alt={p.title} sizes="(max-width: 768px) 100vw, 380px" className="h-full w-full transition-transform duration-500 group-hover:scale-105" />
                </Link>
                <p className="mt-4 text-[11px] uppercase tracking-[0.1em] text-muted">{relatedDate} · {p.category}</p>
                <h3 className="mt-2 text-sm font-medium uppercase tracking-[0.04em] text-ink group-hover:text-brand">
                  <Link href={`/blog/${p.slug}`}>{p.title}</Link>
                </h3>
              </article>
            );
          })}
        </div>
      </section>

      <Newsletter />
    </>
  );
}
