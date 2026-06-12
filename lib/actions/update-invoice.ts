"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/service";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createInvoiceSchema } from "@/lib/validations/invoice";

const schema = z.object({
  id: z.string().uuid(),
  data: createInvoiceSchema,
});

export type UpdateInvoiceResult = { success: true } | { success: false; error: string };

export async function updateInvoice(input: unknown): Promise<UpdateInvoiceResult> {
  const admin = await requireAdmin();
  if (!admin.ok) return { success: false, error: admin.error };

  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data." };
  }

  const { id, data } = parsed.data;
  const { customerName, customerPhone, modelText, items, discount, paymentMethod, notes } = data;

  const subtotal = items.reduce((sum, item) => sum + item.qty * item.price, 0);
  const total = Math.max(subtotal - discount, 0);

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("invoices")
    .update({
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
    .eq("id", id);

  if (error) {
    console.error("updateInvoice:", error);
    return { success: false, error: "Could not update invoice. Please try again." };
  }

  revalidatePath("/admin/invoices");
  revalidatePath(`/admin/invoices/${id}`);
  revalidatePath("/admin/earnings");
  return { success: true };
}
