import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getEarningsPageData } from "@/lib/admin";
import { PageHeader } from "@/components/admin/ui/page-header";
import { StatCard } from "@/components/admin/ui/stat-card";
import { StatusPill, type StatusTone } from "@/components/admin/ui/status-pill";
import { EmptyState } from "@/components/admin/ui/empty-state";
import { PeriodTabs } from "./period-tabs";
import { RevenueChart } from "./revenue-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
};

// ─── sub-components ───────────────────────────────────────────────────────────

function RevenueChartCard({ data }: { data: MonthlyBar[] }) {
  return (
    <Card className="rounded-2xl mb-4 gap-0">
      <CardHeader className="border-b border-[var(--color-line)] pb-3">
        <CardTitle className="text-sm font-semibold">Revenue — last 6 months</CardTitle>
      </CardHeader>
      <CardContent className="pt-4 pb-3">
        <RevenueChart data={data} />
      </CardContent>
    </Card>
  );
}

function PaymentBreakdownStrip({ b }: { b: PaymentBreakdown }) {
  if (b.total === 0) return null;
  const items = [
    { key: "cash", label: "Cash", value: b.cash },
    { key: "upi", label: "UPI", value: b.upi },
    { key: "card", label: "Card", value: b.card },
    { key: "other", label: "Other", value: b.other },
  ].filter((i) => i.value > 0);

  const COLORS: Record<string, string> = {
    cash: "#22A06B",
    upi: "#0A66C2",
    card: "#E63329",
    other: "#888",
  };

  return (
    <Card className="rounded-2xl mb-4 gap-0">
      <CardHeader className="border-b border-[var(--color-line)] pb-3">
        <CardTitle className="text-sm font-semibold">Payment method breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5 py-3">
        <div className="flex h-2.5 rounded-full overflow-hidden gap-px">
          {items.map((item) => (
            <div
              key={item.key}
              style={{ width: `${(item.value / b.total) * 100}%`, background: COLORS[item.key] }}
            />
          ))}
        </div>
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
      </CardContent>
    </Card>
  );
}

