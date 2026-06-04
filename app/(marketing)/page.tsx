import type { Metadata } from "next";
import { generateHomeMetadata } from "@/lib/seo/metadata";
import { HomeJsonLd } from "@/lib/seo/json-ld";
import { HeroSection } from "@/components/marketing/hero-section";
import { TrustBar } from "@/components/marketing/trust-bar";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { ServicesGrid } from "@/components/marketing/services-grid";
import { Testimonials } from "@/components/marketing/testimonials";
import { PostFlow } from "@/components/marketing/post-flow";
import { FaqSection } from "@/components/marketing/faq-section";
import { BookingTrigger } from "@/components/marketing/booking-trigger";
import { getBrands, getIssues } from "@/lib/repairs";

export const metadata: Metadata = generateHomeMetadata();

export default async function HomePage() {
  const [brands, issues] = await Promise.all([getBrands(), getIssues()]);

  return (
    <>
      <HomeJsonLd />
      <main>
        <HeroSection />
        <TrustBar />
        <HowItWorks />
        <ServicesGrid />
        <Testimonials />
        <PostFlow />
        <FaqSection />

        {/* Global booking trigger — anchored by #book href in hero CTA */}
        <section id="book" className="py-16 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-ink-3)] mb-3">
            Ready to fix it?
          </p>
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight leading-tight text-[var(--color-ink)] mb-6">
            Book your repair now.
          </h2>
          <BookingTrigger
            brands={brands}
            issues={issues}
            className="inline-flex items-center gap-2 bg-[var(--color-ink)] text-white text-sm font-semibold rounded-full px-7 py-3.5 hover:opacity-90 transition-opacity"
          >
            Get free quote →
          </BookingTrigger>
        </section>
      </main>
    </>
  );
}
