import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getEarningsStats, getInvoicesByDateRange } from "@/lib/admin";
import { PageHeader } from "@/components/admin/ui/page-header";
import { StatCard } from "@/components/admin/ui/stat-card";
import { StatusPill, type StatusTone } from "@/components/admin/ui/status-pill";
import { EmptyState } from "@/components/admin/ui/empty-state";

const STATUS_LABELS: Record<string, { label: string; tone: StatusTone }> = {
  received: { label: "Received", tone: "neutral" },
  working: { label: "Working", tone: "info" },
  ready: { label: "Ready", tone: "success" },
};

const PAYMENT_LABELS: Record<string, string> = {
  cash: "Cash",
  upi: "UPI",
  card: "Card",
  other: "Other",
};

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

const ICONS = {
  rupee: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 3h12" /><path d="M6 8h12" /><path d="M6 13h6a4 4 0 0 0 0-8" /><path d="M6 13l8 8" />
    </svg>
  ),
  calendar: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  trending: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  receipt: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 2h16v20l-3-2-3 2-3-2-3 2-3-2-1 2z" /><path d="M8 7h8" /><path d="M8 11h8" />
    </svg>
  ),
  check: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
};

type Props = { searchParams: Promise<{ from?: string; to?: string }> };

export default async function EarningsPage({ searchParams }: Props) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { from, to } = await searchParams;
  const stats = await getEarningsStats();
  const range = from && to ? await getInvoicesByDateRange(from, to) : null;

  return (
    <div className="px-4 md:px-8 py-6 max-w-5xl mx-auto">
      <PageHeader
        title="Earnings"
        actions={
          <Link
            href="/admin/invoices/new"
            className="inline-flex items-center gap-1.5 text-sm font-medium bg-[var(--color-accent)] text-white rounded-full px-4 py-2 hover:opacity-90 transition-opacity"
          >
            + Record income
          </Link>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        <StatCard label="Today" value={fmt(stats.today)} sub="Invoices billed today" icon={ICONS.rupee} tone="accent" />
        <StatCard label="This month" value={fmt(stats.month)} sub="Invoices billed this month" icon={ICONS.calendar} tone="info" />
        <StatCard label="All time" value={fmt(stats.allTime)} sub="Total invoiced" icon={ICONS.trending} tone="success" />
      </div>

      {/* Date range report */}
      <div className="card-surface border rounded-2xl overflow-hidden mb-4">
        <div className="px-4 py-3 border-b border-[var(--color-line)]">
          <h2 className="text-sm font-semibold text-[var(--color-ink)] mb-3">Custom report</h2>
          <form method="get" className="flex flex-wrap items-end gap-3">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)] mb-1.5">
                From
              </label>
              <input
                type="date"
                name="from"
                defaultValue={from}
                className="px-3 py-2 border border-[var(--color-line)] rounded-xl text-sm bg-[var(--color-bg-soft)] outline-none focus:border-[var(--color-accent)] focus:bg-[var(--color-bg-card)] transition-colors"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)] mb-1.5">
                To
              </label>
              <input
                type="date"
                name="to"
                defaultValue={to}
                className="px-3 py-2 border border-[var(--color-line)] rounded-xl text-sm bg-[var(--color-bg-soft)] outline-none focus:border-[var(--color-accent)] focus:bg-[var(--color-bg-card)] transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-sm font-medium bg-[var(--color-accent)] text-white hover:opacity-90 transition-opacity"
            >
              View report
            </button>
            {from && to && (
              <Link
                href="/admin/earnings"
                className="px-4 py-2 rounded-xl text-sm font-medium border border-[var(--color-line)] text-[var(--color-ink-3)] hover:text-[var(--color-ink)] transition-colors"
              >
                Clear
              </Link>
            )}
          </form>
        </div>

        {range && (
          <>
            <div className="flex items-center justify-between gap-4 px-4 py-3 border-b border-[var(--color-line)] bg-[var(--color-bg-soft)]">
              <p className="text-sm text-[var(--color-ink-3)]">
                {range.invoices.length} invoice{range.invoices.length === 1 ? "" : "s"} from {from} to {to}
              </p>
              <p className="font-mono text-sm font-semibold text-[var(--color-ink)]">{fmt(range.total)}</p>
            </div>
            {range.invoices.length === 0 ? (
              <EmptyState icon={ICONS.receipt} title="No invoices in this date range" />
            ) : (
              <div className="divide-y divide-[var(--color-line)]">
                {range.invoices.map((inv) => (
                  <Link
                    key={inv.id}
                    href={`/admin/invoices/${inv.id}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--color-bg-soft)] transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--color-ink)] truncate">{inv.customer_name}</p>
                      <p className="text-xs text-[var(--color-ink-3)] truncate">
                        {inv.invoice_number} · {fmtDate(inv.created_at)} · {PAYMENT_LABELS[inv.payment_method] ?? inv.payment_method}
                      </p>
                    </div>
                    <p className="text-sm font-mono font-semibold text-[var(--color-ink)] shrink-0">{fmt(inv.total)}</p>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Pending */}
      <div className="card-surface border rounded-2xl overflow-hidden mb-4">
        <div className="flex items-center justify-between gap-4 px-4 py-3 border-b border-[var(--color-line)]">
          <h2 className="text-sm font-semibold text-[var(--color-ink)]">Pending — not yet billed</h2>
          <p className="font-mono text-sm font-semibold text-[var(--color-ink)]">{fmt(stats.pendingTotal)}</p>
        </div>
        {stats.pendingRepairs.length === 0 ? (
          <EmptyState icon={ICONS.check} title="Everything billed" description="Everything in the pipeline has been billed." />
        ) : (
          <div className="divide-y divide-[var(--color-line)]">
            {stats.pendingRepairs.map((r) => {
              const st = STATUS_LABELS[r.status] ?? { label: r.status, tone: "neutral" as StatusTone };
              return (
                <div key={r.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--color-ink)] truncate">{r.customer_name}</p>
                    <p className="text-xs text-[var(--color-ink-3)] truncate">{r.issue_text}</p>
                  </div>
                  <StatusPill label={st.label} tone={st.tone} />
                  <div className="text-right shrink-0 w-20">
                    {r.amount != null && (
                      <p className="text-sm font-mono font-semibold text-[var(--color-ink)]">{fmt(r.amount)}</p>
                    )}
                  </div>
                  <Link
                    href={`/admin/invoices/new?repairId=${r.id}`}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-[var(--color-line)] text-[var(--color-ink-3)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-colors shrink-0"
                  >
                    Bill
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Link
        href="/admin/invoices"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-ink-3)] hover:text-[var(--color-accent)] transition-colors"
      >
        View all invoices →
      </Link>
    </div>
  );
}
