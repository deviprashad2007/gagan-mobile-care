import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getEarningsStats, getInvoicesByDateRange } from "@/lib/admin";

const STATUS_LABELS: Record<string, string> = {
  received: "Received",
  working: "Working",
  ready: "Ready",
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
      <div className="flex items-center justify-between gap-4 mb-5">
        <h1 className="font-serif text-2xl md:text-3xl tracking-tight text-[var(--color-ink)]">
          Earnings
        </h1>
        <Link
          href="/admin/invoices/new"
          className="inline-flex items-center gap-1.5 text-sm font-medium bg-[var(--color-ink)] text-[var(--color-bg)] rounded-full px-4 py-2 hover:opacity-90 transition-opacity"
        >
          + Record income
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {[
          { label: "Today", value: stats.today, sub: "Invoices billed today" },
          { label: "This month", value: stats.month, sub: "Invoices billed this month" },
          { label: "All time", value: stats.allTime, sub: "Total invoiced" },
        ].map((s) => (
          <div key={s.label} className="card-surface border rounded-2xl p-4">
            <p className="text-xs text-[var(--color-ink-3)] mb-1">{s.label}</p>
            <p className="font-serif text-3xl leading-none tracking-tight text-[var(--color-ink)]">
              {fmt(s.value)}
            </p>
            <p className="text-[11px] text-[var(--color-ink-3)] mt-1">{s.sub}</p>
          </div>
        ))}
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
                className="px-3 py-2 border border-[var(--color-line)] rounded-xl text-sm bg-[var(--color-bg-soft)] outline-none focus:border-[var(--color-ink)] focus:bg-[var(--color-bg-card)] transition-colors"
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
                className="px-3 py-2 border border-[var(--color-line)] rounded-xl text-sm bg-[var(--color-bg-soft)] outline-none focus:border-[var(--color-ink)] focus:bg-[var(--color-bg-card)] transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-sm font-medium bg-[var(--color-ink)] text-[var(--color-bg)] hover:opacity-90 transition-opacity"
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
              <p className="text-center text-sm text-[var(--color-ink-3)] py-10">
                No invoices in this date range.
              </p>
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
          <p className="text-center text-sm text-[var(--color-ink-3)] py-10">
            Everything in the pipeline has been billed.
          </p>
        ) : (
          <div className="divide-y divide-[var(--color-line)]">
            {stats.pendingRepairs.map((r) => (
              <div key={r.id} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--color-ink)] truncate">{r.customer_name}</p>
                  <p className="text-xs text-[var(--color-ink-3)] truncate">{r.issue_text}</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--color-bg-soft)] text-[var(--color-ink-3)] shrink-0">
                  {STATUS_LABELS[r.status] ?? r.status}
                </span>
                <div className="text-right shrink-0 w-20">
                  {r.amount != null && (
                    <p className="text-sm font-mono font-semibold text-[var(--color-ink)]">{fmt(r.amount)}</p>
                  )}
                </div>
                <Link
                  href={`/admin/invoices/new?repairId=${r.id}`}
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-[var(--color-line)] text-[var(--color-ink-3)] hover:text-[var(--color-ink)] transition-colors shrink-0"
                >
                  Bill
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <Link
        href="/admin/invoices"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-ink-3)] hover:text-[var(--color-ink)] transition-colors"
      >
        View all invoices →
      </Link>
    </div>
  );
}
