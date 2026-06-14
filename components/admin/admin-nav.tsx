"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { signOut } from "@/lib/actions/sign-out";
import { Avatar } from "@/components/admin/ui/avatar";

interface Props {
  role: "owner" | "staff" | null;
  email: string | null;
}

function SignOutButton() {
  const [isPending, startTransition] = useTransition();
  return (
    <button
      onClick={() => startTransition(() => signOut())}
      disabled={isPending}
      className="text-xs text-[var(--color-ink-3)] hover:text-[var(--color-accent)] transition-colors disabled:opacity-50"
    >
      {isPending ? "Signing out…" : "Sign out"}
    </button>
  );
}

interface NavLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface NavSection {
  label: string;
  links: NavLink[];
}

const todayLink: NavLink = {
  href: "/admin",
  label: "Today",
  icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
};

const operationsLinks: NavLink[] = [
  {
    href: "/admin/bookings",
    label: "Bookings",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    href: "/admin/repairs",
    label: "Repairs",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    href: "/admin/earnings",
    label: "Earnings",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    href: "/admin/invoices",
    label: "Invoices",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M9 13h6" /><path d="M9 17h6" /><path d="M9 9h1" />
      </svg>
    ),
  },
];

const catalogLinks: NavLink[] = [
  {
    href: "/admin/brands",
    label: "Brands",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="8" r="5" /><path d="M3 21v-1a9 9 0 0 1 18 0v1" />
      </svg>
    ),
  },
  {
    href: "/admin/catalog",
    label: "Catalog",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
  },
  {
    href: "/admin/gallery",
    label: "Gallery",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
  },
];

const contentLinks: NavLink[] = [
  {
    href: "/admin/blog",
    label: "Blog",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
];

const usersLink: NavLink = {
  href: "/admin/users",
  label: "Users",
  icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
};

export function AdminNav({ role, email }: Props) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const sections: NavSection[] = [
    { label: "Overview", links: [todayLink] },
    { label: "Operations", links: operationsLinks },
    { label: "Catalog", links: catalogLinks },
    { label: "Content", links: contentLinks },
    ...(role === "owner" ? [{ label: "Team", links: [usersLink] }] : []),
  ];

  const allLinks = sections.flatMap((s) => s.links);
  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const primaryLinks = allLinks.slice(0, 4);
  const moreLinks = allLinks.slice(4);
  const isMoreActive = moreLinks.some((link) => isActive(link.href));

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="no-print hidden md:flex fixed left-0 top-0 bottom-0 w-60 flex-col border-r border-[var(--color-line)] bg-[var(--color-bg-card)] z-40">
        <div className="px-5 py-5 border-b border-[var(--color-line)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center text-white font-bold text-sm">
              G
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--color-ink)] leading-none">Gagan Mobile</p>
              <p className="text-[10px] text-[var(--color-ink-3)] mt-0.5">Admin dashboard</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
          {sections.map((section) => (
            <div key={section.label}>
              <p className="px-3 mb-1.5 text-[10px] font-mono uppercase tracking-widest text-[var(--color-ink-4)]">
                {section.label}
              </p>
              <div className="space-y-1">
                {section.links.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`relative flex items-center gap-3 pl-3 pr-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        active
                          ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                          : "text-[var(--color-ink-3)] hover:text-[var(--color-ink)] hover:bg-[var(--color-bg-soft)]"
                      }`}
                    >
                      {active && (
                        <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-[var(--color-accent)]" />
                      )}
                      {link.icon}
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-[var(--color-line)] flex items-center gap-3">
          <Avatar name={email ?? "Admin"} tone="accent" size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-[var(--color-ink)] truncate">{email ?? "Admin"}</p>
            <p className="text-[10px] text-[var(--color-ink-3)] uppercase tracking-widest">
              {role === "owner" ? "Owner" : role === "staff" ? "Staff" : "Admin"}
            </p>
          </div>
          <SignOutButton />
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="no-print md:hidden fixed bottom-0 left-0 right-0 bg-[var(--color-bg-card)] border-t border-[var(--color-line)] z-40 flex">
        {primaryLinks.map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className="relative flex-1 flex flex-col items-center justify-center gap-1 py-3 text-[10px] font-medium transition-colors"
              style={{ color: active ? "var(--color-accent)" : "var(--color-ink-3)" }}
            >
              {active && (
                <span className="absolute top-1 h-1 w-6 rounded-full bg-[var(--color-accent)]" />
              )}
              {link.icon}
              {link.label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setMoreOpen(true)}
          className="relative flex-1 flex flex-col items-center justify-center gap-1 py-3 text-[10px] font-medium transition-colors"
          style={{ color: isMoreActive ? "var(--color-accent)" : "var(--color-ink-3)" }}
        >
          {isMoreActive && (
            <span className="absolute top-1 h-1 w-6 rounded-full bg-[var(--color-accent)]" />
          )}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <circle cx="5" cy="12" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="19" cy="12" r="2" />
          </svg>
          More
        </button>
      </nav>

      {/* Mobile slide-up "More" menu */}
      <div
        className={`no-print md:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          moreOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-black/40" onClick={() => setMoreOpen(false)} aria-hidden="true" />
        <div
          className={`absolute bottom-0 left-0 right-0 bg-[var(--color-bg-card)] rounded-t-2xl border-t border-[var(--color-line)] transition-transform duration-300 ${
            moreOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="px-5 py-4 border-b border-[var(--color-line)] flex items-center justify-between">
            <p className="text-sm font-semibold text-[var(--color-ink)]">More</p>
            <button
              type="button"
              onClick={() => setMoreOpen(false)}
              aria-label="Close menu"
              className="text-[var(--color-ink-3)] hover:text-[var(--color-ink)] transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div className="p-2 pb-4 max-h-[60vh] overflow-y-auto">
            {moreLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMoreOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                      : "text-[var(--color-ink-3)] hover:text-[var(--color-ink)] hover:bg-[var(--color-bg-soft)]"
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              );
            })}
            <div className="px-4 py-3 mt-1 border-t border-[var(--color-line)] flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar name={email ?? "Admin"} tone="accent" size="sm" />
                <p className="text-xs font-medium text-[var(--color-ink)] truncate">{email ?? "Admin"}</p>
              </div>
              <SignOutButton />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
