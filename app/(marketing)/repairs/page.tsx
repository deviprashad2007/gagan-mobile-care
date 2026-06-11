import type { Metadata } from "next";
import Link from "next/link";
import { getBrands, getCategories } from "@/lib/repairs";
import { generateRepairsMetadata } from "@/lib/seo/metadata";
import { BreadcrumbJsonLd } from "@/lib/seo/json-ld";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { BrandIcon } from "@/components/marketing/brand-icon";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gaganmobilecare.com";

export const metadata: Metadata = generateRepairsMetadata();

export default async function RepairsPage() {
  const [categories, brands] = await Promise.all([getCategories(), getBrands()]);

  // Group brands by category, uncategorised brands fall into a catch-all
  const grouped = categories.map((cat) => ({
    cat,
    brands: brands.filter((b) => b.category_id === cat.id),
  })).filter((g) => g.brands.length > 0);

  const uncategorised = brands.filter((b) => !b.category_id);

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
            {brands.length} brands · {categories.length} device type{categories.length !== 1 ? "s" : ""}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl tracking-tight leading-tight text-[var(--color-ink)] mb-4">
            What needs fixing?
          </h1>
          <p className="text-[var(--color-ink-3)] text-base mb-12 max-w-xl">
            Choose your device type and brand to see prices for screen replacement, battery, charging port and more.
          </p>
        </Reveal>

        {grouped.map(({ cat, brands: catBrands }) => (
          <section key={cat.id} className="mb-14">
            <Reveal as="div">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-2xl">{cat.icon}</span>
                <h2 className="font-serif text-2xl md:text-3xl tracking-tight text-[var(--color-ink)]">
                  {cat.name}
                </h2>
                {cat.description && (
                  <p className="hidden md:block text-sm text-[var(--color-ink-3)] ml-2">
                    — {cat.description}
                  </p>
                )}
              </div>
            </Reveal>

            <RevealGroup className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {catBrands.map((brand) => (
                <RevealItem key={brand.id}>
                  <Link
                    href={`/repairs/${brand.slug}`}
                    className="group flex flex-col items-center gap-3 card-surface border rounded-2xl p-4 hover:border-[var(--color-ink-4)] transition-all hover:scale-[1.04] hover:shadow-[var(--shadow-float)]"
                  >
                    <BrandIcon
                      slug={brand.slug}
                      name={brand.name}
                      tone={brand.tone}
                      glyph={brand.glyph}
                      logo_url={brand.logo_url}
                      size={52}
                    />
                    <span className="text-[13px] font-medium text-[var(--color-ink)] text-center leading-tight group-hover:underline underline-offset-2">
                      {brand.name}
                    </span>
                  </Link>
                </RevealItem>
              ))}
            </RevealGroup>
          </section>
        ))}

        {uncategorised.length > 0 && (
          <section className="mb-14">
            <Reveal as="div">
              <h2 className="font-serif text-2xl tracking-tight text-[var(--color-ink)] mb-6">Other</h2>
            </Reveal>
            <RevealGroup className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {uncategorised.map((brand) => (
                <RevealItem key={brand.id}>
                  <Link
                    href={`/repairs/${brand.slug}`}
                    className="group flex flex-col items-center gap-3 card-surface border rounded-2xl p-4 hover:border-[var(--color-ink-4)] transition-all hover:scale-[1.04] hover:shadow-[var(--shadow-float)]"
                  >
                    <BrandIcon
                      slug={brand.slug}
                      name={brand.name}
                      tone={brand.tone}
                      glyph={brand.glyph}
                      logo_url={brand.logo_url}
                      size={52}
                    />
                    <span className="text-[13px] font-medium text-[var(--color-ink)] text-center leading-tight group-hover:underline underline-offset-2">
                      {brand.name}
                    </span>
                  </Link>
                </RevealItem>
              ))}
            </RevealGroup>
          </section>
        )}

        <Reveal as="div" delay={0.1} className="mt-4 bg-[var(--color-bg-soft)] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-[var(--color-ink)]">Don&apos;t see your device?</p>
            <p className="text-sm text-[var(--color-ink-3)] mt-1">Call or WhatsApp us — we repair most Android, iOS, laptops and tablets.</p>
          </div>
          <a
            href="tel:+919814036114"
            className="inline-flex items-center gap-2 text-sm font-medium bg-[var(--color-ink)] text-[var(--color-bg)] rounded-full px-5 py-2.5 hover:opacity-90 transition-opacity shrink-0"
          >
            Call for a quote
          </a>
        </Reveal>
      </main>
    </>
  );
}
