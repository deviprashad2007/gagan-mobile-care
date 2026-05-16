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

export const metadata: Metadata = generateHomeMetadata();

export default function HomePage() {
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
      </main>
    </>
  );
}
