export function HeroSection() {
  return (
    <section
      id="hero"
      className="py-16 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto"
    >
      <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
        {/* Left column */}
        <div className="flex flex-col gap-6">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 self-start px-3 py-1.5 bg-white border border-[var(--color-line)] rounded-full text-sm text-[var(--color-ink-2)]">
            <span className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse flex-shrink-0" />
            Open now · Lajpat Nagar
          </div>

          {/* H1 */}
          <h1
            className="font-serif text-[clamp(48px,8vw,72px)] leading-none tracking-tight text-[var(--color-ink)]"
          >
            Cracked phone?
            <br />
            <em>Walk in,</em>
            <br />
            or send it by post.
          </h1>

          {/* Subtext */}
          <p className="text-[var(--color-ink-3)] text-base max-w-lg leading-relaxed">
            Free quote in 60 seconds. Genuine parts. 6-month warranty.
            Delhi&apos;s most trusted repair shop — 50,000+ phones fixed
            since 2014.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <a
              href="#book"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[var(--color-accent)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Get free quote
            </a>
            <a
              href="#post"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-[var(--color-ink)] text-[var(--color-ink)] text-sm font-medium hover:bg-[var(--color-bg-soft)] transition-colors"
            >
              How post repair works
            </a>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[var(--color-line)] border border-[var(--color-line)] rounded-2xl overflow-hidden mt-2">
            {[
              { value: "50,000+", label: "phones repaired" },
              { value: "4.8 / 5", label: "2,100 Google reviews" },
              { value: "6 months", label: "parts warranty" },
              { value: "90 min", label: "avg walk-in" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white px-4 py-4 flex flex-col gap-1"
              >
                <span className="font-serif text-2xl leading-none tracking-tight text-[var(--color-ink)]">
                  {stat.value}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--color-ink-3)]">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column — decorative card stack, desktop only */}
        <div className="hidden lg:block relative" style={{ minHeight: 480 }}>
          {/* Map-like grid background */}
          <div className="map-bg absolute inset-0 rounded-2xl" />

          {/* Card 1 — repair receipt */}
          <div
            className="absolute top-8 right-0 w-72 bg-white border border-[var(--color-line)] rounded-2xl p-4 shadow-[var(--shadow-float)]"
            style={{ transform: "rotate(-2.5deg)" }}
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <p className="text-sm font-semibold text-[var(--color-ink)]">
                  iPhone 14 Pro Screen
                </p>
                <p className="text-xs text-[var(--color-ink-3)] mt-0.5">
                  Replaced in 90 min
                </p>
              </div>
              <span className="text-[10px] font-bold bg-[var(--color-accent)] text-white px-2 py-0.5 rounded-md">
                DONE
              </span>
            </div>
            <div className="border-t border-[var(--color-line)] pt-3 flex items-baseline justify-between">
              <span className="font-serif text-2xl text-[var(--color-ink)]">
                ₹8,499
              </span>
              <span className="font-mono text-[11px] text-[var(--color-ink-4)] uppercase tracking-wide">
                Paid
              </span>
            </div>
          </div>

          {/* Card 2 — courier tracking */}
          <div
            className="absolute top-64 left-4 w-60 bg-white border border-[var(--color-line)] rounded-2xl p-3.5 shadow-[var(--shadow-float)] flex items-center gap-3"
            style={{ transform: "rotate(1.5deg)" }}
          >
            <div className="w-8 h-8 rounded-full bg-[var(--color-bg-ink)] flex items-center justify-center flex-shrink-0">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="text-xs leading-snug">
              <p className="font-semibold text-[var(--color-ink)]">
                Courier picked up
              </p>
              <p className="text-[var(--color-ink-3)] mt-0.5">
                Galaxy S23 · ETA Monday
              </p>
            </div>
          </div>

          {/* Card 3 — technician */}
          <div
            className="absolute bottom-12 right-6 w-56 bg-white border border-[var(--color-line)] rounded-2xl p-3.5 shadow-[var(--shadow-float)]"
            style={{ transform: "rotate(-1deg)" }}
          >
            <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)] mb-2">
              Your technician
            </p>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#d8d2c5] to-[#b9b3a7] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                RK
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--color-ink)]">
                  Rakesh K.
                </p>
                <p className="text-[11px] text-[var(--color-ink-3)]">
                  9 yrs experience · 4,200 repairs
                </p>
              </div>
            </div>
          </div>

          {/* Accent pin pulses */}
          <div
            className="absolute"
            style={{ top: 200, right: 120 }}
          >
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent)] opacity-50" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-[var(--color-accent)] border-2 border-white" />
            </span>
          </div>
          <div
            className="absolute"
            style={{ bottom: 180, left: 70 }}
          >
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-bg-ink)] opacity-40" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[var(--color-bg-ink)] border-2 border-white" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
