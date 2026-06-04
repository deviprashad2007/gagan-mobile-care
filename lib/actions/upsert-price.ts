"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

const schema = z.object({
  modelId: z.string().uuid(),
  issueId: z.string().uuid(),
  price: z.number().int().min(0).max(999999),
});

export type UpsertPriceResult = { success: true } | { success: false; error: string };

export async function upsertPrice(data: unknown): Promise<UpsertPriceResult> {
  const parsed = schema.safeParse(data);
  if (!parsed.success) return { success: false, error: "Invalid price data." };

  const authClient = await createClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized." };

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
  return { success: true };
}
