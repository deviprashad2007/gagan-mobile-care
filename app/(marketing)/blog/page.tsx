import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getBlogPosts } from "@/lib/repairs";
import { BUSINESS_NAME, BUSINESS_ADDRESS } from "@/lib/seo/business-info";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: `Blog — ${BUSINESS_NAME}`,
  description: `Phone repair tips, guides, and news from ${BUSINESS_NAME} in ${BUSINESS_ADDRESS}.`,
};

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export default async function BlogIndexPage() {
  const posts = await getBlogPosts();

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 md:py-16">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[var(--color-ink-3)] mb-8">
        <Link href="/" className="hover:text-[var(--color-ink)] transition-colors">Home</Link>
        <span>/</span>
        <span className="text-[var(--color-ink)]">Blog</span>
      </nav>

      <Reveal as="div" className="mb-10 md:mb-14">
        <p className="text-xs font-semibold tracking-widest uppercase text-[var(--color-ink-3)] mb-2">
          From the workshop
        </p>
        <h1
          className="text-4xl md:text-5xl tracking-tight text-[var(--color-ink)] leading-tight mb-3"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Blog
        </h1>
        <p className="text-[var(--color-ink-3)] text-base max-w-xl">
          Repair tips, common phone problems, and guides from {BUSINESS_NAME}, Patiala.
        </p>
      </Reveal>

      {posts.length === 0 ? (
        <Reveal as="div" className="flex flex-col items-center justify-center py-24 gap-3 text-center">
          <p className="text-[var(--color-ink-3)] text-sm">No posts yet — check back soon.</p>
        </Reveal>
      ) : (
        <RevealGroup as="div" className="flex flex-col gap-6">
          {posts.map((post) => (
            <RevealItem key={post.id}>
            <Link
              href={`/blog/${post.slug}`}
              className="group flex flex-col sm:flex-row gap-4 sm:gap-6 card-surface border rounded-2xl overflow-hidden hover:border-[var(--color-ink-4)] transition-colors no-underline text-inherit"
            >
              {post.cover_image_url && (
                <div className="relative w-full sm:w-56 aspect-[2/1] sm:aspect-square shrink-0 overflow-hidden bg-[var(--color-bg-soft)]">
                  <Image
                    src={post.cover_image_url}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 224px"
                  />
                </div>
              )}
              <div className="flex flex-col justify-center px-5 py-4 sm:py-5 sm:pl-0 flex-1 min-w-0">
                <p className="text-xs text-[var(--color-ink-3)] mb-1.5">{formatDate(post.published_at)}</p>
                <h2 className="text-lg md:text-xl font-semibold text-[var(--color-ink)] leading-snug mb-1.5 group-hover:underline underline-offset-4">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-sm text-[var(--color-ink-3)] line-clamp-2">{post.excerpt}</p>
                )}
              </div>
            </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      )}

      <div className="mt-12 pt-8 border-t border-[var(--color-line)]">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-ink-3)] hover:text-[var(--color-ink)] transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to home
        </Link>
      </div>
    </main>
  );
}
