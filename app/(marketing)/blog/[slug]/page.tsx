import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPostBySlug, getAllBlogSlugs } from "@/lib/repairs";
import { BUSINESS_NAME } from "@/lib/seo/business-info";
import { BreadcrumbJsonLd } from "@/lib/seo/json-ld";
import { Reveal } from "@/components/motion/reveal";

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};

  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gaganmobilecare.in";
  const description = post.excerpt ?? post.content.slice(0, 160);

  return {
    title: `${post.title} — ${BUSINESS_NAME} Blog`,
    description,
    alternates: { canonical: `${base}/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description,
      type: "article",
      publishedTime: post.published_at ?? undefined,
      images: post.cover_image_url ? [{ url: post.cover_image_url }] : undefined,
    },
  };
}

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

function ArticleJsonLd({ post, url }: { post: NonNullable<Awaited<ReturnType<typeof getBlogPostBySlug>>>; url: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt ?? post.content.slice(0, 160),
    image: post.cover_image_url ?? undefined,
    datePublished: post.published_at ?? undefined,
    dateModified: post.updated_at,
    author: { "@type": "Organization", name: BUSINESS_NAME },
    publisher: { "@type": "Organization", name: BUSINESS_NAME },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gaganmobilecare.in";
  const url = `${base}/blog/${post.slug}`;
  const paragraphs = post.content.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  return (
    <>
      <ArticleJsonLd post={post} url={url} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: base },
          { name: "Blog", url: `${base}/blog` },
          { name: post.title, url },
        ]}
      />
      <main className="max-w-2xl mx-auto px-4 py-10 md:py-16">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[var(--color-ink-3)] mb-8 flex-wrap">
          <Link href="/" className="hover:text-[var(--color-ink)] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[var(--color-ink)] transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-[var(--color-ink)] truncate min-w-0">{post.title}</span>
        </nav>

        <Reveal as="div">
        <article>
          <header className="mb-8">
            <p className="text-xs text-[var(--color-ink-3)] mb-3">{formatDate(post.published_at)}</p>
            <h1
              className="text-3xl md:text-4xl tracking-tight text-[var(--color-ink)] leading-tight mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="text-base text-[var(--color-ink-3)] leading-relaxed">{post.excerpt}</p>
            )}
          </header>

          {post.cover_image_url && (
            <div className="relative w-full aspect-[2/1] rounded-2xl overflow-hidden bg-[var(--color-bg-soft)] mb-8">
              <Image
                src={post.cover_image_url}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 672px"
                priority
              />
            </div>
          )}

          <div className="flex flex-col gap-4">
            {paragraphs.map((para, i) => (
              <p key={i} className="text-[15px] text-[var(--color-ink-2)] leading-relaxed">
                {para}
              </p>
            ))}
          </div>
        </article>
        </Reveal>

        <div className="mt-12 pt-8 border-t border-[var(--color-line)]">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-ink-3)] hover:text-[var(--color-ink)] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            More posts
          </Link>
        </div>
      </main>
    </>
  );
}
