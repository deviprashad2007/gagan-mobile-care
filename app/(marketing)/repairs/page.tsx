import type { Metadata } from "next";
import Link from "next/link";
import { getBrands } from "@/lib/repairs";
import { generateRepairsMetadata } from "@/lib/seo/metadata";
import { BreadcrumbJsonLd } from "@/lib/seo/json-ld";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gaganmobilecare.in";

export const metadata: Metadata = generateRepairsMetadata();

export default async function RepairsPage() {
  const brands = await getBrands();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteUrl },
          { name: "Repairs", url: `${siteUrl}/repairs` },
        ]}
      />
      <main className="py-16 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
        <nav className="flex items-center gap-2 text-xs font-mono text-[var(--color-ink-3)] mb-10 uppercase tracking-widest">
          <Link href="/" className="hover:text-[var(--color-ink)] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[var(--color-ink)]">Repairs</span>
        </nav>

        <Reveal as="div">
        <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-ink-3)] mb-3">
          15 brands · 13 repair types
        </p>
        <h1 className="font-serif text-4xl md:text-5xl tracking-tight leading-tight text-[var(--color-ink)] mb-4">
          Which phone needs fixing?
        </h1>
        <p className="text-[var(--color-ink-3)] text-base mb-12 max-w-xl">
          Choose your brand to see prices for screen replacement, battery, charging port and more.
        </p>
        </Reveal>

        <RevealGroup className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {brands.map((brand) => (
            <RevealItem key={brand.id}>
            <Link
              href={`/repairs/${brand.slug}`}
              className="group flex flex-col items-center gap-3 bg-white border border-[var(--color-line)] rounded-2xl p-4 hover:border-[var(--color-ink-4)] transition-all hover:scale-[1.04] hover:shadow-[var(--shadow-float)]"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                style={{ backgroundColor: brand.tone }}
              >
                {brand.glyph}
              </div>
              <span className="text-[13px] font-medium text-[var(--color-ink)] text-center leading-tight group-hover:underline underline-offset-2">
                {brand.name}
              </span>
            </Link>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal as="div" delay={0.1} className="mt-16 bg-[var(--color-bg-soft)] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-[var(--color-ink)]">Don&apos;t see your model?</p>
            <p className="text-sm text-[var(--color-ink-3)] mt-1">Call or WhatsApp us — we repair most Android and iOS devices.</p>
          </div>
          <a
            href="tel:+919814036114"
            className="inline-flex items-center gap-2 text-sm font-medium bg-[var(--color-ink)] text-white rounded-full px-5 py-2.5 hover:opacity-90 transition-opacity shrink-0"
          >
            Call for a quote
          </a>
        </Reveal>
      </main>
    </>
  );
}
