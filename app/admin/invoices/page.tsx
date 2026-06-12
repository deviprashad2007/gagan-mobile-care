import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getInvoices } from "@/lib/admin";

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

export default async function InvoicesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const invoices = await getInvoices();

  return (
    <div className="px-4 md:px-8 py-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between gap-4 mb-5">
        <h1 className="font-serif text-2xl md:text-3xl tracking-tight text-[var(--color-ink)]">
          Invoices
        </h1>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- route handler download, not a page */}
        <a
          href="/admin/invoices/export"
          className="inline-flex items-center gap-1.5 text-sm font-medium border border-[var(--color-line)] rounded-full px-4 py-2 text-[var(--color-ink-3)] hover:text-[var(--color-ink)] hover:border-[var(--color-ink-3)] transition-colors"
        >
          Export CSV
        </a>
      </div>

      <div className="card-surface border rounded-2xl overflow-hidden">
        {invoices.length === 0 ? (
          <p className="text-center text-sm text-[var(--color-ink-3)] py-16">No invoices yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-line)] text-[var(--color-ink-3)]">
                  <th className="text-left px-4 py-3 font-mono text-[10px] uppercase tracking-widest">Invoice</th>
                  <th className="text-left px-4 py-3 font-mono text-[10px] uppercase tracking-widest">Customer</th>
                  <th className="text-left px-4 py-3 font-mono text-[10px] uppercase tracking-widest hidden md:table-cell">Model</th>
                  <th className="text-left px-4 py-3 font-mono text-[10px] uppercase tracking-widest hidden sm:table-cell">Payment</th>
                  <th className="text-left px-4 py-3 font-mono text-[10px] uppercase tracking-widest hidden lg:table-cell">Date</th>
                  <th className="text-right px-4 py-3 font-mono text-[10px] uppercase tracking-widest">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-line)]">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[var(--color-bg-soft)] transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/admin/invoices/${inv.id}`} className="block">
                        <p className="font-mono text-xs text-[var(--color-ink)]">{inv.invoice_number}</p>
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/invoices/${inv.id}`} className="block">
                        <p className="font-medium text-[var(--color-ink)]">{inv.customer_name}</p>
                        <p className="font-mono text-xs text-[var(--color-ink-3)]">{inv.customer_phone}</p>
                      </Link>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-[var(--color-ink-3)]">
                      {inv.model_text ?? "—"}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--color-bg-soft)] text-[var(--color-ink-3)]">
                        {PAYMENT_LABELS[inv.payment_method] ?? inv.payment_method}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--color-ink-3)] hidden lg:table-cell">
                      {fmtDate(inv.created_at)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-[var(--color-ink)]">
                      {fmt(inv.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
