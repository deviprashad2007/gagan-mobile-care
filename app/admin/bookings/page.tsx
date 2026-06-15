import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getBookings } from "@/lib/admin";
import { PageHeader } from "@/components/admin/ui/page-header";
import { StatusPill, type StatusTone } from "@/components/admin/ui/status-pill";
import { Avatar } from "@/components/admin/ui/avatar";
import { EmptyState } from "@/components/admin/ui/empty-state";

const STATUSES: { id: string; label: string; tone: StatusTone }[] = [
  { id: "all", label: "All", tone: "neutral" },
  { id: "new", label: "New", tone: "accent" },
  { id: "called", label: "Called", tone: "info" },
  { id: "booked", label: "Booked", tone: "success" },
  { id: "lost", label: "Lost", tone: "neutral" },
];

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

const INBOX_ICON = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </svg>
);

type Props = { searchParams: Promise<{ status?: string }> };

export default async function BookingsPage({ searchParams }: Props) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { status = "all" } = await searchParams;
  const bookings = await getBookings(status);

  return (
    <div className="px-4 md:px-8 py-6 max-w-5xl mx-auto">
      <PageHeader title="Bookings" />

      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap mb-5">
        {STATUSES.map((s) => {
          const active = status === s.id;
          return (
            <Link
              key={s.id}
              href={s.id === "all" ? "/admin/bookings" : `/admin/bookings?status=${s.id}`}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                active
                  ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)] border-[var(--color-accent-soft)]"
                  : "bg-[var(--color-bg-card)] text-[var(--color-ink-3)] border-[var(--color-line)] hover:border-[var(--color-ink-3)] hover:text-[var(--color-ink)]"
              }`}
            >
              {s.label}
              <span className="ml-1.5 font-mono text-[10px] opacity-60">{bookings.length}</span>
            </Link>
          );
        })}
      </div>

      {/* Table */}
      <div className="card-surface border rounded-2xl overflow-hidden">
        {bookings.length === 0 ? (
          <EmptyState icon={INBOX_ICON} title="No bookings found" description="Bookings matching this filter will show up here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-line)] text-[var(--color-ink-3)]">
                  <th className="text-left px-4 py-3 font-mono text-[10px] uppercase tracking-widest">Customer</th>
                  <th className="text-left px-4 py-3 font-mono text-[10px] uppercase tracking-widest hidden md:table-cell">Service</th>
                  <th className="text-left px-4 py-3 font-mono text-[10px] uppercase tracking-widest">Status</th>
                  <th className="text-left px-4 py-3 font-mono text-[10px] uppercase tracking-widest hidden sm:table-cell">Estimate</th>
                  <th className="text-left px-4 py-3 font-mono text-[10px] uppercase tracking-widest hidden lg:table-cell">When</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-line)]">
                {bookings.map((b) => {
                  const st = STATUSES.find((s) => s.id === b.status) ?? STATUSES[0];
                  return (
                    <tr key={b.id} className="hover:bg-[var(--color-bg-soft)] transition-colors">
                      <td className="px-4 py-3">
                        <Link href={`/admin/bookings/${b.id}`} className="flex items-center gap-3">
                          <Avatar name={b.customer_name} tone={st.tone} />
                          <div className="min-w-0">
                            <p className="font-medium text-[var(--color-ink)] truncate">{b.customer_name}</p>
                            <p className="font-mono text-xs text-[var(--color-ink-3)]">{b.customer_phone}</p>
                            {(b.brand_name || b.model_text) && (
                              <p className="text-[11px] text-[var(--color-ink-3)] mt-0.5 truncate">
                                {[b.brand_name, b.model_text].filter(Boolean).join(" · ")}
                              </p>
                            )}
                            {b.issue_names.length > 0 && (
                              <p className="text-[11px] text-[var(--color-ink-3)] mt-0.5 truncate">
                                {b.issue_names.join(", ")}
                              </p>
                            )}
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <StatusPill label={b.service_type === "post" ? "Post" : "Walk-in"} tone="neutral" />
                      </td>
                      <td className="px-4 py-3">
                        <StatusPill label={st.label} tone={st.tone} />
                      </td>
                      <td className="px-4 py-3 font-mono text-sm hidden sm:table-cell">
                        {b.estimated_price_min ? fmt(b.estimated_price_min) : "—"}
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--color-ink-3)] hidden lg:table-cell">
                        {timeAgo(b.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Link
                            href={`/admin/bookings/${b.id}`}
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--color-line)] text-[var(--color-ink-3)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-colors"
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                              <path d="m9 18 6-6-6-6" />
                            </svg>
                          </Link>
                          <a
                            href={`tel:+91${b.customer_phone}`}
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--color-line)] text-[var(--color-ink-3)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-colors"
                            aria-label="Call"
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.45 2 2 0 0 1 3.57 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.5a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
