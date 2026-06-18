import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createElement } from "react";
import { createClient } from "@/lib/supabase/server";
import { getInvoiceById } from "@/lib/admin";
import { BUSINESS_NAME, BUSINESS_ADDRESS, BUSINESS_PHONE, BUSINESS_GSTIN } from "@/lib/seo/business-info";
import type { InvoiceItem } from "@/lib/validations/invoice";
import { InvoicePDF } from "@/components/admin/invoice-pdf";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const invoice = await getInvoiceById(id);
  if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const items = invoice.items as unknown as InvoiceItem[];
  const filename = [invoice.invoice_number, invoice.customer_name, invoice.bookingRef]
    .filter(Boolean)
    .join("-")
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_\-]/g, "");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer: Buffer = await (renderToBuffer as any)(
    createElement(InvoicePDF, {
      invoiceNumber: invoice.invoice_number,
      createdAt: invoice.created_at,
      customerName: invoice.customer_name,
      customerPhone: invoice.customer_phone,
      modelText: invoice.model_text,
      bookingRef: invoice.bookingRef,
      items,
      subtotal: invoice.subtotal,
      discount: invoice.discount,
      total: invoice.total,
      paymentMethod: invoice.payment_method,
      notes: invoice.notes,
      businessName: BUSINESS_NAME,
      businessAddress: BUSINESS_ADDRESS,
      businessPhone: BUSINESS_PHONE,
      businessGstin: BUSINESS_GSTIN || undefined,
    })
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}.pdf"`,
      "Cache-Control": "private, no-cache",
    },
  });
}
