import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import {
  BUSINESS_NAME,
  BUSINESS_ADDRESS,
  BUSINESS_PHONE,
  BUSINESS_PHONE_RAW,
} from "@/lib/seo/business-info";

const REPAIR_LINKS = [
  { label: "Screen replacement", href: "/repairs/screen-replacement" },
  { label: "Battery swap", href: "/repairs/battery-swap" },
  { label: "Water damage", href: "/repairs/water-damage" },
  { label: "Camera fix", href: "/repairs/camera-fix" },
  { label: "See all 50+", href: "/repairs" },
] as const;

const BRAND_LINKS = [
  { label: "Apple", href: "/repairs/apple" },
  { label: "Samsung", href: "/repairs/samsung" },
  { label: "OnePlus", href: "/repairs/oneplus" },
  { label: "Xiaomi", href: "/repairs/xiaomi" },
  { label: "See all 15+", href: "/repairs" },
] as const;

const COMPANY_LINKS = [
  { label: "About", href: "/about" },
  { label: "Privacy", href: "/privacy" },
  { label: "Contact", href: "/contact" },
] as const;

const LINK_COLUMNS = [
  { title: "Repairs", links: REPAIR_LINKS },
  { title: "Brands", links: BRAND_LINKS },
  { title: "Company", links: COMPANY_LINKS },
] as const;

export default function Footer() {
  return (
    <footer className="mx-4 mb-4">
      <Reveal as="div">
      <div
        className="bg-bg-ink text-white overflow-hidden"
        style={{ borderRadius: "var(--radius-card)" }}
      >
        {/* Main content */}
        <div className="p-7 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
            {/* Left — CTA block */}
            <div>
              <h2
                className="text-white leading-none m-0"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(32px, 5vw, 44px)",
                  letterSpacing: "-0.025em",
                }}
              >
                Get your phone fixed.
                <br />
                <em>Today, or by Friday.</em>
              </h2>

              <p className="text-white/65 text-sm mt-5 max-w-sm leading-relaxed">
                Free quote in 60 seconds. No advance payment. Genuine parts.
                6-month warranty.
              </p>

              <div className="flex flex-wrap gap-3 mt-6">
                <a
                  href="/#book"
                  className="inline-flex items-center justify-center bg-accent text-white font-semibold rounded-lg px-4 py-2.5 text-sm no-underline transition-all hover:opacity-90 hover:scale-[1.04] active:scale-[0.97]"
                >
                  Book a repair
                </a>
                <a
                  href={`tel:+${BUSINESS_PHONE_RAW}`}
                  className="inline-flex items-center justify-center border border-white/20 text-white rounded-lg px-4 py-2.5 text-sm no-underline hover:border-white/40 transition-colors"
                >
                  {BUSINESS_PHONE}
                </a>
              </div>
            </div>

            {/* Right — link columns */}
            <div className="grid grid-cols-3 gap-6">
              {LINK_COLUMNS.map((col) => (
                <div key={col.title}>
                  <div
                    className="text-white/50 mb-4 tracking-widest"
                    style={{
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                    }}
                  >
                    {col.title}
                  </div>
                  <ul className="flex flex-col gap-2.5 list-none m-0 p-0">
                    {col.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-white/85 text-sm hover:text-white transition-colors no-underline"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-8 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-white/50 text-xs m-0">
              &copy; 2026 {BUSINESS_NAME} &middot; {BUSINESS_ADDRESS}
            </p>

            <div
              className="flex items-center gap-4 text-white/40"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
              }}
            >
              {/* GST number pending from Gagan — add as <span>GST · XXXXXXXXXXXXXXX</span> once provided */}
              <Link
                href="/admin"
                className="text-white/40 hover:text-white/70 transition-colors no-underline flex items-center gap-1"
                aria-label="Admin dashboard"
              >
                🛡 Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
      </Reveal>
    </footer>
  );
}
