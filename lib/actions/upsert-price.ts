"use server";

import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import { createServiceClient } from "@/lib/supabase/service";
import { requireAdmin } from "@/lib/auth/require-admin";

const schema = z.object({
  modelId: z.string().uuid(),
  issueId: z.string().uuid(),
  price: z.number().int().min(0).max(999999),
});

export type UpsertPriceResult = { success: true } | { success: false; error: string };

export async function upsertPrice(data: unknown): Promise<UpsertPriceResult> {
  const parsed = schema.safeParse(data);
  if (!parsed.success) return { success: false, error: "Invalid price data." };

  const admin = await requireAdmin();
  if (!admin.ok) return { success: false, error: admin.error };

  const { modelId, issueId, price } = parsed.data;
  const supabase = createServiceClient();

  // Soft-delete any existing price for this model+issue
  await supabase
    .from("prices")
    .update({ deleted_at: new Date().toISOString() })
    .eq("model_id", modelId)
    .eq("issue_id", issueId)
    .is("deleted_at", null);

  // Insert new price
  const { error } = await supabase.from("prices").insert({
    model_id: modelId,
    issue_id: issueId,
    price,
  });

  if (error) {
    console.error("upsertPrice:", error);
    return { success: false, error: "Failed to save price." };
  }

  revalidatePath("/admin/catalog");
  revalidateTag("catalog");
  return { success: true };
}
