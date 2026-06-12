import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getInvoices } from "@/lib/admin";
import type { InvoiceItem } from "@/lib/validations/invoice";

function csvCell(value: string) {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const invoices = await getInvoices();

  const header = [
    "Invoice",
    "Date",
    "Customer",
    "Phone",
    "Model",
    "Items",
    "Subtotal",
    "Discount",
    "Total",
    "Payment method",
  ];

  const rows = invoices.map((inv) => {
    const items = inv.items as unknown as InvoiceItem[];
    const itemsSummary = items.map((i) => `${i.description} x${i.qty}`).join("; ");
    return [
      inv.invoice_number,
      new Date(inv.created_at).toISOString().slice(0, 10),
      inv.customer_name,
      inv.customer_phone,
      inv.model_text ?? "",
      itemsSummary,
      String(inv.subtotal),
      String(inv.discount),
      String(inv.total),
      inv.payment_method,
    ];
  });

  const csv = [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="invoices-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
