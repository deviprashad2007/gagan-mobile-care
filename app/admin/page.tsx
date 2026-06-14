import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getAdminStats, getNewBookings, getReadyRepairs } from "@/lib/admin";
import { PageHeader } from "@/components/admin/ui/page-header";
import { StatCard } from "@/components/admin/ui/stat-card";
import { Avatar } from "@/components/admin/ui/avatar";
import { StatusPill } from "@/components/admin/ui/status-pill";
import { EmptyState } from "@/components/admin/ui/empty-state";

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

const ICONS = {
  bell: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  wrench: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  package: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
    </svg>
  ),
  rupee: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 3h12" /><path d="M6 8h12" /><path d="M6 13h6a4 4 0 0 0 0-8" /><path d="M6 13l8 8" />
    </svg>
  ),
  call: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.45 2 2 0 0 1 3.57 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.5a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  inbox: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  ),
  check: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
};

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
      <PageHeader
        title={<>{greeting}, <em>Gagan</em>.</>}
        subtitle={
          <>
            {stats.newBookings > 0
              ? `You have ${stats.newBookings} new booking${stats.newBookings !== 1 ? "s" : ""} to call back.`
              : "You're all caught up on bookings."}
            {stats.readyRepairs > 0 &&
              ` ${stats.readyRepairs} phone${stats.readyRepairs !== 1 ? "s" : ""} ready for pickup.`}
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard
          label="New bookings"
          value={stats.newBookings}
          sub="Call them back"
          icon={ICONS.bell}
          tone={stats.newBookings > 0 ? "accent" : "neutral"}
        />
        <StatCard
          label="On the bench"
          value={stats.workingRepairs}
          sub="Being fixed now"
          icon={ICONS.wrench}
          tone="info"
        />
        <StatCard
          label="Ready to pick up"
          value={stats.readyRepairs}
          sub="Notify customers"
          icon={ICONS.package}
          tone="success"
        />
        <StatCard
          label="Earned today"
          value={fmt(stats.todayEarnings)}
          sub="Picked-up repairs"
          icon={ICONS.rupee}
          tone="warning"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* New bookings */}
        <div className="card-surface border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-line)]">
            <h2 className="text-sm font-semibold text-[var(--color-ink)]">New bookings to call</h2>
            <Link href="/admin/bookings" className="text-xs text-[var(--color-ink-3)] hover:text-[var(--color-accent)] transition-colors">
              See all →
            </Link>
          </div>
          {newBookings.length === 0 ? (
            <EmptyState icon={ICONS.inbox} title="No new bookings" description="New web enquiries will show up here." />
          ) : (
            <div className="divide-y divide-[var(--color-line)]">
              {newBookings.map((b) => (
                <div key={b.id} className="relative flex items-center gap-3 px-4 py-3 hover:bg-[var(--color-bg-soft)] transition-colors">
                  <Link href={`/admin/bookings/${b.id}`} className="absolute inset-0" aria-label={`View booking for ${b.customer_name}`} />
                  <Avatar name={b.customer_name} tone="accent" />
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
                    className="relative z-10 w-8 h-8 flex items-center justify-center rounded-full border border-[var(--color-line)] text-[var(--color-ink-3)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-colors shrink-0"
                    aria-label="Call"
                  >
                    {ICONS.call}
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
            <Link href="/admin/repairs" className="text-xs text-[var(--color-ink-3)] hover:text-[var(--color-accent)] transition-colors">
              See all →
            </Link>
          </div>
          {readyRepairs.length === 0 ? (
            <EmptyState icon={ICONS.check} title="Nothing ready yet" description="Repairs marked ready for pickup will show up here." />
          ) : (
            <div className="divide-y divide-[var(--color-line)]">
              {readyRepairs.map((r) => (
                <div key={r.id} className="flex items-center gap-3 px-4 py-3">
                  <Avatar name={r.customer_name} tone="success" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--color-ink)] truncate">{r.customer_name}</p>
                    <p className="text-xs text-[var(--color-ink-3)] truncate">{r.issue_text}</p>
                  </div>
                  <div className="text-right shrink-0 flex items-center gap-2">
                    <StatusPill label="Ready" tone="success" />
                    {r.amount && (
                      <p className="text-sm font-mono font-semibold text-[var(--color-ink)]">{fmt(r.amount)}</p>
                    )}
                  </div>
                  <a
                    href={`tel:+91${r.customer_phone}`}
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-[var(--color-line)] text-[var(--color-ink-3)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-colors shrink-0"
                    aria-label="Call"
                  >
                    {ICONS.call}
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
