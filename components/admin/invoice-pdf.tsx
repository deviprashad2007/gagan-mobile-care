import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { InvoiceItem } from "@/lib/validations/invoice";

Font.register({
  family: "Helvetica",
  fonts: [],
});

const ACCENT = "#E63329";

const s = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 9, color: "#111", backgroundColor: "#fff", padding: 28 },

  // Header
  headerRow: { flexDirection: "row", borderBottom: "1pt solid #aaa", paddingBottom: 8, marginBottom: 0 },
  headerLeft: { flex: 1 },
  headerRight: { width: 140, alignItems: "flex-end" },
  bizName: { fontSize: 16, fontFamily: "Helvetica-Bold", marginBottom: 2 },
  bizSub: { fontSize: 8, color: "#555", lineHeight: 1.4 },
  tagLine: { textAlign: "center", fontSize: 10, fontFamily: "Helvetica-Bold", letterSpacing: 1.5,
    textTransform: "uppercase", padding: "5pt 0", backgroundColor: "#f3f3f3",
    borderBottom: "1pt solid #bbb", marginBottom: 0 },

  // Bill No box
  billNoBox: { border: "1pt solid #bbb", width: 140, padding: 6, marginBottom: 4 },
  billNoLabel: { fontSize: 7, color: "#888", textTransform: "uppercase", letterSpacing: 0.5 },
  billNoValue: { fontSize: 16, fontFamily: "Helvetica-Bold", letterSpacing: 1, marginTop: 1 },
  dateLabel: { fontSize: 7, color: "#888", textTransform: "uppercase", letterSpacing: 0.5, marginTop: 4 },
  dateValue: { fontSize: 10, fontFamily: "Helvetica-Bold", marginTop: 1 },

  // Bill to
  billToSection: { borderBottom: "1pt solid #ccc", padding: "6pt 0" },
  billToLabel: { fontSize: 7, color: "#888", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 },
  billToName: { fontSize: 11, fontFamily: "Helvetica-Bold", marginBottom: 1 },
  billToSub: { fontSize: 8, color: "#555" },
  tokenRow: { flexDirection: "row", marginTop: 3 },
  tokenLabel: { fontSize: 8, color: "#888" },
  tokenValue: { fontSize: 8, fontFamily: "Helvetica-Bold", color: ACCENT },

  // Table
  tableHeader: { flexDirection: "row", backgroundColor: "#f5f5f5", borderTop: "1pt solid #ccc",
    borderBottom: "1pt solid #ccc", padding: "4pt 0" },
  tableRow: { flexDirection: "row", borderBottom: "0.5pt solid #eee", padding: "4pt 0", minHeight: 20 },
  tableFooter: { flexDirection: "row", borderTop: "1pt solid #ccc", borderBottom: "1pt solid #ccc",
    padding: "4pt 0", backgroundColor: "#fafafa" },
  thText: { fontSize: 7, fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 0.4, color: "#555" },
  tdText: { fontSize: 9 },
  tdMono: { fontSize: 9, fontFamily: "Helvetica-Bold" },

  colSno:  { width: 22, paddingLeft: 4 },
  colDesc: { flex: 1, paddingLeft: 4 },
  colHsn:  { width: 48, textAlign: "center" },
  colQty:  { width: 24, textAlign: "center" },
  colPrice:{ width: 58, textAlign: "right", paddingRight: 4 },
  colAmt:  { width: 62, textAlign: "right", paddingRight: 4 },

  // Subtotal / totals
  totalsRow: { flexDirection: "row", borderBottom: "1pt solid #ccc" },
  totalsLeft: { flex: 1 },
  totalsRight: { width: 180, borderLeft: "1pt solid #ccc", padding: 8 },
  totLine: { flexDirection: "row", justifyContent: "space-between", marginBottom: 3 },
  totLabel: { fontSize: 8, color: "#555" },
  totValue: { fontSize: 8, fontFamily: "Helvetica-Bold" },

  // Words / final totals
  wordsRow: { flexDirection: "row", borderBottom: "1pt solid #ccc" },
  wordsLeft: { flex: 1, padding: 8 },
  wordsLabel: { fontSize: 7, color: "#888", textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 3 },
  wordsText: { fontSize: 9, fontFamily: "Helvetica-Bold" },
  finalRight: { width: 180, borderLeft: "1pt solid #ccc", padding: 8 },
  finalLine: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  finalLabel: { fontSize: 8 },
  finalValue: { fontSize: 8, fontFamily: "Helvetica-Bold" },
  totalAmtLabel: { fontSize: 9, fontFamily: "Helvetica-Bold" },
  totalAmtValue: { fontSize: 10, fontFamily: "Helvetica-Bold" },

  // Terms / signatory
  termsRow: { flexDirection: "row", borderBottom: "1pt solid #ccc" },
  termsLeft: { flex: 1, padding: 8 },
  termsTitle: { fontSize: 8, fontFamily: "Helvetica-Bold", marginBottom: 4 },
  termsItem: { fontSize: 7, color: "#555", marginBottom: 1.5 },
  sigRight: { width: 160, borderLeft: "1pt solid #ccc", padding: 8 },
  sigFor: { fontSize: 8, fontFamily: "Helvetica-Bold" },
  sigLine: { borderTop: "0.5pt solid #aaa", marginTop: 28, paddingTop: 3 },
  sigLabel: { fontSize: 7, color: "#888" },

  footer: { textAlign: "center", fontSize: 7, color: "#aaa", marginTop: 8 },
});

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

