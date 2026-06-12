"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createInvoiceSchema } from "@/lib/validations/invoice";

export type CreateInvoiceResult =
  | { success: true; id: string }
  | { success: false; error: string };

export async function createInvoice(data: unknown): Promise<CreateInvoiceResult> {
  const parsed = createInvoiceSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data." };
  }

  const admin = await requireAdmin();
  if (!admin.ok) return { success: false, error: admin.error };

  const { repairId, customerName, customerPhone, modelText, items, discount, paymentMethod, notes } =
    parsed.data;

  const subtotal = items.reduce((sum, item) => sum + item.qty * item.price, 0);
  const total = Math.max(subtotal - discount, 0);

  const supabase = await createClient();

  const { data: ref, error: refError } = await supabase.rpc("generate_invoice_ref");
  if (refError || !ref) {
    console.error("createInvoice: generate_invoice_ref", refError);
    return { success: false, error: "Could not generate invoice number. Please try again." };
  }

  const { data: invoice, error } = await supabase
    .from("invoices")
    .insert({
      invoice_number: ref,
      repair_id: repairId ?? null,
      customer_name: customerName,
      customer_phone: customerPhone || null,
      model_text: modelText ?? null,
      items,
      subtotal,
      discount,
      total,
      payment_method: paymentMethod,
      notes: notes ?? null,
    })
    .select("id")
    .single();

  if (error || !invoice) {
    console.error("createInvoice:", error);
    return { success: false, error: "Could not create invoice. Please try again." };
  }

  revalidatePath("/admin/invoices");
  revalidatePath("/admin/repairs");
  return { success: true, id: invoice.id };
}
