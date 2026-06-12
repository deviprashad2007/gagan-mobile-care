"use server";

import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import { createServiceClient } from "@/lib/supabase/service";
import { requireAdmin } from "@/lib/auth/require-admin";

const schema = z.object({ id: z.string().uuid() });

export type DeleteBrandResult = { success: true } | { success: false; error: string };

export async function deleteBrand(data: unknown): Promise<DeleteBrandResult> {
  const admin = await requireAdmin();
  if (!admin.ok) return { success: false, error: admin.error };

  const parsed = schema.safeParse(data);
  if (!parsed.success) return { success: false, error: "Invalid data." };

  const supabase = createServiceClient();
  const now = new Date().toISOString();

  const { error } = await supabase.from("brands").update({ deleted_at: now }).eq("id", parsed.data.id);
  if (error) return { success: false, error: "Failed to remove brand." };

  await supabase.from("models").update({ deleted_at: now }).eq("brand_id", parsed.data.id);

  revalidatePath("/admin/catalog");
  revalidatePath("/admin/brands");
  revalidateTag("catalog");
  return { success: true };
}
