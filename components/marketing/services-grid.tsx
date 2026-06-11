import Link from "next/link";
import { BookingCta } from "./booking-cta";

const services = [
  {
    id: "screen",
    name: "Screen replacement",
    fromPrice: "₹1,499",
    brands: "iPhone, Galaxy, OnePlus, Pixel",
  },
  {
    id: "battery",
    name: "Battery swap",
    fromPrice: "₹799",
    brands: "All major brands",
  },
  {
    id: "camera",
    name: "Back camera repair",
    fromPrice: "₹1,299",
    brands: "iPhone 13–15, Galaxy S",
  },
  {
    id: "water",
    name: "Water damage recovery",
    fromPrice: "₹1,999",
    brands: "Liquid contact, deep clean",
  },
  {
    id: "back-glass",
    name: "Back glass replace",
    fromPrice: "₹999",
    brands: "iPhone 11–15, Galaxy S22+",
  },
  {
    id: "charging",
    name: "Charging port fix",
    fromPrice: "₹499",
    brands: "Type-C, Lightning, micro-USB",
  },
] as const;

export function ServicesGrid() {
  return (
    <section
      id="prices"
      className="py-16 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-ink-3)] mb-3">
            Popular fixes · transparent pricing
          </p>
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight leading-tight text-[var(--color-ink)]">
            Real prices for the things
            <br />
            that <em>actually break.</em>
          </h2>
        </div>
        <Link
          href="/repairs"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-ink)] border border-[var(--color-line)] rounded-full px-4 py-2 hover:border-[var(--color-ink)] transition-colors"
        >
          See all 50+ repairs
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        </Link>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="card-surface border rounded-2xl p-5 flex flex-col hover:border-[var(--color-ink-4)] transition-colors"
          >
            <p className="text-base font-semibold text-[var(--color-ink)]">
              {service.name}
            </p>
            <p className="text-[13px] text-[var(--color-ink-3)] mt-1 mb-5">
              {service.brands}
            </p>
            <div className="mt-auto flex items-baseline justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)]">
                  From
                </p>
                <p className="font-serif text-3xl text-[var(--color-ink)] leading-none mt-0.5">
                  {service.fromPrice}
                </p>
              </div>
              <BookingCta className="inline-flex items-center gap-1 text-sm text-[var(--color-ink)] border border-[var(--color-line)] rounded-full px-3.5 py-1.5 hover:border-[var(--color-ink)] hover:bg-[var(--color-bg-soft)] transition-colors">
                Book
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </BookingCta>
            </div>
          </div>
        ))}
      </div>

      {/* Footer link */}
      <div className="mt-6 text-center">
        <Link
          href="/repairs"
          className="text-sm text-[var(--color-ink-3)] hover:text-[var(--color-ink)] underline underline-offset-4 transition-colors"
        >
          See all 50+ repairs →
        </Link>
      </div>
    </section>
  );
}
