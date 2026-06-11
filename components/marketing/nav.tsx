"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useOpenBooking } from "./booking-provider";
import {
  BUSINESS_PHONE,
  BUSINESS_PHONE_RAW,
} from "@/lib/seo/business-info";

const NAV_LINKS = [
  { label: "Home", href: "/", n: "01" },
  { label: "How it works", href: "/#how", n: "02" },
  { label: "Pricing", href: "/#prices", n: "03" },
  { label: "Gallery", href: "/gallery", n: "04" },
  { label: "Blog", href: "/blog", n: "05" },
  { label: "FAQ", href: "/#faq", n: "06" },
  { label: "Track Order", href: "/track", n: "07" },
] as const;

export default function Nav() {
  const [mobOpen, setMobOpen] = useState(false);
  const openBooking = useOpenBooking();

  useEffect(() => {
    document.body.style.overflow = mobOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobOpen]);

  return (
    <>
      <motion.nav
        className="sticky top-0 z-40 w-full border-b border-line bg-[var(--color-bg)] will-change-transform"
        initial={{ y: -56, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
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
                className="text-sm text-ink-2 hover:text-ink px-3 py-1.5 rounded-full hover:bg-[var(--color-bg)] transition-colors"
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
            <ThemeToggle className="flex items-center justify-center w-9 h-9 rounded-full border border-line text-ink hover:border-accent transition-colors cursor-pointer" />
            <motion.button
              type="button"
              onClick={openBooking}
              className={buttonVariants({ size: "sm" })}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Book repair
            </motion.button>
          </div>

          {/* Right — mobile */}
          <div className="flex md:hidden items-center gap-2 flex-shrink-0">
            <ThemeToggle className="flex w-10 h-10 rounded-xl border border-line bg-[var(--color-bg-card)] items-center justify-center cursor-pointer text-ink" />
            <motion.button
              className="flex w-10 h-10 rounded-xl border border-line bg-[var(--color-bg-card)] items-center justify-center cursor-pointer"
              aria-label={mobOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobOpen}
              onClick={() => setMobOpen((o) => !o)}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={mobOpen ? "close" : "open"}
                  className="text-ink text-lg leading-none select-none"
                  initial={{ opacity: 0, rotate: -45 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 45 }}
                  transition={{ duration: 0.15 }}
                >
                  {mobOpen ? "✕" : "☰"}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {mobOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-bg-ink flex flex-col p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Close button */}
            <div className="flex justify-end mb-6">
              <motion.button
                onClick={() => setMobOpen(false)}
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white text-lg cursor-pointer"
                aria-label="Close menu"
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                ✕
              </motion.button>
            </div>

            {/* Nav links */}
            <motion.nav
              className="flex flex-col flex-1"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
            >
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  variants={{
                    hidden: { opacity: 0, x: -16 },
                    show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
                  }}
                >
                  <Link
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
                </motion.div>
              ))}
            </motion.nav>

            {/* Mobile CTAs */}
            <div className="mt-auto pt-8 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  setMobOpen(false);
                  openBooking();
                }}
                className="w-full flex items-center justify-center bg-accent text-white font-semibold rounded-xl py-4 text-base no-underline"
              >
                Book a repair
              </button>
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
