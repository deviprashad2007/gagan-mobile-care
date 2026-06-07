"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  BUSINESS_PHONE,
  BUSINESS_PHONE_RAW,
} from "@/lib/seo/business-info";

const NAV_LINKS = [
  { label: "How it works", href: "/#how", n: "01" },
  { label: "Pricing", href: "/#prices", n: "02" },
  { label: "Gallery", href: "/gallery", n: "03" },
  { label: "Blog", href: "/blog", n: "04" },
  { label: "Reviews", href: "/#stories", n: "05" },
  { label: "FAQ", href: "/#faq", n: "06" },
] as const;

export default function Nav() {
  const [mobOpen, setMobOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobOpen]);

  return (
    <>
      <nav className="sticky top-0 z-40 w-full border-b border-line bg-white will-change-transform">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14 gap-3">
          {/* Logo + Logotype */}
          <Link
            href="/"
            className="flex items-center gap-2.5 min-w-0 no-underline text-inherit"
            aria-label="Gagan Mobile Hospital — home"
          >
            {/* Logo mark */}
            <div className="relative w-8 h-8 bg-ink rounded-lg flex-shrink-0 flex items-center justify-center">
              <span
                className="text-white text-sm leading-none"
                style={{ fontFamily: "var(--font-body)", fontWeight: 700 }}
              >
                G
              </span>
              {/* Red dot bottom-right */}
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-accent rounded-full border border-white" />
            </div>

            {/* Logotype */}
            <div className="min-w-0">
              <div
                className="font-bold leading-tight whitespace-nowrap"
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  fontSize: 15,
                }}
              >
                Gagan Mobile Hospital
              </div>

              {/* Status badge — desktop only */}
              <div className="hidden md:flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 bg-success rounded-full" />
                <span className="text-ink-3 text-xs">Open · Patiala</span>
              </div>
            </div>
          </Link>

          {/* Center nav links — desktop only */}
          <div className="hidden md:flex bg-bg-soft border border-line rounded-full px-1 py-1 gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-ink-2 hover:text-ink px-3 py-1.5 rounded-full hover:bg-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right — desktop */}
          <div className="hidden md:flex gap-3 items-center">
            <a
              href={`tel:+${BUSINESS_PHONE_RAW}`}
              className="text-sm text-ink hover:text-ink-2 transition-colors"
            >
              {BUSINESS_PHONE}
            </a>
            <a
              href="/#book"
              className={buttonVariants({ size: "sm" })}
            >
              Book repair
            </a>
          </div>

          {/* Right — mobile hamburger */}
          <button
            className="flex md:hidden w-10 h-10 rounded-xl border border-line bg-white items-center justify-center cursor-pointer flex-shrink-0"
            aria-label={mobOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobOpen}
            onClick={() => setMobOpen((o) => !o)}
          >
            <span className="text-ink text-lg leading-none select-none">
              {mobOpen ? "✕" : "☰"}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile fullscreen menu */}
      {mobOpen && (
        <div className="fixed inset-0 z-50 bg-bg-ink flex flex-col p-6">
          {/* Close button */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setMobOpen(false)}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white text-lg cursor-pointer"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col flex-1">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobOpen(false)}
                className={[
                  "flex items-baseline justify-between py-5 text-white no-underline",
                  i > 0 ? "border-t border-white/10" : "",
                ].join(" ")}
              >
                <span
                  className="leading-tight"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 32,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {link.label}
                </span>
                <span
                  className="text-white/40 text-xs ml-3"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {link.n}
                </span>
              </Link>
            ))}
          </nav>

          {/* Mobile CTAs */}
          <div className="mt-auto pt-8 flex flex-col gap-3">
            <a
              href="/#book"
              onClick={() => setMobOpen(false)}
              className="w-full flex items-center justify-center bg-accent text-white font-semibold rounded-xl py-4 text-base no-underline"
            >
              Book a repair
            </a>
            <a
              href={`tel:+${BUSINESS_PHONE_RAW}`}
              className="w-full flex items-center justify-center border border-white/20 text-white rounded-xl py-3.5 text-sm no-underline"
            >
              Call {BUSINESS_PHONE}
            </a>
            <p className="text-white/40 text-xs tracking-widest uppercase mt-2">
              Village Baran · Sirhand Road · Patiala 147004
            </p>
          </div>
        </div>
      )}
    </>
  );
}
