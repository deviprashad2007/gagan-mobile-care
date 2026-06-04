import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Gagan Mobile Care",
  description: "Privacy policy for Gagan Mobile Care, compliant with India's Digital Personal Data Protection Act 2023.",
  alternates: { canonical: "https://gaganmobilecare.in/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="py-16 px-4 md:px-8 lg:px-12 max-w-3xl mx-auto">
      <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-ink-3)] mb-3">
        Legal
      </p>
      <h1 className="font-serif text-4xl md:text-5xl tracking-tight leading-tight text-[var(--color-ink)] mb-8">
        Privacy Policy
      </h1>

      <div className="prose prose-neutral max-w-none text-[var(--color-ink)] space-y-6 text-[15px] leading-relaxed">
        <p className="text-[var(--color-ink-3)]">Last updated: January 2025</p>

        <section>
          <h2 className="font-semibold text-lg mb-2">1. Who we are</h2>
          <p>
            Gagan Mobile Care operates a mobile phone repair shop at Shop 14, Lajpat Nagar Central
            Market, New Delhi – 110024. This policy explains what personal data we collect, why, and
            how we protect it, in compliance with India&apos;s Digital Personal Data Protection Act 2023
            (DPDP Act).
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-lg mb-2">2. Data we collect</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Name and mobile number — provided when you submit a repair booking</li>
            <li>Device information — brand, model, and issue you report</li>
            <li>Service preference — walk-in or send by post</li>
          </ul>
          <p className="mt-2">We do not collect email addresses, payment card data, or location data.</p>
        </section>

        <section>
          <h2 className="font-semibold text-lg mb-2">3. Why we collect it</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To call you back and confirm your repair booking</li>
            <li>To provide a price estimate for the repair</li>
            <li>To manage your repair job in our workshop</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-lg mb-2">4. How we use your data</h2>
          <p>
            Your phone number is used exclusively to contact you about your repair. We do not share
            your data with third parties, do not send marketing messages, and do not sell your data.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-lg mb-2">5. Data retention</h2>
          <p>
            Booking records are retained for up to 2 years for warranty and service history purposes,
            then permanently deleted.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-lg mb-2">6. Your rights</h2>
          <p>
            Under the DPDP Act 2023, you have the right to access, correct, or request deletion of
            your personal data. To exercise these rights, call or WhatsApp us at{" "}
            <a href="tel:+919811200410" className="underline">+91 98112 00410</a>.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-lg mb-2">7. Contact</h2>
          <p>
            Questions about this policy? Contact us at Shop 14, Lajpat Nagar Central Market, New
            Delhi – 110024, or call +91 98112 00410.
          </p>
        </section>
      </div>
    </main>
  );
}
