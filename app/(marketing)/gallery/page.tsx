import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getGalleryImages } from "@/lib/repairs";
import { BUSINESS_NAME, BUSINESS_ADDRESS } from "@/lib/seo/business-info";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: `Gallery — ${BUSINESS_NAME}`,
  description: `Photos from ${BUSINESS_NAME} in ${BUSINESS_ADDRESS}. See our workshop, team, and repair work.`,
};

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 md:py-16">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[var(--color-ink-3)] mb-8">
        <Link href="/" className="hover:text-[var(--color-ink)] transition-colors">Home</Link>
        <span>/</span>
        <span className="text-[var(--color-ink)]">Gallery</span>
      </nav>

      {/* Header */}
      <Reveal as="div" className="mb-10 md:mb-14">
        <p className="text-xs font-semibold tracking-widest uppercase text-[var(--color-ink-3)] mb-2">
          Our Workshop
        </p>
        <h1
          className="text-4xl md:text-5xl tracking-tight text-[var(--color-ink)] leading-tight mb-3"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Gallery
        </h1>
        <p className="text-[var(--color-ink-3)] text-base max-w-xl">
          Inside our shop, our repairs, and our team at {BUSINESS_NAME}, Patiala.
        </p>
      </Reveal>

      {images.length === 0 ? (
        <Reveal as="div" className="flex flex-col items-center justify-center py-24 gap-3 text-center">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-ink-4)]">
            <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <p className="text-[var(--color-ink-3)] text-sm">Photos coming soon.</p>
        </Reveal>
      ) : (
        <RevealGroup className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
          {images.map((img) => (
            <RevealItem
              key={img.id}
              className="relative aspect-square overflow-hidden rounded-xl bg-[var(--color-bg-soft)] group border border-[var(--color-line)]"
            >
              <Image
                src={img.url}
                alt={img.caption ?? `${BUSINESS_NAME} workshop photo`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              />
              {img.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-xs leading-snug">{img.caption}</p>
                </div>
              )}
            </RevealItem>
          ))}
        </RevealGroup>
      )}

      {/* Back link */}
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
