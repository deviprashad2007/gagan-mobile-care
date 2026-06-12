import type { Metadata } from "next";
import { Reveal } from "@/components/motion/reveal";
import { TrackStatusForm } from "@/components/marketing/track-status-form";

export const metadata: Metadata = {
  title: "Track your repair — Gagan Mobile Hospital",
  description: "Check the status of your phone repair booking using your booking code or mobile number.",
  alternates: { canonical: "https://gaganmobilecare.com/track" },
  robots: { index: false, follow: true },
};

type Props = { searchParams: Promise<{ ref?: string }> };

export default async function TrackPage({ searchParams }: Props) {
  const { ref } = await searchParams;

  return (
    <main className="py-16 px-4 md:px-8 lg:px-12 max-w-3xl mx-auto">
      <Reveal as="div">
        <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-ink-3)] mb-3">
          Track your repair
        </p>
        <h1 className="font-serif text-4xl md:text-5xl tracking-tight leading-tight text-[var(--color-ink)] mb-3">
          Where&apos;s my phone?
        </h1>
        <p className="text-[var(--color-ink-3)] text-sm mb-8 max-w-md">
          Enter the booking code from your confirmation screen, or the mobile number you booked with.
        </p>

        <TrackStatusForm initialQuery={ref} />
      </Reveal>
    </main>
  );
}
