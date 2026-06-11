import Image from "next/image";
import Link from "next/link";
import type { GalleryImage } from "@/lib/repairs";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

interface Props {
  images: GalleryImage[];
}

// Cycles through varied tile spans so the grid reads as a mosaic rather than a uniform grid
const TILE_SPANS = [
  "sm:col-span-2 sm:row-span-2",
  "",
  "",
  "sm:row-span-2",
  "",
  "sm:col-span-2",
  "sm:row-span-2",
  "",
];

const TILE_COUNT = 8;

function PlaceholderTile() {
  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-xl card-surface border border-dashed">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-ink-4)]" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    </div>
  );
}

export function GallerySection({ images }: Props) {
  const shown = images.slice(0, TILE_COUNT);
  const placeholderCount = TILE_COUNT - shown.length;

  return (
    <section id="gallery" aria-label="Shop gallery" className="py-16 md:py-24 bg-[var(--color-bg-soft)]">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <Reveal as="div" className="flex items-end justify-between mb-8 md:mb-10">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-[var(--color-ink-3)] mb-2">
              Our Workshop
            </p>
            <h2
              className="text-3xl md:text-4xl tracking-tight text-[var(--color-ink)] leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              See us in action
            </h2>
          </div>
          {images.length > shown.length && (
            <Link
              href="/gallery"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-ink)] underline underline-offset-4 hover:opacity-70 transition-opacity shrink-0 ml-6"
            >
              View all photos
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </Reveal>

        {/* Mosaic grid — varied tile sizes, like a wall of workshop photos */}
        <RevealGroup className="grid grid-cols-2 sm:grid-cols-4 auto-rows-[150px] sm:auto-rows-[160px] gap-3 sm:gap-4">
          {shown.map((img, i) => (
            <RevealItem
              key={img.id}
              className={`relative overflow-hidden rounded-xl bg-[var(--color-line)] group ${TILE_SPANS[i % TILE_SPANS.length]}`}
            >
              <Image
                src={img.url}
                alt={img.caption ?? "Gagan Mobile Hospital workshop photo"}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, 25vw"
              />
              {img.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-xs">{img.caption}</p>
                </div>
              )}
            </RevealItem>
          ))}
          {Array.from({ length: placeholderCount }).map((_, i) => (
            <RevealItem
              key={`placeholder-${i}`}
              className={`relative ${TILE_SPANS[(shown.length + i) % TILE_SPANS.length]}`}
            >
              <PlaceholderTile />
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Mobile "view all" link */}
        {images.length > shown.length && (
          <div className="mt-6 flex justify-center sm:hidden">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-ink)] underline underline-offset-4"
            >
              View all photos
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