function amountInWords(total: number) {
  const r = Math.floor(total);
  const p = Math.round((total - r) * 100);
  return numToWords(r) + " Rupees" + (p > 0 ? " and " + numToWords(p) + " Paise" : "") + " Only";
}

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export interface InvoicePDFProps {
  invoiceNumber: string;
  createdAt: string;
  customerName: string;
  customerPhone?: string | null;
  modelText?: string | null;
  bookingRef?: string | null;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: string;
  notes?: string | null;
  businessName: string;
  businessAddress: string;
  businessPhone: string;
  businessGstin?: string;
}

const PAYMENT_LABELS: Record<string, string> = {
  cash: "Cash", upi: "UPI", card: "Card", other: "Other",
};

const HSN = "9987";

export function InvoicePDF({
  invoiceNumber, createdAt, customerName, customerPhone, modelText,
  bookingRef, items, subtotal, discount, total, paymentMethod, notes,
  businessName, businessAddress, businessPhone, businessGstin,
}: InvoicePDFProps) {
  return (
    <Document title={`${invoiceNumber} · ${customerName}`} author={businessName}>
      <Page size="A4" style={s.page}>

        {/* TAX INVOICE label */}
        <View style={s.tagLine}>
          <Text>Tax Invoice</Text>
        </View>

        {/* Company + Bill No */}
        <View style={s.headerRow}>
          <View style={s.headerLeft}>
            <Text style={s.bizName}>{businessName}</Text>
            <Text style={s.bizSub}>{businessAddress}</Text>
            <Text style={s.bizSub}>Contact : {businessPhone}</Text>
            {businessGstin ? <Text style={[s.bizSub, { fontFamily: "Helvetica-Bold" }]}>GSTIN : {businessGstin}</Text> : null}
          </View>
          <View style={s.headerRight}>
            <View style={s.billNoBox}>
              <Text style={s.billNoLabel}>Bill No.</Text>
              <Text style={s.billNoValue}>{invoiceNumber}</Text>
              <Text style={s.dateLabel}>Date</Text>
              <Text style={s.dateValue}>{fmtDate(createdAt)}</Text>
            </View>
          </View>
        </View>

        {/* Bill To */}
        <View style={s.billToSection}>
          <Text style={s.billToLabel}>Bill To :</Text>
          <Text style={s.billToName}>{customerName}</Text>
          {customerPhone ? <Text style={s.billToSub}>Contact : {customerPhone}</Text> : null}
          {modelText ? <Text style={s.billToSub}>{modelText}</Text> : null}
          {bookingRef ? (
            <View style={s.tokenRow}>
              <Text style={s.tokenLabel}>Token / Tracking No. : </Text>
              <Text style={s.tokenValue}>{bookingRef}</Text>
            </View>
          ) : null}
        </View>

        {/* Items table header */}
        <View style={s.tableHeader}>
          <Text style={[s.thText, s.colSno]}>S.No.</Text>
          <Text style={[s.thText, s.colDesc]}>Particulars</Text>
          <Text style={[s.thText, s.colHsn]}>HSN/SAC</Text>
          <Text style={[s.thText, s.colQty]}>Qty</Text>
          <Text style={[s.thText, s.colPrice]}>Unit Price</Text>
          <Text style={[s.thText, s.colAmt]}>Amount</Text>
        </View>

        {/* Items */}
        {items.map((item, i) => (
          <View key={i} style={s.tableRow}>
            <Text style={[s.tdText, s.colSno, { color: "#888" }]}>{i + 1}</Text>
            <Text style={[s.tdText, s.colDesc]}>{item.description}</Text>
            <Text style={[s.tdText, s.colHsn, { color: "#888" }]}>{HSN}</Text>
            <Text style={[s.tdText, s.colQty]}>{item.qty}</Text>
            <Text style={[s.tdMono, s.colPrice]}>{fmt(item.price)}</Text>
            <Text style={[s.tdMono, s.colAmt]}>{fmt(item.qty * item.price)}</Text>
          </View>
        ))}

        {/* Table footer total row */}
        <View style={s.tableFooter}>
          <Text style={[s.thText, s.colSno]} />
          <Text style={[s.thText, s.colDesc]}>TOTAL</Text>
          <Text style={[s.thText, s.colHsn, { color: "#888" }]}>{items.length}</Text>
          <Text style={[s.thText, s.colQty]} />
          <Text style={[s.thText, s.colPrice]} />
          <Text style={[s.tdMono, s.colAmt]}>{fmt(subtotal)}</Text>
        </View>

        {/* Sub total row */}
        <View style={s.totalsRow}>
          <View style={s.totalsLeft} />
          <View style={s.totalsRight}>
            <View style={s.totLine}>
              <Text style={s.totLabel}>Sub Total</Text>
              <Text style={s.totValue}>{fmt(subtotal)}</Text>
            </View>
            {discount > 0 && (
              <View style={s.totLine}>
                <Text style={s.totLabel}>Discount</Text>
                <Text style={s.totValue}>− {fmt(discount)}</Text>
              </View>
            )}
            {businessGstin ? (
              <>
                <View style={s.totLine}>
                  <Text style={s.totLabel}>CGST (9%)</Text>
                  <Text style={s.totValue}>{fmt(Math.round(total * 0.09 / 1.18))}</Text>
                </View>
                <View style={s.totLine}>
                  <Text style={s.totLabel}>SGST (9%)</Text>
                  <Text style={s.totValue}>{fmt(Math.round(total * 0.09 / 1.18))}</Text>
                </View>
              </>
            ) : (
              <View style={s.totLine}>
                <Text style={s.totLabel}>Tax Amount (+)</Text>
                <Text style={[s.totValue, { color: "#bbb" }]}>—</Text>
              </View>
            )}
          </View>
        </View>

        {/* Amount in words + final totals */}
        <View style={s.wordsRow}>
          <View style={s.wordsLeft}>
            <Text style={s.wordsLabel}>Amount in Words (To be Paid) :</Text>
            <Text style={s.wordsText}>{amountInWords(total)}</Text>
          </View>
          <View style={s.finalRight}>
            <View style={s.finalLine}>
              <Text style={s.totalAmtLabel}>TOTAL AMOUNT</Text>
              <Text style={s.totalAmtValue}>{fmt(total)}</Text>
            </View>
            <View style={s.finalLine}>
              <Text style={s.finalLabel}>Amount Paid</Text>
              <Text style={s.finalValue}>{fmt(total)}</Text>
            </View>
            <View style={[s.finalLine, { borderTopWidth: 0.5, borderTopColor: "#ddd", paddingTop: 3, marginTop: 2 }]}>
              <Text style={s.finalLabel}>Balance</Text>
              <Text style={s.finalValue}>₹0</Text>
            </View>
            <View style={[s.finalLine, { marginTop: 4 }]}>
              <Text style={s.finalLabel}>Payment</Text>
              <Text style={s.finalValue}>{PAYMENT_LABELS[paymentMethod] ?? paymentMethod}</Text>
            </View>
          </View>
        </View>

        {/* Terms + signatory */}
        <View style={s.termsRow}>
          <View style={s.termsLeft}>
            <Text style={s.termsTitle}>Invoice Terms &amp; Conditions:</Text>
            {[
              "All repairs are checked before handover.",
              "Warranty on replaced parts as per manufacturer.",
              "No liability for data loss during repair.",
              "Payment due at time of collection.",
              "All disputes subject to Patiala jurisdiction only.",
            ].map((t, i) => <Text key={i} style={s.termsItem}>• {t}</Text>)}
            {notes ? (
              <>
                <Text style={[s.termsTitle, { marginTop: 6 }]}>Notes:</Text>
                <Text style={s.termsItem}>{notes}</Text>
              </>
            ) : null}
          </View>
          <View style={s.sigRight}>
            <Text style={s.sigFor}>For, {businessName}</Text>
            <View style={s.sigLine}>
              <Text style={s.sigLabel}>Authorised Signatory</Text>
            </View>
          </View>
        </View>

        <Text style={s.footer}>
          This is a computer generated invoice and does not require signature
        </Text>
      </Page>
    </Document>
  );
}
