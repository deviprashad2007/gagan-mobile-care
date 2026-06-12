import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getInvoiceById } from "@/lib/admin";
import { BUSINESS_NAME, BUSINESS_ADDRESS, BUSINESS_PHONE } from "@/lib/seo/business-info";
import type { InvoiceItem } from "@/lib/validations/invoice";
import { PrintButton } from "./print-button";
import { DeleteInvoiceButton } from "./delete-invoice-button";

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

type Props = { params: Promise<{ id: string }> };

export default async function InvoiceDetailPage({ params }: Props) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { id } = await params;
  const invoice = await getInvoiceById(id);
  if (!invoice) notFound();

  const items = invoice.items as unknown as InvoiceItem[];

  return (
    <div className="px-4 md:px-8 py-6 max-w-2xl mx-auto">
      <div className="no-print flex items-center justify-between gap-4 mb-5">
        <nav className="flex items-center gap-2 text-xs text-[var(--color-ink-3)]">
          <Link href="/admin/invoices" className="hover:text-[var(--color-ink)] transition-colors">
            Invoices
          </Link>
          <span>/</span>
          <span className="font-mono text-[var(--color-ink)]">{invoice.invoice_number}</span>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/invoices/${invoice.id}/edit`}
            className="no-print inline-flex items-center gap-1.5 text-sm font-medium border border-[var(--color-line)] text-[var(--color-ink-3)] rounded-full px-4 py-2 hover:text-[var(--color-ink)] transition-colors"
          >
            Edit
          </Link>
          <DeleteInvoiceButton id={invoice.id} />
          <PrintButton />
        </div>
      </div>

      <div className="print-area card-surface border rounded-2xl p-6 sm:p-8">
        {/* Letterhead */}
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-[var(--color-line)]">
          <div>
            <h1 className="font-serif text-xl sm:text-2xl tracking-tight text-[var(--color-ink)]">
              {BUSINESS_NAME}
            </h1>
            <p className="text-xs text-[var(--color-ink-3)] mt-1 max-w-xs">{BUSINESS_ADDRESS}</p>
            <p className="text-xs text-[var(--color-ink-3)] mt-0.5">{BUSINESS_PHONE}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-mono text-sm text-[var(--color-ink)]">{invoice.invoice_number}</p>
            <p className="text-xs text-[var(--color-ink-3)] mt-1">{fmtDate(invoice.created_at)}</p>
          </div>
        </div>

        {/* Bill to */}
        <div className="py-5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)] mb-1.5">
            Bill to
          </p>
          <p className="text-sm font-medium text-[var(--color-ink)]">{invoice.customer_name}</p>
          {invoice.customer_phone && (
            <p className="font-mono text-xs text-[var(--color-ink-3)] mt-0.5">{invoice.customer_phone}</p>
          )}
          {invoice.model_text && (
            <p className="text-xs text-[var(--color-ink-3)] mt-0.5">{invoice.model_text}</p>
          )}
        </div>

        {/* Items */}
        <table className="w-full text-sm border-t border-[var(--color-line)]">
          <thead>
            <tr className="text-[var(--color-ink-3)]">
              <th className="text-left py-2 font-mono text-[10px] uppercase tracking-widest">Description</th>
              <th className="text-center py-2 font-mono text-[10px] uppercase tracking-widest w-16">Qty</th>
              <th className="text-right py-2 font-mono text-[10px] uppercase tracking-widest w-24">Price</th>
              <th className="text-right py-2 font-mono text-[10px] uppercase tracking-widest w-28">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-line)]">
            {items.map((item, i) => (
              <tr key={i}>
                <td className="py-2.5 text-[var(--color-ink)]">{item.description}</td>
                <td className="py-2.5 text-center text-[var(--color-ink-3)]">{item.qty}</td>
                <td className="py-2.5 text-right font-mono text-[var(--color-ink-3)]">{fmt(item.price)}</td>
                <td className="py-2.5 text-right font-mono text-[var(--color-ink)]">{fmt(item.qty * item.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="border-t border-[var(--color-line)] pt-4 mt-2 space-y-1.5 text-sm max-w-xs ml-auto">
          <div className="flex justify-between text-[var(--color-ink-3)]">
            <span>Subtotal</span>
            <span className="font-mono">{fmt(invoice.subtotal)}</span>
          </div>
          {invoice.discount > 0 && (
            <div className="flex justify-between text-[var(--color-ink-3)]">
              <span>Discount</span>
              <span className="font-mono">−{fmt(invoice.discount)}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold text-[var(--color-ink)] text-base border-t border-[var(--color-line)] pt-1.5 mt-1.5">
            <span>Total</span>
            <span className="font-mono">{fmt(invoice.total)}</span>
          </div>
          <div className="flex justify-between text-[var(--color-ink-3)] text-xs pt-1">
            <span>Payment</span>
            <span>{PAYMENT_LABELS[invoice.payment_method] ?? invoice.payment_method}</span>
          </div>
        </div>

        {invoice.notes && (
          <div className="border-t border-[var(--color-line)] mt-5 pt-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)] mb-1">
              Notes
            </p>
            <p className="text-sm text-[var(--color-ink-2)]">{invoice.notes}</p>
          </div>
        )}

        <p className="text-center text-xs text-[var(--color-ink-3)] mt-8">
          Thank you for choosing {BUSINESS_NAME}.
        </p>
      </div>
    </div>
  );
}
