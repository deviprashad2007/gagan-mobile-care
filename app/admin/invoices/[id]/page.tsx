import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getInvoiceById } from "@/lib/admin";
import { BUSINESS_NAME, BUSINESS_ADDRESS, BUSINESS_PHONE, BUSINESS_GSTIN } from "@/lib/seo/business-info";
import type { InvoiceItem } from "@/lib/validations/invoice";
import { PrintButton } from "./print-button";
import { DeleteInvoiceButton } from "./delete-invoice-button";

const PAYMENT_LABELS: Record<string, string> = {
  cash: "Cash",
  upi: "UPI",
  card: "Card",
  other: "Other",
};

const HSN_CODE = "9987"; // Maintenance, repair and installation services

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen",
  "Eighteen", "Nineteen"];
const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function numToWords(n: number): string {
  if (n === 0) return "Zero";
  if (n < 20) return ones[n];
  if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
  if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + numToWords(n % 100) : "");
  if (n < 100000) return numToWords(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + numToWords(n % 1000) : "");
  if (n < 10000000) return numToWords(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + numToWords(n % 100000) : "");
  return numToWords(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 ? " " + numToWords(n % 10000000) : "");
}

function amountInWords(total: number): string {
  const rupees = Math.floor(total);
  const paise = Math.round((total - rupees) * 100);
  let words = numToWords(rupees) + " Rupees";
  if (paise > 0) words += " and " + numToWords(paise) + " Paise";
  return words + " Only";
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
  const subtotal = invoice.subtotal;
  const discount = invoice.discount;
  const total = invoice.total;
  const amountPaid = total;
  const balance = 0;

  return (
    <div className="px-4 md:px-8 py-6 max-w-3xl mx-auto">
      {/* Toolbar — hidden on print */}
      <div className="no-print flex items-center justify-between gap-4 mb-5">
        <nav className="flex items-center gap-2 text-xs text-[var(--color-ink-3)]">
          <Link href="/admin/invoices" className="hover:text-[var(--color-accent)] transition-colors">
            Invoices
          </Link>
          <span>/</span>
          <span className="font-mono text-[var(--color-ink)]">{invoice.invoice_number}</span>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/invoices/${invoice.id}/edit`}
            className="no-print inline-flex items-center gap-1.5 text-sm font-medium border border-[var(--color-line)] text-[var(--color-ink-3)] rounded-full px-4 py-2 hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-colors"
          >
            Edit
          </Link>
          <DeleteInvoiceButton id={invoice.id} />
          <PrintButton />
        </div>
      </div>

      {/* ── Invoice ── */}
      <div className="print-area bg-white text-black border border-gray-300 text-sm" style={{ fontFamily: "Arial, sans-serif" }}>

        {/* TAX INVOICE header */}
        <div className="text-center py-2 border-b border-gray-400 bg-gray-100">
          <p className="font-bold text-base uppercase tracking-wider">Tax Invoice</p>
        </div>

        {/* Company info + Invoice meta */}
        <div className="flex border-b border-gray-300">
          {/* Left: company */}
          <div className="flex-1 p-4 border-r border-gray-300">
            <p className="font-bold text-lg leading-tight">{BUSINESS_NAME}</p>
            <p className="text-xs mt-1 text-gray-700">{BUSINESS_ADDRESS}</p>
            <p className="text-xs mt-0.5 text-gray-700">Contact : {BUSINESS_PHONE}</p>
            {BUSINESS_GSTIN && (
              <p className="text-xs mt-0.5 font-semibold">GSTIN : {BUSINESS_GSTIN}</p>
            )}
          </div>
          {/* Right: invoice number + date */}
          <div className="p-4 text-right shrink-0 min-w-[160px]">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Invoice No.</p>
            <p className="font-bold text-sm mt-0.5">{invoice.invoice_number}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wide mt-3">Date</p>
            <p className="font-semibold text-sm mt-0.5">{fmtDate(invoice.created_at)}</p>
          </div>
        </div>

        {/* Bill To */}
        <div className="p-4 border-b border-gray-300">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Bill To :</p>
          <p className="font-bold">{invoice.customer_name}</p>
          {invoice.customer_phone && (
            <p className="text-xs text-gray-700">Contact: {invoice.customer_phone}</p>
          )}
          {invoice.model_text && (
            <p className="text-xs text-gray-700">{invoice.model_text}</p>
          )}
        </div>

        {/* Items table */}
        <table className="w-full border-b border-gray-300" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr className="bg-gray-50 text-xs uppercase tracking-wide font-bold border-b border-gray-300">
              <th className="p-2 text-left border-r border-gray-200 w-8">S.No.</th>
              <th className="p-2 text-left border-r border-gray-200">Particulars</th>
              <th className="p-2 text-center border-r border-gray-200 w-20">HSN/SAC</th>
              <th className="p-2 text-center border-r border-gray-200 w-10">QTY</th>
              <th className="p-2 text-right border-r border-gray-200 w-24">Unit Price</th>
              {BUSINESS_GSTIN && <th className="p-2 text-center border-r border-gray-200 w-12">GST</th>}
              <th className="p-2 text-right w-24">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-b border-gray-200">
                <td className="p-2 text-center border-r border-gray-200 text-gray-500">{i + 1}</td>
                <td className="p-2 border-r border-gray-200">{item.description}</td>
                <td className="p-2 text-center border-r border-gray-200 text-gray-500">{HSN_CODE}</td>
                <td className="p-2 text-center border-r border-gray-200">{item.qty}</td>
                <td className="p-2 text-right border-r border-gray-200 font-mono">{fmt(item.price)}</td>
                {BUSINESS_GSTIN && <td className="p-2 text-center border-r border-gray-200">18%</td>}
                <td className="p-2 text-right font-mono">{fmt(item.qty * item.price)}</td>
              </tr>
            ))}
            {/* Blank filler row */}
            <tr className="border-b border-gray-200" style={{ height: 32 }}>
              <td className="border-r border-gray-200" />
              <td className="border-r border-gray-200" />
              <td className="border-r border-gray-200" />
              <td className="border-r border-gray-200" />
              <td className="border-r border-gray-200" />
              {BUSINESS_GSTIN && <td className="border-r border-gray-200" />}
              <td />
            </tr>
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-300 font-bold">
              <td className="p-2 border-r border-gray-200" />
              <td className="p-2 border-r border-gray-200 font-bold">TOTAL</td>
              <td className="p-2 border-r border-gray-200 text-center text-gray-500">{items.length}</td>
              <td className="border-r border-gray-200" />
              <td className="border-r border-gray-200" />
              {BUSINESS_GSTIN && <td className="border-r border-gray-200" />}
              <td className="p-2 text-right font-mono font-bold">{fmt(subtotal)}</td>
            </tr>
          </tfoot>
        </table>

        {/* Sub total + Tax row */}
        <div className="flex border-b border-gray-300">
          <div className="flex-1 border-r border-gray-300" />
          <div className="p-3 min-w-[200px] space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Sub Total</span>
              <span className="font-mono">{fmt(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Discount</span>
                <span className="font-mono">− {fmt(discount)}</span>
              </div>
            )}
            {BUSINESS_GSTIN ? (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">CGST (9%)</span>
                  <span className="font-mono">{fmt(Math.round(total * 0.09 / 1.18))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">SGST (9%)</span>
                  <span className="font-mono">{fmt(Math.round(total * 0.09 / 1.18))}</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between">
                <span className="text-gray-600">Tax Amount (+)</span>
                <span className="font-mono text-gray-400">—</span>
              </div>
            )}
          </div>
        </div>

        {/* Amount in words + Total box */}
        <div className="flex border-b border-gray-300">
          {/* Left: amount in words */}
          <div className="flex-1 p-4 border-r border-gray-300">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Amount in Words (To be Paid) :</p>
            <p className="text-sm font-medium">{amountInWords(total)}</p>
          </div>
          {/* Right: total breakdown */}
          <div className="p-4 min-w-[200px] space-y-1 text-sm">
            <div className="flex justify-between font-bold text-base">
              <span>TOTAL AMOUNT</span>
              <span className="font-mono">{fmt(total)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>AMOUNT (TO BE PAID)</span>
              <span className="font-mono">{fmt(total)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Amount Paid</span>
              <span className="font-mono">{fmt(amountPaid)}</span>
            </div>
            <div className="flex justify-between text-gray-600 border-t border-gray-200 pt-1 mt-1">
              <span>Balance</span>
              <span className="font-mono">{fmt(balance)}</span>
            </div>
            <div className="flex justify-between text-gray-600 pt-1">
              <span>Payment</span>
              <span>{PAYMENT_LABELS[invoice.payment_method] ?? invoice.payment_method}</span>
            </div>
          </div>
        </div>

        {/* Terms + Signatory */}
        <div className="flex border-b border-gray-300">
          <div className="flex-1 p-4 border-r border-gray-300">
            <p className="text-xs font-bold mb-2">Invoice Terms &amp; Conditions:</p>
            <ul className="text-xs text-gray-600 space-y-0.5 list-disc list-inside">
              <li>All repairs are checked before handover.</li>
              <li>Warranty on replaced parts as per manufacturer.</li>
              <li>No liability for data loss during repair.</li>
              <li>Payment due at time of collection.</li>
              <li>All disputes subject to Patiala jurisdiction only.</li>
            </ul>
            {invoice.notes && (
              <div className="mt-3">
                <p className="text-xs font-semibold text-gray-700">Notes:</p>
                <p className="text-xs text-gray-600">{invoice.notes}</p>
              </div>
            )}
          </div>
          <div className="p-4 min-w-[200px] flex flex-col justify-between text-right">
            <p className="text-xs font-bold">For, {BUSINESS_NAME}</p>
            <div>
              <div className="h-12" />
              <p className="text-xs text-gray-500 border-t border-gray-300 pt-1 mt-1">Authorised Signatory</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 text-center">
          <p className="text-xs text-gray-500">This is a computer generated invoice and does not require signature</p>
        </div>
      </div>
    </div>
  );
}
