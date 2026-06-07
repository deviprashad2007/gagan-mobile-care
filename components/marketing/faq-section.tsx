"use client";

import { useState } from "react";
import { WHATSAPP_URL } from "@/lib/seo/business-info";

const faqs = [
  {
    q: "How long does a walk-in repair take?",
    a: "Most repairs (screen, battery, charging port) done in 90 minutes while you wait. Complex repairs like water damage may take 1–2 days.",
  },
  {
    q: "What if my city doesn't have a repair shop?",
    a: "Speed Post your phone to us. We repair and ship back in 4–6 days. Pay cash on delivery — no upfront payment.",
  },
  {
    q: "Are the parts genuine?",
    a: "OEM-grade parts for all repairs. For Apple, Samsung and OnePlus screens we offer two grades with different price points, same 6-month warranty.",
  },
  {
    q: "What if you can't fix my phone?",
    a: "No fix, no fee. We ship it back free with a full diagnostic report.",
  },
  {
    q: "Do you offer pickup in Patiala?",
    a: "Yes — within Patiala city, our courier picks up and drops free. From other cities, the post option is faster and cheaper.",
  },
] as const;

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(i: number) {
    setOpenIndex(openIndex === i ? null : i);
  }

  return (
    <section
      id="faq"
      className="py-16 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto"
    >
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left — copy */}
        <div className="lg:sticky lg:top-20">
          <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-ink-3)] mb-3">
            Common questions
          </p>
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight leading-tight text-[var(--color-ink)]">
            Quick answers, <em>before you commit.</em>
          </h2>
          <p className="text-[var(--color-ink-3)] text-[15px] leading-relaxed mt-5 max-w-sm">
            Can&apos;t find it? Ping us on WhatsApp — we reply within 8 minutes
            during shop hours.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-full border border-[var(--color-line)] text-[var(--color-ink)] text-sm font-medium hover:border-[var(--color-ink)] hover:bg-[var(--color-bg-soft)] transition-colors"
          >
            Ask on WhatsApp
          </a>
        </div>

        {/* Right — accordion */}
        <div className="bg-white border border-[var(--color-line)] rounded-2xl divide-y divide-[var(--color-line)] overflow-hidden">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i}>
                <button
                  onClick={() => toggle(i)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-[var(--color-bg-soft)] transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-[15px] font-medium text-[var(--color-ink)] leading-snug">
                    {faq.q}
                  </span>
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full border border-[var(--color-line)] flex items-center justify-center text-[var(--color-ink-3)] transition-transform"
                    style={{ transform: isOpen ? "rotate(45deg)" : "none" }}
                    aria-hidden="true"
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-[14px] text-[var(--color-ink-2)] leading-relaxed max-w-xl">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
