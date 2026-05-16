import type { Metadata } from "next";
import Link from "next/link";
import { WHATSAPP_URL } from "@/lib/seo/business-info";

export const metadata: Metadata = {
  title: "Privacy Policy — Gagan Mobile Care",
  description:
    "How Gagan Mobile Care collects, uses and protects your personal information when you book a repair.",
  openGraph: {
    title: "Privacy Policy — Gagan Mobile Care",
    description:
      "How Gagan Mobile Care collects, uses and protects your personal information when you book a repair.",
  },
};

export default function PrivacyPage() {
  return (
    <main className="py-16 px-4 md:px-8">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-[var(--color-ink-3)] hover:text-[var(--color-ink)] transition-colors mb-10"
        >
          ← Back to home
        </Link>

        <header className="mb-12">
          <h1 className="font-display text-4xl md:text-5xl text-[var(--color-ink)] mb-3">
            Privacy Policy
          </h1>
          <p className="font-mono text-sm text-[var(--color-ink-4)] mb-4">
            Last updated: 16 May 2026
          </p>
          <p className="text-[var(--color-ink-2)] text-[15px] leading-relaxed">
            We collect only what we need to fix your phone and call you back.
          </p>
        </header>

        <div className="space-y-10 text-[var(--color-ink-2)] text-[15px] leading-relaxed">
          <section>
            <h2 className="font-display text-2xl text-[var(--color-ink)] mb-3">
              Who we are
            </h2>
            <p>
              Gagan Mobile Care, Shop 14 Lajpat Nagar Central Market, New Delhi
              110024. Phone: +91 98112 00410. We repair mobile phones and
              process personal data only in connection with that service.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-[var(--color-ink)] mb-3">
              What we collect
            </h2>
            <ul className="list-disc list-outside ml-4 space-y-1">
              <li>
                Name and phone number — provided when you book a repair or call
                us
              </li>
              <li>Device details — brand, model, issue description</li>
              <li>
                Postal address — only for post-repair customers (to ship your
                device back)
              </li>
              <li>
                Booking reference — generated automatically when you book
              </li>
            </ul>
            <p className="mt-3">
              We do NOT collect payment card data. Cash and UPI are settled
              in-person or on delivery.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-[var(--color-ink)] mb-3">
              Why we collect it
            </h2>
            <ul className="list-disc list-outside ml-4 space-y-1">
              <li>To contact you about your repair status</li>
              <li>To generate and track your repair booking</li>
              <li>To ship your device back (post customers only)</li>
            </ul>
            <p className="mt-3">
              We never sell or share your data with third parties for marketing.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-[var(--color-ink)] mb-3">
              How long we keep it
            </h2>
            <p>
              Repair records are kept for 2 years after the repair date (for
              warranty purposes), then permanently deleted.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-[var(--color-ink)] mb-3">
              Your rights
            </h2>
            <p>
              You can ask us to show, correct, or delete your data at any time.
              Email or{" "}
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-accent)] hover:underline"
              >
                WhatsApp us
              </a>{" "}
              — we&apos;ll respond within 3 working days.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-[var(--color-ink)] mb-3">
              Cookies
            </h2>
            <p>
              This website uses no tracking cookies. We use Plausible Analytics
              (privacy-friendly, no personal data collected) to count page
              visits.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-[var(--color-ink)] mb-3">
              Contact
            </h2>
            <p>
              For any privacy questions: +91 98112 00410 or via{" "}
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-accent)] hover:underline"
              >
                WhatsApp
              </a>
              . Shop 14, Lajpat Nagar Central Market, New Delhi 110024.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
