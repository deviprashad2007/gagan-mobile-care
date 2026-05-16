import { WHATSAPP_URL } from "@/lib/seo/business-info";

const steps = [
  {
    n: "01",
    title: "Book online",
    description: "Pick brand, model, issue. Quote in 60 seconds.",
  },
  {
    n: "02",
    title: "Pack safely",
    description:
      "Bubble-wrap + box. We send Speed Post label by WhatsApp.",
  },
  {
    n: "03",
    title: "Drop & track",
    description:
      "Any India Post counter. We track and update you daily.",
  },
  {
    n: "04",
    title: "Repair & QC",
    description: "32-point quality check on all repairs.",
  },
  {
    n: "05",
    title: "Cash on return",
    description: "Pay the postman the locked-in price. Done.",
  },
] as const;

export function PostFlow() {
  return (
    <section
      id="post"
      className="py-16 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto"
    >
      <div className="bg-[var(--color-bg-ink)] rounded-2xl p-8 md:p-10 relative overflow-hidden">
        {/* Decorative dashed route lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M-50 380 Q200 200 480 280 T960 200 T1400 320"
            stroke="rgba(230,51,41,0.5)"
            strokeWidth="1.5"
            strokeDasharray="3 5"
            fill="none"
          />
          <path
            d="M0 480 Q300 380 600 460 T1200 360"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
            strokeDasharray="2 4"
            fill="none"
          />
        </svg>

        <div className="relative grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left — copy */}
          <div className="flex flex-col justify-center">
            <p className="font-mono text-[11px] uppercase tracking-widest text-white/60 mb-4">
              Send by post — anywhere in India
            </p>
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight leading-tight text-white">
              From <em>Kohima</em> to{" "}
              <em>Kanyakumari.</em>
            </h2>
            <p className="text-white/65 text-[15px] leading-relaxed mt-5 max-w-sm">
              No service in your city? You don&apos;t have to settle for the
              local guy. Speed Post reaches every PIN code — we cover the
              return courier.
            </p>
            <div className="flex flex-wrap gap-3 mt-7">
              <a
                href="#book"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[var(--color-accent)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Download packing guide
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-white/25 text-white text-sm font-medium hover:bg-white/10 transition-colors"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Right — steps */}
          <div className="flex flex-col">
            {steps.map((step, i) => (
              <div
                key={step.n}
                className={`flex items-start gap-5 py-4 ${i > 0 ? "border-t border-white/12" : ""}`}
              >
                <span className="font-mono text-2xl text-white/35 w-10 flex-shrink-0 leading-none pt-0.5">
                  {step.n}
                </span>
                <div>
                  <p className="text-sm font-semibold text-white leading-snug">
                    {step.title}
                  </p>
                  <p className="text-[13px] text-white/55 mt-0.5 leading-snug">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
