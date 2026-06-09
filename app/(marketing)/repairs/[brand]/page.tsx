import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBrandBySlug, getAllBrandSlugs, getIssues } from "@/lib/repairs";
import { generateBrandRepairsMetadata } from "@/lib/seo/metadata";
import { BreadcrumbJsonLd } from "@/lib/seo/json-ld";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { BrandIcon } from "@/components/marketing/brand-icon";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gaganmobilecare.in";

type Props = { params: Promise<{ brand: string }> };

export async function generateStaticParams() {
  const slugs = await getAllBrandSlugs();
  return slugs.map((brand) => ({ brand }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand: brandSlug } = await params;
  const brand = await getBrandBySlug(brandSlug);
  if (!brand) return {};
  return generateBrandRepairsMetadata(brand.name, brand.slug);
}

export default async function BrandRepairsPage({ params }: Props) {
  const { brand: brandSlug } = await params;
  const [brand, issues] = await Promise.all([getBrandBySlug(brandSlug), getIssues()]);
  if (!brand) notFound();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteUrl },
          { name: "Repairs", url: `${siteUrl}/repairs` },
          { name: brand.name, url: `${siteUrl}/repairs/${brand.slug}` },
        ]}
      />
      <main className="py-16 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
        <nav className="flex items-center gap-2 text-xs font-mono text-[var(--color-ink-3)] mb-10 uppercase tracking-widest flex-wrap">
          <Link href="/" className="hover:text-[var(--color-ink)] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/repairs" className="hover:text-[var(--color-ink)] transition-colors">Repairs</Link>
          <span>/</span>
          <span className="text-[var(--color-ink)]">{brand.name}</span>
        </nav>

        <Reveal as="div">
        <div className="flex items-center gap-4 mb-4">
          <BrandIcon
            slug={brand.slug}
            name={brand.name}
            tone={brand.tone}
            glyph={brand.glyph}
            size={56}
            className="rounded-2xl"
          />
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-ink-3)]">
              {issues.length} repair types available
            </p>
            <h1 className="font-serif text-4xl md:text-5xl tracking-tight leading-tight text-[var(--color-ink)]">
              {brand.name} repairs
            </h1>
          </div>
        </div>

        <p className="text-[var(--color-ink-3)] text-base mb-12 max-w-xl">
          Select the issue to see model-by-model prices. Walk in to our Patiala shop or send your phone by post from anywhere in India.
        </p>
        </Reveal>

        <RevealGroup className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {issues.map((issue) => (
            <RevealItem key={issue.id}>
            <Link
              href={`/repairs/${brand.slug}/${issue.slug}`}
              className="group flex flex-col bg-white border border-[var(--color-line)] rounded-2xl p-5 hover:border-[var(--color-ink-4)] transition-all hover:scale-[1.02] hover:shadow-[var(--shadow-float)]"
            >
              <p className="text-base font-semibold text-[var(--color-ink)] group-hover:underline underline-offset-2">
                {issue.name}
              </p>
              {issue.description && (
                <p className="text-[13px] text-[var(--color-ink-3)] mt-1 mb-5">{issue.description}</p>
              )}
              <div className="mt-auto flex items-baseline justify-between pt-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)]">From</p>
                  <p className="font-serif text-3xl text-[var(--color-ink)] leading-none mt-0.5">
                    ₹{issue.range_min.toLocaleString("en-IN")}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-sm text-[var(--color-ink)] border border-[var(--color-line)] rounded-full px-3.5 py-1.5 group-hover:border-[var(--color-ink)] transition-colors">
                  See prices
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </div>
            </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </main>
    </>
  );
}
