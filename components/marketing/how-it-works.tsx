import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

const walkinSteps = [
  {
    n: "01",
    title: "Book a slot",
    description:
      "Tell us the brand, model and issue. 60 seconds, no signup required.",
  },
  {
    n: "02",
    title: "Walk in",
    description:
      "Bring your phone to our Patiala shop. We show you parts and the bill — nothing hidden.",
  },
  {
    n: "03",
    title: "Pay & leave",
    description:
      "Most repairs done in 90 minutes. 6-month warranty on all parts.",
  },
] as const;

const postSteps = [
  {
    n: "01",
    title: "We send a label",
    description:
      "You get a printable Speed Post label and packing checklist via WhatsApp.",
  },
  {
    n: "02",
    title: "Drop at any post office",
    description:
      "Or hand to our partner courier. We track the parcel for you.",
  },
  {
    n: "03",
    title: "Repaired & returned",
    description:
      "Pay cash on delivery when you receive it back. 4–6 days door-to-door.",
  },
] as const;

export function HowItWorks() {
  return (
    <section
      id="how"
      className="py-16 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto"
    >
      {/* Header */}
      <Reveal as="div" className="mb-10">
        <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-ink-3)] mb-3">
          Two ways, one promise
        </p>
        <h2 className="font-serif text-4xl md:text-5xl tracking-tight leading-tight text-[var(--color-ink)]">
          Come to <em>us</em>, or your phone <em>comes to us.</em>
        </h2>
      </Reveal>

      {/* Two cards */}
      <RevealGroup className="grid lg:grid-cols-2 gap-6">
        {/* Walk-in card */}
        <RevealItem className="bg-white border border-[var(--color-line)] rounded-2xl p-7 transition-shadow hover:shadow-[var(--shadow-float)]">
          <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--color-ink-3)] mb-5">
            Walk-in repair · ~90 min
          </p>
          <h3 className="font-serif text-3xl tracking-tight text-[var(--color-ink)] mb-2">
            Drop by the shop.
          </h3>
          <p className="text-sm text-[var(--color-ink-3)] mb-6 leading-relaxed max-w-sm">
            Village Baran, Sirhand Road, Patiala. We show you the parts and bill —
            nothing&apos;s hidden.
          </p>
          <div className="flex flex-col">
            {walkinSteps.map((step, i) => (
              <div
                key={step.n}
                className={`flex gap-4 py-4 ${i > 0 ? "border-t border-[var(--color-line)]" : ""}`}
              >
                <span className="font-mono text-2xl leading-none opacity-30 w-8 flex-shrink-0 text-[var(--color-ink)]">
                  {step.n}
                </span>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-ink)] mb-1">
                    {step.title}
                  </p>
                  <p className="text-[13px] text-[var(--color-ink-3)] leading-snug">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </RevealItem>

        {/* Post card */}
        <RevealItem className="bg-[var(--color-bg-ink)] rounded-2xl p-7 transition-shadow hover:shadow-[var(--shadow-float)]">
          <p className="font-mono text-[11px] uppercase tracking-widest text-white/60 mb-5">
            Send by post · 4–6 days
          </p>
          <h3 className="font-serif text-3xl tracking-tight text-white mb-2">
            Mail it from anywhere.
          </h3>
          <p className="text-sm text-white/65 mb-6 leading-relaxed max-w-sm">
            No phone shop near you? Speed Post to us. We pay return courier on
            every repair.
          </p>
          <div className="flex flex-col">
            {postSteps.map((step, i) => (
              <div
                key={step.n}
                className={`flex gap-4 py-4 ${i > 0 ? "border-t border-white/10" : ""}`}
              >
                <span className="font-mono text-2xl leading-none opacity-30 w-8 flex-shrink-0 text-white">
                  {step.n}
                </span>
                <div>
                  <p className="text-sm font-semibold text-white mb-1">
                    {step.title}
                  </p>
                  <p className="text-[13px] text-white/60 leading-snug">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </RevealItem>
      </RevealGroup>
    </section>
  );
}
