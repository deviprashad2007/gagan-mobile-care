import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

const reviews = [
  {
    name: "Priya M.",
    location: "Guwahati",
    stars: 5,
    badge: "Post" as const,
    quote:
      "Sent my Pixel 7 from Assam. Got it back in 5 days, charging port fixed, paid on delivery. Genuinely surprised this exists.",
  },
  {
    name: "Aman K.",
    location: "Patiala",
    stars: 5,
    badge: "Walk-in" as const,
    quote:
      "Cracked screen on my iPhone 13. Walked in at 11, picked up at 1 PM. Honest pricing, no upselling. Will recommend.",
  },
  {
    name: "Rohini S.",
    location: "Bangalore",
    stars: 5,
    badge: "Post" as const,
    quote:
      "Galaxy S22 wouldn't turn on after a fall. They gave me a fixed quote on call, no hidden charges. Phone's been perfect for 4 months.",
  },
  {
    name: "Sahil J.",
    location: "Patiala",
    stars: 4,
    badge: "Walk-in" as const,
    quote:
      "Battery on OnePlus 9 was draining in 4 hours. Replaced same day. Could be faster, but result is great.",
  },
] as const;

function StarRating({ count, total = 5 }: { count: number; total?: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of ${total} stars`}>
      {Array.from({ length: total }).map((_, i) => (
        <svg
          key={i}
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill={i < count ? "var(--color-accent)" : "var(--color-line)"}
          stroke="none"
          aria-hidden="true"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section
      id="stories"
      className="py-16 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto"
    >
      {/* Header */}
      <Reveal as="div" className="mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-ink-3)] mb-3">
          What people say
        </p>
        <h2 className="font-serif text-4xl md:text-5xl tracking-tight leading-tight text-[var(--color-ink)]">
          Real customers. <em>Real repairs.</em>
        </h2>
      </Reveal>

      {/* Grid */}
      <RevealGroup className="grid lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {reviews.map((review) => (
          <RevealItem
            key={review.name}
            className="bg-white border border-[var(--color-line)] rounded-2xl p-5 flex flex-col transition-shadow hover:shadow-[var(--shadow-float)]"
          >
            <StarRating count={review.stars} />
            <blockquote className="font-serif italic text-[15px] text-[var(--color-ink-2)] leading-relaxed mt-4 flex-1">
              &ldquo;{review.quote}&rdquo;
            </blockquote>
            <div className="flex items-center gap-2.5 mt-5 pt-4 border-t border-[var(--color-line)]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#d8d2c5] to-[#b9b3a7] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {review.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[var(--color-ink)] leading-none">
                  {review.name}
                </p>
                <p className="text-[11px] text-[var(--color-ink-3)] mt-0.5">
                  {review.location}
                </p>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-[var(--color-bg-soft)] text-[var(--color-ink-3)] flex-shrink-0">
                {review.badge}
              </span>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
