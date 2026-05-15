import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-bg flex flex-col items-center justify-center gap-6 px-4">

      {/* Instrument Serif + brand red — --font-display + --color-accent */}
      <h1
        className="text-5xl text-accent"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Gagan Mobile Care
      </h1>

      {/* Inter body — --font-body */}
      <p
        className="text-ink-3 text-base"
        style={{ fontFamily: "var(--font-body)" }}
      >
        Phone repairs · Lajpat Nagar Central Market, New Delhi
      </p>

      {/* JetBrains Mono — --font-mono */}
      <p
        className="text-ink text-sm"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        +91 98112 00410
      </p>

      {/* shadcn Button — must render brand red (--primary = #E63329) with white text */}
      <Button>Book a Repair</Button>

      {/* Color swatches */}
      <div className="flex gap-3 mt-2">
        <div className="px-3 py-1 rounded bg-bg-soft text-ink-3 text-xs border border-line">bg-soft</div>
        <div className="px-3 py-1 rounded bg-success text-white text-xs">success</div>
        <div className="px-3 py-1 rounded bg-wa text-white text-xs">whatsapp</div>
        <div className="px-3 py-1 rounded bg-accent text-white text-xs">accent</div>
      </div>

    </main>
  );
}
