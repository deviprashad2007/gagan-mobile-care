"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/service";
import { requireAdmin } from "@/lib/auth/require-admin";

const schema = z.object({ id: z.string().uuid() });

export type DeleteInvoiceResult = { success: true } | { success: false; error: string };

export async function deleteInvoice(data: unknown): Promise<DeleteInvoiceResult> {
  const admin = await requireAdmin();
  if (!admin.ok) return { success: false, error: admin.error };

  const parsed = schema.safeParse(data);
  if (!parsed.success) return { success: false, error: "Invalid data." };

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("invoices")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", parsed.data.id);

  if (error) return { success: false, error: "Failed to delete invoice." };

  revalidatePath("/admin/invoices");
  revalidatePath("/admin/earnings");
  return { success: true };
}
