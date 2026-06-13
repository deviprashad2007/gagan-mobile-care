import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getAdminStats, getNewBookings, getReadyRepairs } from "@/lib/admin";

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const [stats, newBookings, readyRepairs] = await Promise.all([
    getAdminStats(),
    getNewBookings(8),
    getReadyRepairs(8),
  ]);

  return (
    <div className="px-4 md:px-8 py-6 max-w-5xl mx-auto">
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="font-serif text-3xl md:text-4xl tracking-tight text-[var(--color-ink)]">
          {greeting}, <em>Gagan</em>.
        </h1>
        <p className="text-sm text-[var(--color-ink-3)] mt-1">
          {stats.newBookings > 0
            ? `You have ${stats.newBookings} new booking${stats.newBookings !== 1 ? "s" : ""} to call back.`
            : "You're all caught up on bookings."}
          {stats.readyRepairs > 0 &&
            ` ${stats.readyRepairs} phone${stats.readyRepairs !== 1 ? "s" : ""} ready for pickup.`}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "New bookings", value: stats.newBookings, sub: "Call them back", accent: true },
          { label: "On the bench", value: stats.workingRepairs, sub: "Being fixed now" },
          { label: "Ready to pick up", value: stats.readyRepairs, sub: "Notify customers" },
          { label: "Earned today", value: fmt(stats.todayEarnings), sub: "Picked-up repairs" },
        ].map((s) => (
          <div key={s.label} className="card-surface border rounded-2xl p-4 overflow-hidden transition-colors hover:border-[var(--color-ink-4)]">
            <p className="text-xs text-[var(--color-ink-3)] mb-1 truncate">{s.label}</p>
            <p
              className="font-serif text-2xl md:text-3xl leading-none tracking-tight truncate"
              style={{ color: s.accent && stats.newBookings > 0 ? "var(--color-accent)" : "var(--color-ink)" }}
            >
              {s.value}
            </p>
            <p className="text-[11px] text-[var(--color-ink-3)] mt-1 truncate">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* New bookings */}
        <div className="card-surface border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-line)]">
            <h2 className="text-sm font-semibold text-[var(--color-ink)]">New bookings to call</h2>
            <Link href="/admin/bookings" className="text-xs text-[var(--color-ink-3)] hover:text-[var(--color-ink)] transition-colors">
              See all →
            </Link>
          </div>
          {newBookings.length === 0 ? (
            <p className="text-center text-sm text-[var(--color-ink-3)] py-10">No new bookings 🎉</p>
          ) : (
            <div className="divide-y divide-[var(--color-line)]">
              {newBookings.map((b) => (
                <div key={b.id} className="relative flex items-center gap-3 px-4 py-3 hover:bg-[var(--color-bg-soft)] transition-colors">
                  <Link href={`/admin/bookings/${b.id}`} className="absolute inset-0" aria-label={`View booking for ${b.customer_name}`} />
                  <div className="w-8 h-8 rounded-full bg-[var(--color-bg-soft)] flex items-center justify-center text-xs font-bold text-[var(--color-ink)] shrink-0">
                    {initials(b.customer_name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--color-ink)] truncate">{b.customer_name}</p>
                    <p className="text-xs text-[var(--color-ink-3)] truncate font-mono">{b.customer_phone}</p>
                    {b.issue_names.length > 0 && (
                      <p className="text-[11px] text-[var(--color-ink-3)] truncate">{b.issue_names.join(", ")}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    {b.estimated_price_min && (
                      <p className="text-sm font-mono font-semibold text-[var(--color-ink)]">
                        {fmt(b.estimated_price_min)}
                      </p>
                    )}
                    <p className="text-[11px] text-[var(--color-ink-3)]">{timeAgo(b.created_at)}</p>
                  </div>
                  <a
                    href={`tel:+91${b.customer_phone}`}
                    className="relative z-10 w-8 h-8 flex items-center justify-center rounded-full border border-[var(--color-line)] text-[var(--color-ink-3)] hover:text-[var(--color-ink)] hover:border-[var(--color-ink)] transition-colors shrink-0"
                    aria-label="Call"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.45 2 2 0 0 1 3.57 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.5a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ready for pickup */}
        <div className="card-surface border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-line)]">
            <h2 className="text-sm font-semibold text-[var(--color-ink)]">Ready to pick up</h2>
            <Link href="/admin/repairs" className="text-xs text-[var(--color-ink-3)] hover:text-[var(--color-ink)] transition-colors">
              See all →
            </Link>
          </div>
          {readyRepairs.length === 0 ? (
            <p className="text-center text-sm text-[var(--color-ink-3)] py-10">Nothing ready yet.</p>
          ) : (
            <div className="divide-y divide-[var(--color-line)]">
              {readyRepairs.map((r) => (
                <div key={r.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-xs font-bold text-green-700 shrink-0">
                    {initials(r.customer_name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--color-ink)] truncate">{r.customer_name}</p>
                    <p className="text-xs text-[var(--color-ink-3)] truncate">{r.issue_text}</p>
                  </div>
                  <div className="text-right shrink-0">
                    {r.amount && (
                      <p className="text-sm font-mono font-semibold text-[var(--color-ink)]">{fmt(r.amount)}</p>
                    )}
                  </div>
                  <a
                    href={`tel:+91${r.customer_phone}`}
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-[var(--color-line)] text-[var(--color-ink-3)] hover:text-[var(--color-ink)] hover:border-[var(--color-ink)] transition-colors shrink-0"
                    aria-label="Call"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.45 2 2 0 0 1 3.57 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.5a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
