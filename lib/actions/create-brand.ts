"use server";

import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import { createServiceClient } from "@/lib/supabase/service";
import { requireAdmin } from "@/lib/auth/require-admin";

const schema = z.object({
  name: z.string().min(1).max(50),
  glyph: z.string().min(1).max(4),
  tone: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  category_id: z.string().uuid().optional(),
});

export type CreateBrandResult = { success: true } | { success: false; error: string };

export async function createBrand(data: unknown): Promise<CreateBrandResult> {
  const admin = await requireAdmin();
  if (!admin.ok) return { success: false, error: admin.error };

  const parsed = schema.safeParse(data);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  const { name, glyph, tone, category_id } = parsed.data;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const supabase = createServiceClient();

  const { data: existing } = await supabase
    .from("brands")
    .select("sort_order")
    .is("deleted_at", null)
    .order("sort_order", { ascending: false })
    .limit(1);

  const sort_order = (existing?.[0]?.sort_order ?? 0) + 1;

  const { error } = await supabase.from("brands").insert({ name, glyph, tone, slug, sort_order, category_id: category_id ?? null });
  if (error) {
    if (error.code === "23505") return { success: false, error: "A brand with this name already exists." };
    return { success: false, error: "Failed to create brand." };
  }

  revalidatePath("/admin/catalog");
  revalidateTag("catalog");
  return { success: true };
}
