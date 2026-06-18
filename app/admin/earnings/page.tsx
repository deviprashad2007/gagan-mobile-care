import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getEarningsPageData } from "@/lib/admin";
import { PageHeader } from "@/components/admin/ui/page-header";
import { StatCard } from "@/components/admin/ui/stat-card";
import { StatusPill, type StatusTone } from "@/components/admin/ui/status-pill";
import { EmptyState } from "@/components/admin/ui/empty-state";
import type { MonthlyBar, PaymentBreakdown } from "@/lib/admin";
import type { Invoice } from "@/lib/admin";

// ─── helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const PAYMENT_LABELS: Record<string, string> = {
  cash: "Cash",
  upi: "UPI",
  card: "Card",
  other: "Other",
};

const PAYMENT_TONES: Record<string, StatusTone> = {
  cash: "success",
  upi: "info",
  card: "accent",
  other: "neutral",
};

const STATUS_LABELS: Record<string, { label: string; tone: StatusTone }> = {
  received: { label: "Received", tone: "neutral" },
  working:  { label: "Working",  tone: "info" },
  ready:    { label: "Ready",    tone: "success" },
};

const PERIOD_TABS = [
  { id: "today",      label: "Today" },
  { id: "week",       label: "This week" },
  { id: "month",      label: "This month" },
  { id: "last_month", label: "Last month" },
  { id: "custom",     label: "Custom" },
] as const;

// ─── icons ────────────────────────────────────────────────────────────────────

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
  week: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12h18M3 6h18M3 18h18" />
    </svg>
  ),
  avg: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" /><path d="M8 12h8M12 8v8" />
    </svg>
  ),
  edit: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
};

// ─── sub-components ───────────────────────────────────────────────────────────

