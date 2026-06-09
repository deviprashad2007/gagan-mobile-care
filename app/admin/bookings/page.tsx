import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getBookings } from "@/lib/admin";

const STATUSES = [
  { id: "all", label: "All", color: "#6B7280" },
  { id: "new", label: "New", color: "#F2521F" },
  { id: "called", label: "Called", color: "#2563EB" },
  { id: "booked", label: "Booked", color: "#16A34A" },
  { id: "lost", label: "Lost", color: "#9CA3AF" },
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

type Props = { searchParams: Promise<{ status?: string }> };

export default async function BookingsPage({ searchParams }: Props) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { status = "all" } = await searchParams;
  const bookings = await getBookings(status);

  return (
    <div className="px-4 md:px-8 py-6 max-w-5xl mx-auto">
      <h1 className="font-serif text-2xl md:text-3xl tracking-tight text-[var(--color-ink)] mb-5">
        Bookings
      </h1>

      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap mb-5">
        {STATUSES.map((s) => (
          <Link
            key={s.id}
            href={s.id === "all" ? "/admin/bookings" : `/admin/bookings?status=${s.id}`}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              status === s.id
                ? "bg-[var(--color-ink)] text-white border-[var(--color-ink)]"
                : "bg-white text-[var(--color-ink-3)] border-[var(--color-line)] hover:border-[var(--color-ink-3)]"
            }`}
          >
            {s.label}
            <span className="ml-1.5 font-mono text-[10px] opacity-60">{bookings.length}</span>
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-[var(--color-line)] rounded-2xl overflow-hidden">
        {bookings.length === 0 ? (
          <p className="text-center text-sm text-[var(--color-ink-3)] py-16">No bookings found.</p>
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
                        <Link href={`/admin/bookings/${b.id}`} className="block">
                          <p className="font-medium text-[var(--color-ink)]">{b.customer_name}</p>
                          <p className="font-mono text-xs text-[var(--color-ink-3)]">{b.customer_phone}</p>
                          {(b.brand_name || b.model_text) && (
                            <p className="text-[11px] text-[var(--color-ink-3)] mt-0.5">
                              {[b.brand_name, b.model_text].filter(Boolean).join(" · ")}
                            </p>
                          )}
                        </Link>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--color-bg-soft)] text-[var(--color-ink-3)]">
                          {b.service_type === "post" ? "📦 Post" : "🏪 Walk-in"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="text-xs font-semibold px-2.5 py-1 rounded-full"
                          style={{ background: st.color + "18", color: st.color }}
                        >
                          {st.label}
                        </span>
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
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--color-line)] text-[var(--color-ink-3)] hover:text-[var(--color-ink)] transition-colors"
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                              <path d="m9 18 6-6-6-6" />
                            </svg>
                          </Link>
                          <a
                            href={`tel:+91${b.customer_phone}`}
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--color-line)] text-[var(--color-ink-3)] hover:text-[var(--color-ink)] transition-colors"
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
