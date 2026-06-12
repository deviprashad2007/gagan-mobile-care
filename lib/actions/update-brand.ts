"use server";

import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import { createServiceClient } from "@/lib/supabase/service";
import { requireAdmin } from "@/lib/auth/require-admin";

const schema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(50),
  tone: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  category_id: z.string().uuid().optional(),
});

export type UpdateBrandResult = { success: true } | { success: false; error: string };

export async function updateBrand(data: unknown): Promise<UpdateBrandResult> {
  const admin = await requireAdmin();
  if (!admin.ok) return { success: false, error: admin.error };

  const parsed = schema.safeParse(data);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  const { id, name, tone, category_id } = parsed.data;
  const glyph = name.trim().slice(0, 2).toUpperCase();

  const supabase = createServiceClient();

  const { error } = await supabase
    .from("brands")
    .update({ name, glyph, tone, category_id: category_id ?? null })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") return { success: false, error: "A brand with this name already exists." };
    return { success: false, error: "Failed to update brand." };
  }

  revalidatePath("/admin/catalog");
  revalidatePath("/admin/brands");
  revalidateTag("catalog");
  return { success: true };
}
