import Link from "next/link";
import { BUSINESS_PHONE } from "@/lib/seo/business-info";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <span
        className="font-mono text-[96px] leading-none font-medium select-none"
        style={{ color: "var(--color-line)" }}
        aria-hidden="true"
      >
        404
      </span>

      <h1 className="font-display text-3xl md:text-4xl text-[var(--color-ink)] mt-4 mb-3">
        Phone not found.
      </h1>

      <p className="text-[var(--color-ink-3)] text-[15px] leading-relaxed max-w-sm mb-8">
        The page you&apos;re looking for doesn&apos;t exist. Maybe your browser
        needs a repair too.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-[var(--radius-pill)] bg-[var(--color-accent)] text-white text-sm font-medium transition-opacity hover:opacity-90"
        >
          Go home
        </Link>
        <Link
          href="/#book"
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-[var(--radius-pill)] border border-[var(--color-line)] text-[var(--color-ink)] text-sm font-medium transition-colors hover:border-[var(--color-ink-4)]"
        >
          Book a repair
        </Link>
      </div>

      <p className="mt-12 text-sm text-[var(--color-ink-4)]">
        Lost? Call us: {BUSINESS_PHONE}
      </p>
    </main>
  );
}
