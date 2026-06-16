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

const HSN_CODE = "9987";

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function fmtDatePrint(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
}

const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven",
  "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen",
  "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
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

  return (
    <div className="px-4 md:px-8 py-6 max-w-2xl mx-auto">

      {/* ── SCREEN UI (hidden when printing) ── */}
      <div className="no-print">
        {/* Breadcrumb + actions */}
        <div className="flex items-center justify-between gap-4 mb-5">
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
              className="inline-flex items-center gap-1.5 text-sm font-medium border border-[var(--color-line)] text-[var(--color-ink-3)] rounded-full px-4 py-2 hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-colors"
            >
              Edit
            </Link>
            <DeleteInvoiceButton id={invoice.id} />
            <PrintButton />
          </div>
        </div>

        {/* Invoice card */}
        <div className="card-surface border rounded-2xl overflow-hidden">

          {/* Header */}
          <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-[var(--color-line)]">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)] mb-1">Bill No.</p>
              <p className="text-2xl font-mono font-bold text-[var(--color-ink)]">{invoice.invoice_number}</p>
              <p className="text-xs text-[var(--color-ink-3)] mt-1">{fmtDate(invoice.created_at)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-[var(--color-ink)]">{BUSINESS_NAME}</p>
              <p className="text-xs text-[var(--color-ink-3)] mt-0.5">{BUSINESS_PHONE}</p>
              {BUSINESS_GSTIN && (
                <p className="text-xs text-[var(--color-ink-3)] mt-0.5">GSTIN: {BUSINESS_GSTIN}</p>
              )}
            </div>
          </div>

          {/* Bill to */}
          <div className="px-6 py-4 border-b border-[var(--color-line)]">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)] mb-2">Bill to</p>
            <p className="text-sm font-semibold text-[var(--color-ink)]">{invoice.customer_name}</p>
            {invoice.customer_phone && (
              <p className="text-xs text-[var(--color-ink-3)] mt-0.5 font-mono">{invoice.customer_phone}</p>
            )}
            {invoice.model_text && (
              <p className="text-xs text-[var(--color-ink-3)] mt-0.5">{invoice.model_text}</p>
            )}
            {invoice.bookingRef && (
              <p className="text-xs text-[var(--color-ink-3)] mt-1 font-mono">
                Token / Tracking: <span className="font-semibold text-[var(--color-accent)]">{invoice.bookingRef}</span>
              </p>
            )}
          </div>

          {/* Items */}
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-line)]">
                <th className="px-6 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)]">Description</th>
                <th className="px-4 py-2.5 text-center font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)] w-12">Qty</th>
                <th className="px-4 py-2.5 text-right font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)] w-24">Price</th>
                <th className="px-6 py-2.5 text-right font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)] w-24">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-line)]">
              {items.map((item, i) => (
                <tr key={i}>
                  <td className="px-6 py-3 text-[var(--color-ink)]">{item.description}</td>
                  <td className="px-4 py-3 text-center text-[var(--color-ink-3)]">{item.qty}</td>
                  <td className="px-4 py-3 text-right font-mono text-[var(--color-ink-3)]">{fmt(item.price)}</td>
                  <td className="px-6 py-3 text-right font-mono text-[var(--color-ink)]">{fmt(item.qty * item.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="border-t border-[var(--color-line)] px-6 py-4 space-y-1.5 text-sm max-w-xs ml-auto">
            <div className="flex justify-between text-[var(--color-ink-3)]">
              <span>Subtotal</span>
              <span className="font-mono">{fmt(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-[var(--color-ink-3)]">
                <span>Discount</span>
                <span className="font-mono">−{fmt(discount)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-[var(--color-ink)] text-base border-t border-[var(--color-line)] pt-2 mt-1">
              <span>Total</span>
              <span className="font-mono">{fmt(total)}</span>
            </div>
            <div className="flex justify-between text-xs text-[var(--color-ink-3)] pt-1">
              <span>Payment</span>
              <span>{PAYMENT_LABELS[invoice.payment_method] ?? invoice.payment_method}</span>
            </div>
          </div>

          {invoice.notes && (
            <div className="border-t border-[var(--color-line)] px-6 py-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)] mb-1">Notes</p>
              <p className="text-sm text-[var(--color-ink-2)]">{invoice.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* ── PRINT-ONLY BILL (hidden on screen, shown when printing) ── */}
      <div className="print-area print-only" style={{ fontFamily: "Arial, sans-serif", fontSize: 13, color: "#000", background: "#fff" }}>

        <div style={{ textAlign: "center", padding: "6px 0", borderBottom: "1px solid #999", background: "#f3f3f3" }}>
          <strong style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: 1 }}>Tax Invoice</strong>
        </div>

        <div style={{ display: "flex", borderBottom: "1px solid #ccc" }}>
          <div style={{ flex: 1, padding: 12, borderRight: "1px solid #ccc" }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{BUSINESS_NAME}</div>
            <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{BUSINESS_ADDRESS}</div>
            <div style={{ fontSize: 11, color: "#555", marginTop: 1 }}>Contact : {BUSINESS_PHONE}</div>
            {BUSINESS_GSTIN && (
              <div style={{ fontSize: 11, fontWeight: 600, marginTop: 1 }}>GSTIN : {BUSINESS_GSTIN}</div>
            )}
          </div>
          <div style={{ minWidth: 180, display: "flex", flexDirection: "column", borderLeft: "1px solid #ccc" }}>
            {/* Bill No — prominent box */}
            <div style={{ padding: "8px 12px", borderBottom: "1px solid #ccc", background: "#f9f9f9" }}>
              <div style={{ fontSize: 10, color: "#888", textTransform: "uppercase", letterSpacing: 0.5 }}>Bill No.</div>
              <div style={{ fontWeight: 800, fontSize: 18, fontFamily: "monospace", marginTop: 2, letterSpacing: 1 }}>
                {invoice.invoice_number}
              </div>
            </div>
            <div style={{ padding: "8px 12px" }}>
              <div style={{ fontSize: 10, color: "#888", textTransform: "uppercase", letterSpacing: 0.5 }}>Date</div>
              <div style={{ fontWeight: 600, fontSize: 13, marginTop: 2 }}>{fmtDatePrint(invoice.created_at)}</div>
            </div>
          </div>
        </div>

        <div style={{ padding: 12, borderBottom: "1px solid #ccc" }}>
          <div style={{ fontSize: 10, color: "#888", textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>Bill To :</div>
          <div style={{ fontWeight: 700 }}>{invoice.customer_name}</div>
          {invoice.customer_phone && <div style={{ fontSize: 11, color: "#555" }}>Contact: {invoice.customer_phone}</div>}
          {invoice.model_text && <div style={{ fontSize: 11, color: "#555" }}>{invoice.model_text}</div>}
          {invoice.bookingRef && (
            <div style={{ fontSize: 11, marginTop: 4 }}>
              <span style={{ color: "#888" }}>Token / Tracking No.: </span>
              <strong style={{ fontFamily: "monospace", fontSize: 12 }}>{invoice.bookingRef}</strong>
            </div>
          )}
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", borderBottom: "1px solid #ccc" }}>
          <thead>
            <tr style={{ background: "#f5f5f5", fontSize: 10, textTransform: "uppercase", fontWeight: 700, borderBottom: "1px solid #ccc" }}>
              <th style={{ padding: "6px 8px", textAlign: "left", borderRight: "1px solid #ddd", width: 32 }}>S.No.</th>
              <th style={{ padding: "6px 8px", textAlign: "left", borderRight: "1px solid #ddd" }}>Particulars</th>
              <th style={{ padding: "6px 8px", textAlign: "center", borderRight: "1px solid #ddd", width: 64 }}>HSN/SAC</th>
              <th style={{ padding: "6px 8px", textAlign: "center", borderRight: "1px solid #ddd", width: 36 }}>QTY</th>
              <th style={{ padding: "6px 8px", textAlign: "right", borderRight: "1px solid #ddd", width: 80 }}>Unit Price</th>
              {BUSINESS_GSTIN && <th style={{ padding: "6px 8px", textAlign: "center", borderRight: "1px solid #ddd", width: 44 }}>GST</th>}
              <th style={{ padding: "6px 8px", textAlign: "right", width: 80 }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "6px 8px", textAlign: "center", borderRight: "1px solid #eee", color: "#777" }}>{i + 1}</td>
                <td style={{ padding: "6px 8px", borderRight: "1px solid #eee" }}>{item.description}</td>
                <td style={{ padding: "6px 8px", textAlign: "center", borderRight: "1px solid #eee", color: "#777" }}>{HSN_CODE}</td>
                <td style={{ padding: "6px 8px", textAlign: "center", borderRight: "1px solid #eee" }}>{item.qty}</td>
                <td style={{ padding: "6px 8px", textAlign: "right", borderRight: "1px solid #eee", fontFamily: "monospace" }}>{fmt(item.price)}</td>
                {BUSINESS_GSTIN && <td style={{ padding: "6px 8px", textAlign: "center", borderRight: "1px solid #eee" }}>18%</td>}
                <td style={{ padding: "6px 8px", textAlign: "right", fontFamily: "monospace" }}>{fmt(item.qty * item.price)}</td>
              </tr>
            ))}
            <tr style={{ height: 28 }}>
              <td style={{ borderRight: "1px solid #eee" }} /><td style={{ borderRight: "1px solid #eee" }} />
              <td style={{ borderRight: "1px solid #eee" }} /><td style={{ borderRight: "1px solid #eee" }} />
              <td style={{ borderRight: "1px solid #eee" }} />{BUSINESS_GSTIN && <td style={{ borderRight: "1px solid #eee" }} />}<td />
            </tr>
          </tbody>
          <tfoot>
            <tr style={{ borderTop: "1px solid #ccc", fontWeight: 700 }}>
              <td style={{ padding: "6px 8px", borderRight: "1px solid #eee" }} />
              <td style={{ padding: "6px 8px", borderRight: "1px solid #eee" }}>TOTAL</td>
              <td style={{ padding: "6px 8px", textAlign: "center", borderRight: "1px solid #eee", color: "#777" }}>{items.length}</td>
              <td style={{ borderRight: "1px solid #eee" }} /><td style={{ borderRight: "1px solid #eee" }} />
              {BUSINESS_GSTIN && <td style={{ borderRight: "1px solid #eee" }} />}
              <td style={{ padding: "6px 8px", textAlign: "right", fontFamily: "monospace" }}>{fmt(subtotal)}</td>
            </tr>
          </tfoot>
        </table>

        <div style={{ display: "flex", borderBottom: "1px solid #ccc" }}>
          <div style={{ flex: 1, borderRight: "1px solid #ccc" }} />
          <div style={{ padding: 10, minWidth: 180, fontSize: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ color: "#555" }}>Sub Total</span>
              <span style={{ fontFamily: "monospace" }}>{fmt(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ color: "#555" }}>Discount</span>
                <span style={{ fontFamily: "monospace" }}>− {fmt(discount)}</span>
              </div>
            )}
            {BUSINESS_GSTIN ? (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                  <span style={{ color: "#555" }}>CGST (9%)</span>
                  <span style={{ fontFamily: "monospace" }}>{fmt(Math.round(total * 0.09 / 1.18))}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#555" }}>SGST (9%)</span>
                  <span style={{ fontFamily: "monospace" }}>{fmt(Math.round(total * 0.09 / 1.18))}</span>
                </div>
              </>
            ) : (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#999" }}>Tax Amount (+)</span>
                <span style={{ color: "#bbb" }}>—</span>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", borderBottom: "1px solid #ccc" }}>
          <div style={{ flex: 1, padding: 12, borderRight: "1px solid #ccc" }}>
            <div style={{ fontSize: 10, color: "#888", fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>Amount in Words (To be Paid) :</div>
            <div style={{ fontWeight: 500 }}>{amountInWords(total)}</div>
          </div>
          <div style={{ padding: 12, minWidth: 180, fontSize: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
              <span>TOTAL AMOUNT</span><span style={{ fontFamily: "monospace" }}>{fmt(total)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, marginBottom: 4 }}>
              <span>AMOUNT (TO BE PAID)</span><span style={{ fontFamily: "monospace" }}>{fmt(total)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#555", marginBottom: 2 }}>
              <span>Amount Paid</span><span style={{ fontFamily: "monospace" }}>{fmt(total)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#555", borderTop: "1px solid #eee", paddingTop: 4, marginTop: 2 }}>
              <span>Balance</span><span style={{ fontFamily: "monospace" }}>₹0</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#555", marginTop: 4 }}>
              <span>Payment</span><span>{PAYMENT_LABELS[invoice.payment_method] ?? invoice.payment_method}</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", borderBottom: "1px solid #ccc" }}>
          <div style={{ flex: 1, padding: 12, borderRight: "1px solid #ccc" }}>
            <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 6 }}>Invoice Terms &amp; Conditions:</div>
            <ul style={{ fontSize: 10, color: "#555", paddingLeft: 14, margin: 0 }}>
              <li>All repairs are checked before handover.</li>
              <li>Warranty on replaced parts as per manufacturer.</li>
              <li>No liability for data loss during repair.</li>
              <li>Payment due at time of collection.</li>
              <li>All disputes subject to Patiala jurisdiction only.</li>
            </ul>
            {invoice.notes && (
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#444" }}>Notes:</div>
                <div style={{ fontSize: 10, color: "#555" }}>{invoice.notes}</div>
              </div>
            )}
          </div>
          <div style={{ padding: 12, minWidth: 180, display: "flex", flexDirection: "column", justifyContent: "space-between", textAlign: "right" }}>
            <div style={{ fontSize: 11, fontWeight: 700 }}>For, {BUSINESS_NAME}</div>
            <div>
              <div style={{ height: 40 }} />
              <div style={{ fontSize: 10, color: "#777", borderTop: "1px solid #ccc", paddingTop: 4 }}>Authorised Signatory</div>
            </div>
          </div>
        </div>

        <div style={{ padding: "8px 12px", textAlign: "center" }}>
          <span style={{ fontSize: 10, color: "#999" }}>This is a computer generated invoice and does not require signature</span>
        </div>
      </div>
    </div>
  );
}