function BarChart({ data }: { data: MonthlyBar[] }) {
  const max = Math.max(...data.map((d) => d.total), 1);
  const BAR_H = 80;

  return (
    <div className="card-surface border rounded-2xl overflow-hidden mb-4">
      <div className="px-4 py-3 border-b border-[var(--color-line)]">
        <h2 className="text-sm font-semibold text-[var(--color-ink)]">Revenue — last 6 months</h2>
      </div>
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-end gap-2 h-24">
          {data.map((bar) => {
            const barH = max > 0 ? Math.round((bar.total / max) * BAR_H) : 0;
            const isEmpty = bar.total === 0;
            return (
              <div key={bar.key} className="flex flex-col items-center gap-1 flex-1 min-w-0">
                <span className="text-[9px] font-mono text-[var(--color-ink-3)] truncate w-full text-center leading-none">
                  {isEmpty ? "" : fmt(bar.total)}
                </span>
                <div className="w-full flex items-end" style={{ height: BAR_H }}>
                  <div
                    className="w-full rounded-t-md transition-all"
                    style={{
                      height: isEmpty ? 4 : barH,
                      background: isEmpty
                        ? "var(--color-line)"
                        : "var(--color-accent)",
                      opacity: isEmpty ? 0.3 : 1,
                    }}
                  />
                </div>
                <span className="text-[9px] text-[var(--color-ink-3)] truncate w-full text-center leading-none">
                  {bar.month.split(" ")[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PaymentBreakdownStrip({ b }: { b: PaymentBreakdown }) {
  if (b.total === 0) return null;
  const items = [
    { key: "cash",  label: "Cash",  value: b.cash  },
    { key: "upi",   label: "UPI",   value: b.upi   },
    { key: "card",  label: "Card",  value: b.card  },
    { key: "other", label: "Other", value: b.other },
  ].filter((i) => i.value > 0);

  const COLORS: Record<string, string> = {
    cash:  "#22A06B",
    upi:   "#0A66C2",
    card:  "#E63329",
    other: "#888",
  };

  return (
    <div className="card-surface border rounded-2xl overflow-hidden mb-4">
      <div className="px-4 py-3 border-b border-[var(--color-line)]">
        <h2 className="text-sm font-semibold text-[var(--color-ink)]">Payment method breakdown</h2>
      </div>
      <div className="px-4 py-3 space-y-2.5">
        {/* Progress bar */}
        <div className="flex h-2.5 rounded-full overflow-hidden gap-px">
          {items.map((item) => (
            <div
              key={item.key}
              style={{
                width: `${(item.value / b.total) * 100}%`,
                background: COLORS[item.key],
              }}
            />
          ))}
        </div>
        {/* Legend */}
        <div className="flex flex-wrap gap-x-5 gap-y-1.5">
          {items.map((item) => (
            <div key={item.key} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: COLORS[item.key] }} />
              <span className="text-xs text-[var(--color-ink-3)]">{item.label}</span>
              <span className="text-xs font-mono font-semibold text-[var(--color-ink)]">{fmt(item.value)}</span>
              <span className="text-[10px] text-[var(--color-ink-3)]">
                ({Math.round((item.value / b.total) * 100)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TransactionTable({ invoices }: { invoices: Invoice[] }) {
  if (invoices.length === 0) {
    return (
      <div className="card-surface border rounded-2xl overflow-hidden mb-4">
        <EmptyState icon={ICONS.receipt} title="No transactions in this period" />
      </div>
    );
  }

  return (
    <div className="card-surface border rounded-2xl overflow-hidden mb-4">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-line)]">
        <h2 className="text-sm font-semibold text-[var(--color-ink)]">
          Transactions
          <span className="ml-2 text-[var(--color-ink-3)] font-normal">({invoices.length})</span>
        </h2>
        <span className="font-mono text-sm font-semibold text-[var(--color-ink)]">
          {fmt(invoices.reduce((s, i) => s + i.total, 0))}
        </span>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-line)] bg-[var(--color-bg-soft)]">
              <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)]">Bill No.</th>
              <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)]">Date</th>
              <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)]">Customer</th>
              <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)]">Device</th>
              <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)]">Payment</th>
              <th className="px-4 py-2.5 text-right font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)]">Amount</th>
              <th className="px-4 py-2.5 text-right font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)]"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-line)]">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-[var(--color-bg-soft)] transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-[var(--color-accent)] font-semibold whitespace-nowrap">
                  {inv.invoice_number}
                </td>
                <td className="px-4 py-3 text-xs text-[var(--color-ink-3)] whitespace-nowrap">
                  {fmtDate(inv.created_at)}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-[var(--color-ink)] max-w-[140px] truncate">
                  {inv.customer_name}
                </td>
                <td className="px-4 py-3 text-xs text-[var(--color-ink-3)] max-w-[120px] truncate">
                  {inv.model_text ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <StatusPill
                    label={PAYMENT_LABELS[inv.payment_method] ?? inv.payment_method}
                    tone={PAYMENT_TONES[inv.payment_method] ?? "neutral"}
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  <div>
                    <span className="font-mono text-sm font-semibold text-[var(--color-ink)]">
                      {fmt(inv.total)}
                    </span>
                    {inv.discount > 0 && (
                      <div className="text-[10px] text-[var(--color-ink-3)]">−{fmt(inv.discount)} disc.</div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/admin/invoices/${inv.id}/edit`}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-[var(--color-line)] text-[var(--color-ink-3)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-colors"
                    >
                      {ICONS.edit} Edit
                    </Link>
                    <Link
                      href={`/admin/invoices/${inv.id}`}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-[var(--color-line)] text-[var(--color-ink-3)] hover:text-[var(--color-ink)] transition-colors"
                    >
                      View
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile list */}
      <div className="md:hidden divide-y divide-[var(--color-line)]">
        {invoices.map((inv) => (
          <div key={inv.id} className="px-4 py-3 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-mono text-xs text-[var(--color-accent)] font-semibold">{inv.invoice_number}</span>
                <StatusPill
                  label={PAYMENT_LABELS[inv.payment_method] ?? inv.payment_method}
                  tone={PAYMENT_TONES[inv.payment_method] ?? "neutral"}
                />
              </div>
              <p className="text-sm font-medium text-[var(--color-ink)] truncate">{inv.customer_name}</p>
              <p className="text-xs text-[var(--color-ink-3)]">
                {fmtDate(inv.created_at)}{inv.model_text ? ` · ${inv.model_text}` : ""}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="font-mono text-sm font-semibold text-[var(--color-ink)]">{fmt(inv.total)}</p>
              {inv.discount > 0 && (
                <p className="text-[10px] text-[var(--color-ink-3)]">−{fmt(inv.discount)}</p>
              )}
              <div className="flex gap-1 mt-1">
                <Link href={`/admin/invoices/${inv.id}/edit`} className="text-[10px] text-[var(--color-accent)] font-semibold">Edit</Link>
                <span className="text-[10px] text-[var(--color-line)]">·</span>
                <Link href={`/admin/invoices/${inv.id}`} className="text-[10px] text-[var(--color-ink-3)]">View</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

type Props = { searchParams: Promise<{ period?: string; from?: string; to?: string }> };

export default async function EarningsPage({ searchParams }: Props) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { period: rawPeriod, from, to } = await searchParams;
  const period = rawPeriod ?? "month";

  const data = await getEarningsPageData(period, from, to);

  const periodLabel =
    period === "today"      ? "today" :
    period === "week"       ? "this week" :
    period === "last_month" ? "last month" :
    period === "custom"     ? "custom range" :
    "this month";

  return (
    <div className="px-4 md:px-8 py-6 max-w-5xl mx-auto">
      <PageHeader
        title="Earnings"
        subtitle={`${data.stats.invoiceCount} invoice${data.stats.invoiceCount === 1 ? "" : "s"} · ${fmt(data.stats.allTime)} all time`}
        actions={
          <Link
            href="/admin/invoices/new"
            className="inline-flex items-center gap-1.5 text-sm font-medium bg-[var(--color-accent)] text-white rounded-full px-4 py-2 hover:opacity-90 transition-opacity"
          >
            + Record income
          </Link>
        }
      />

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <StatCard label="Today"        value={fmt(data.stats.today)}      sub="Billed today"       icon={ICONS.rupee}    tone="accent"  />
        <StatCard label="This week"    value={fmt(data.stats.week)}       sub="Billed this week"   icon={ICONS.week}     tone="neutral" />
        <StatCard label="This month"   value={fmt(data.stats.month)}      sub="Billed this month"  icon={ICONS.calendar} tone="info"    />
        <StatCard label="All time"     value={fmt(data.stats.allTime)}    sub="Total invoiced"     icon={ICONS.trending} tone="success" />
        <StatCard label="Avg. invoice" value={fmt(data.stats.avgInvoice)} sub="Per bill average"   icon={ICONS.avg}      tone="neutral" />
      </div>

      {/* ── Monthly bar chart ── */}
      <BarChart data={data.chartData} />

      {/* ── Period tabs ── */}
      <div className="card-surface border rounded-2xl overflow-hidden mb-4">
        {/* Tabs */}
        <div className="flex border-b border-[var(--color-line)] overflow-x-auto">
          {PERIOD_TABS.map((tab) => {
            const isActive = period === tab.id;
            return (
              <Link
                key={tab.id}
                href={`/admin/earnings?period=${tab.id}`}
                className="px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px"
                style={{
                  borderBottomColor: isActive ? "var(--color-accent)" : "transparent",
                  color: isActive ? "var(--color-accent)" : "var(--color-ink-3)",
                }}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        {/* Custom date pickers */}
        {period === "custom" && (
          <div className="px-4 py-3 border-b border-[var(--color-line)] bg-[var(--color-bg-soft)]">
            <form method="get" className="flex flex-wrap items-end gap-3">
              <input type="hidden" name="period" value="custom" />
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)] mb-1.5">From</label>
                <input
                  type="date"
                  name="from"
                  defaultValue={from}
                  className="px-3 py-2 border border-[var(--color-line)] rounded-xl text-sm bg-[var(--color-bg-card)] outline-none focus:border-[var(--color-accent)] transition-colors"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)] mb-1.5">To</label>
                <input
                  type="date"
                  name="to"
                  defaultValue={to}
                  className="px-3 py-2 border border-[var(--color-line)] rounded-xl text-sm bg-[var(--color-bg-card)] outline-none focus:border-[var(--color-accent)] transition-colors"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-sm font-medium bg-[var(--color-accent)] text-white hover:opacity-90 transition-opacity"
              >
                View report
              </button>
            </form>
          </div>
        )}

        {/* Period summary line */}
        <div className="px-4 py-2.5 bg-[var(--color-bg-soft)] border-b border-[var(--color-line)]">
          <p className="text-xs text-[var(--color-ink-3)]">
            Showing <span className="font-semibold text-[var(--color-ink)]">{periodLabel}</span>
            {" — "}
            <span className="font-mono font-semibold text-[var(--color-ink)]">
              {fmt(data.invoices.reduce((s, i) => s + i.total, 0))}
            </span>
            {" across "}
            <span className="font-semibold text-[var(--color-ink)]">{data.invoices.length}</span>
            {" invoice"}{data.invoices.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      {/* ── Payment breakdown ── */}
      <PaymentBreakdownStrip b={data.breakdown} />

      {/* ── Transaction table ── */}
      <TransactionTable invoices={data.invoices} />

      {/* ── Pending ── */}
      <div className="card-surface border rounded-2xl overflow-hidden mb-4">
        <div className="flex items-center justify-between gap-4 px-4 py-3 border-b border-[var(--color-line)]">
          <h2 className="text-sm font-semibold text-[var(--color-ink)]">
            Pending — not yet billed
            {data.pendingRepairs.length > 0 && (
              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold text-white bg-[var(--color-accent)]">
                {data.pendingRepairs.length}
              </span>
            )}
          </h2>
          {data.pendingRepairs.length > 0 && (
            <p className="font-mono text-sm font-semibold text-[var(--color-ink)]">{fmt(data.pendingTotal)}</p>
          )}
        </div>
        {data.pendingRepairs.length === 0 ? (
          <EmptyState icon={ICONS.check} title="All billed" description="Every repair in the pipeline has been billed." />
        ) : (
          <div className="divide-y divide-[var(--color-line)]">
            {data.pendingRepairs.map((r) => {
              const st = STATUS_LABELS[r.status] ?? { label: r.status, tone: "neutral" as StatusTone };
              return (
                <div key={r.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--color-ink)] truncate">{r.customer_name}</p>
                    <p className="text-xs text-[var(--color-ink-3)] truncate">{r.issue_text}</p>
                  </div>
                  <StatusPill label={st.label} tone={st.tone} />
                  {r.amount != null && (
                    <p className="text-sm font-mono font-semibold text-[var(--color-ink)] w-20 text-right shrink-0">
                      {fmt(r.amount)}
                    </p>
                  )}
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