function TransactionTable({ invoices }: { invoices: Invoice[] }) {
  if (invoices.length === 0) {
    return (
      <Card className="rounded-2xl mb-4">
        <EmptyState icon={ICONS.receipt} title="No transactions in this period" />
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl mb-4 gap-0 overflow-hidden">
      <CardHeader className="flex-row items-center justify-between border-b border-[var(--color-line)] pb-3">
        <CardTitle className="text-sm font-semibold">
          Transactions
          <span className="ml-2 text-[var(--color-ink-3)] font-normal">({invoices.length})</span>
        </CardTitle>
        <span className="font-mono text-sm font-semibold text-[var(--color-ink)]">
          {fmt(invoices.reduce((s, i) => s + i.total, 0))}
        </span>
      </CardHeader>

      {/* Desktop table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-[var(--color-bg-soft)]">
              <TableHead className="font-mono text-[10px] uppercase tracking-widest px-4">Bill No.</TableHead>
              <TableHead className="font-mono text-[10px] uppercase tracking-widest">Date</TableHead>
              <TableHead className="font-mono text-[10px] uppercase tracking-widest">Customer</TableHead>
              <TableHead className="font-mono text-[10px] uppercase tracking-widest">Device</TableHead>
              <TableHead className="font-mono text-[10px] uppercase tracking-widest">Payment</TableHead>
              <TableHead className="font-mono text-[10px] uppercase tracking-widest text-right">Amount</TableHead>
              <TableHead className="px-4"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell className="px-4 font-mono text-xs text-[var(--color-accent)] font-semibold">
                  {inv.invoice_number}
                </TableCell>
                <TableCell className="text-xs text-[var(--color-ink-3)]">{fmtDate(inv.created_at)}</TableCell>
                <TableCell className="text-sm font-medium text-[var(--color-ink)] max-w-[140px] truncate">
                  {inv.customer_name}
                </TableCell>
                <TableCell className="text-xs text-[var(--color-ink-3)] max-w-[120px] truncate">
                  {inv.model_text ?? "—"}
                </TableCell>
                <TableCell>
                  <StatusPill
                    label={PAYMENT_LABELS[inv.payment_method] ?? inv.payment_method}
                    tone={PAYMENT_TONES[inv.payment_method] ?? "neutral"}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <span className="font-mono text-sm font-semibold text-[var(--color-ink)]">{fmt(inv.total)}</span>
                  {inv.discount > 0 && (
                    <div className="text-[10px] text-[var(--color-ink-3)]">−{fmt(inv.discount)} disc.</div>
                  )}
                </TableCell>
                <TableCell className="px-4">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button variant="outline" size="sm" render={<Link href={`/admin/invoices/${inv.id}/edit`} />}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" render={<Link href={`/admin/invoices/${inv.id}`} />}>
                      View
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
              {inv.discount > 0 && <p className="text-[10px] text-[var(--color-ink-3)]">−{fmt(inv.discount)}</p>}
              <div className="flex gap-2 mt-1 justify-end">
                <Button variant="link" size="sm" className="h-auto p-0 text-[10px]" render={<Link href={`/admin/invoices/${inv.id}/edit`} />}>
                  Edit
                </Button>
                <Button variant="link" size="sm" className="h-auto p-0 text-[10px] text-[var(--color-ink-3)]" render={<Link href={`/admin/invoices/${inv.id}`} />}>
                  View
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
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
    period === "today" ? "today" :
    period === "week" ? "this week" :
    period === "last_month" ? "last month" :
    period === "custom" ? "custom range" :
    "this month";

  return (
    <div className="px-4 md:px-8 py-6 max-w-5xl mx-auto">
      <PageHeader
        title="Earnings"
        subtitle={`${data.stats.invoiceCount} invoice${data.stats.invoiceCount === 1 ? "" : "s"} · ${fmt(data.stats.allTime)} all time`}
        actions={
          <Button render={<Link href="/admin/invoices/new" />}>
            + Record income
          </Button>
        }
      />

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <StatCard label="Today" value={fmt(data.stats.today)} sub="Billed today" icon={ICONS.rupee} tone="accent" />
        <StatCard label="This week" value={fmt(data.stats.week)} sub="Billed this week" icon={ICONS.week} tone="neutral" />
        <StatCard label="This month" value={fmt(data.stats.month)} sub="Billed this month" icon={ICONS.calendar} tone="info" />
        <StatCard label="All time" value={fmt(data.stats.allTime)} sub="Total invoiced" icon={ICONS.trending} tone="success" />
        <StatCard label="Avg. invoice" value={fmt(data.stats.avgInvoice)} sub="Per bill average" icon={ICONS.avg} tone="neutral" />
      </div>

      {/* ── Monthly bar chart ── */}
      <RevenueChartCard data={data.chartData} />

      {/* ── Period tabs ── */}
      <Card className="rounded-2xl mb-4 gap-0 overflow-hidden">
        <CardContent className="p-0">
          <div className="px-2 pt-2">
            <PeriodTabs period={period} />
          </div>

          {period === "custom" && (
            <form method="get" className="flex flex-wrap items-end gap-3 px-4 py-3 border-t border-[var(--color-line)] bg-[var(--color-bg-soft)]">
              <input type="hidden" name="period" value="custom" />
              <div>
                <Label htmlFor="from" className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)] mb-1.5 block">
                  From
                </Label>
                <Input id="from" type="date" name="from" defaultValue={from} className="h-9 w-auto" />
              </div>
              <div>
                <Label htmlFor="to" className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)] mb-1.5 block">
                  To
                </Label>
                <Input id="to" type="date" name="to" defaultValue={to} className="h-9 w-auto" />
              </div>
              <Button type="submit" size="lg">View report</Button>
            </form>
          )}

          <div className="px-4 py-2.5 bg-[var(--color-bg-soft)] border-t border-[var(--color-line)]">
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
        </CardContent>
      </Card>

      {/* ── Payment breakdown ── */}
      <PaymentBreakdownStrip b={data.breakdown} />

      {/* ── Transaction table ── */}
      <TransactionTable invoices={data.invoices} />

      {/* ── Pending ── */}
      <Card className="rounded-2xl mb-4 gap-0 overflow-hidden">
        <CardHeader className="flex-row items-center justify-between border-b border-[var(--color-line)] pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            Pending — not yet billed
            {data.pendingRepairs.length > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold text-white bg-[var(--color-accent)]">
                {data.pendingRepairs.length}
              </span>
            )}
          </CardTitle>
          {data.pendingRepairs.length > 0 && (
            <p className="font-mono text-sm font-semibold text-[var(--color-ink)]">{fmt(data.pendingTotal)}</p>
          )}
        </CardHeader>
        <CardContent className="p-0">
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
                    <Button variant="outline" size="sm" className="shrink-0" render={<Link href={`/admin/invoices/new?repairId=${r.id}`} />}>
                      Bill
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Button variant="link" className="px-0" render={<Link href="/admin/invoices" />}>
        View all invoices →
      </Button>
    </div>
  );
}
