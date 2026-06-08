import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getBrandBySlug,
  getIssueBySlug,
  getModelsWithPrices,
  getAllBrandIssueSlugs,
} from "@/lib/repairs";
import { generateRepairPageMetadata } from "@/lib/seo/metadata";
import { BreadcrumbJsonLd } from "@/lib/seo/json-ld";
import { WHATSAPP_URL, BUSINESS_PHONE } from "@/lib/seo/business-info";
import { BookingCta } from "@/components/marketing/booking-cta";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gaganmobilecare.in";

type Props = { params: Promise<{ brand: string; issue: string }> };

export async function generateStaticParams() {
  return getAllBrandIssueSlugs();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand: brandSlug, issue: issueSlug } = await params;
  const [brand, issue] = await Promise.all([getBrandBySlug(brandSlug), getIssueBySlug(issueSlug)]);
  if (!brand || !issue) return {};
  return generateRepairPageMetadata(brand.name, brand.slug, issue.name, issue.slug, issue.range_min);
}

export default async function RepairPage({ params }: Props) {
  const { brand: brandSlug, issue: issueSlug } = await params;
  const [brand, issue, models] = await Promise.all([
    getBrandBySlug(brandSlug),
    getIssueBySlug(issueSlug),
    getModelsWithPrices(brandSlug, issueSlug),
  ]);
  if (!brand || !issue) notFound();

  const lowestPrice = models.length > 0
    ? Math.min(...models.map((m) => m.price ?? issue.range_min))
    : issue.range_min;

  const groupedModels = models.reduce<Record<string, typeof models>>((acc, model) => {
    const key = model.series ?? "Other";
    (acc[key] ??= []).push(model);
    return acc;
  }, {});

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteUrl },
          { name: "Repairs", url: `${siteUrl}/repairs` },
          { name: brand.name, url: `${siteUrl}/repairs/${brand.slug}` },
          { name: issue.name, url: `${siteUrl}/repairs/${brand.slug}/${issue.slug}` },
        ]}
      />
      <main className="py-16 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
        <nav className="flex items-center gap-2 text-xs font-mono text-[var(--color-ink-3)] mb-10 uppercase tracking-widest flex-wrap">
          <Link href="/" className="hover:text-[var(--color-ink)] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/repairs" className="hover:text-[var(--color-ink)] transition-colors">Repairs</Link>
          <span>/</span>
          <Link href={`/repairs/${brand.slug}`} className="hover:text-[var(--color-ink)] transition-colors">{brand.name}</Link>
          <span>/</span>
          <span className="text-[var(--color-ink)]">{issue.name}</span>
        </nav>

        <div className="grid lg:grid-cols-[1fr_320px] gap-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                style={{ backgroundColor: brand.tone }}
              >
                {brand.glyph}
              </div>
              <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-ink-3)]">
                {brand.name} · {issue.name}
              </p>
            </div>

            <h1 className="font-serif text-4xl md:text-5xl tracking-tight leading-tight text-[var(--color-ink)] mb-2">
              {brand.name} {issue.name}
            </h1>

            <div className="flex items-baseline gap-2 mb-4">
              <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-ink-3)]">From</p>
              <p className="font-serif text-4xl text-[var(--color-ink)] leading-none">
                ₹{lowestPrice.toLocaleString("en-IN")}
              </p>
            </div>

            {issue.description && (
              <p className="text-[var(--color-ink-3)] text-base mb-10 max-w-lg">{issue.description}</p>
            )}

            {models.length > 0 ? (
              <div className="space-y-8">
                {Object.entries(groupedModels).map(([series, seriesModels]) => (
                  <div key={series}>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)] mb-3">{series}</p>
                    <div className="divide-y divide-[var(--color-line)] border border-[var(--color-line)] rounded-2xl overflow-hidden">
                      {seriesModels.map((model) => (
                        <div key={model.id} className="flex items-center justify-between px-5 py-4 bg-white">
                          <span className="text-[15px] text-[var(--color-ink)]">{model.name}</span>
                          <span className="font-serif text-xl text-[var(--color-ink)] shrink-0 ml-4">
                            {model.price !== null
                              ? `₹${model.price.toLocaleString("en-IN")}`
                              : `₹${issue.range_min.toLocaleString("en-IN")}+`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-[var(--color-line)] rounded-2xl p-6 text-[var(--color-ink-3)]">
                <p>Price confirmed on call. Starting from ₹{issue.range_min.toLocaleString("en-IN")}.</p>
              </div>
            )}

            <p className="text-[12px] text-[var(--color-ink-3)] mt-6">
              Prices are for OEM-grade parts. Final price confirmed before repair starts.
            </p>
          </div>

          <div className="lg:sticky lg:top-24 self-start space-y-4">
            <div className="bg-[var(--color-bg-soft)] rounded-2xl p-6">
              <p className="font-semibold text-[var(--color-ink)] mb-1">Book this repair</p>
              <p className="text-sm text-[var(--color-ink-3)] mb-6">
                We&apos;ll confirm the exact price on a quick call before starting any work.
              </p>
              <BookingCta className="block w-full text-center bg-[var(--color-ink)] text-white rounded-full px-5 py-3 text-sm font-medium hover:opacity-90 transition-opacity mb-3">
                Book a repair
              </BookingCta>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center border border-[var(--color-line)] text-[var(--color-ink)] rounded-full px-5 py-3 text-sm font-medium hover:border-[var(--color-ink)] transition-colors"
              >
                WhatsApp us
              </a>
            </div>

            <div className="border border-[var(--color-line)] rounded-2xl p-6 space-y-3">
              {["Genuine & OEM-grade parts", "6-month warranty on repair", "Most repairs done same day", "Send by post from anywhere in India"].map((item) => (
                <div key={item} className="flex gap-3 text-sm">
                  <span className="text-[var(--color-ink-3)]">✓</span>
                  <span className="text-[var(--color-ink)]">{item}</span>
                </div>
              ))}
            </div>

            <a
              href={`tel:${BUSINESS_PHONE}`}
              className="block w-full text-center text-sm text-[var(--color-ink-3)] hover:text-[var(--color-ink)] transition-colors"
            >
              Or call us: {BUSINESS_PHONE}
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
