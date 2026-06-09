"use server";

import { z } from "zod";
import { revalidateTag } from "next/cache";
import { createServiceClient } from "@/lib/supabase/service";
import { requireAdmin } from "@/lib/auth/require-admin";

const schema = z.object({
  name: z.string().min(1).max(60),
  icon: z.string().min(1).max(8),
  description: z.string().max(200).optional(),
});

export type CreateCategoryResult = { success: true } | { success: false; error: string };

export async function createCategory(data: unknown): Promise<CreateCategoryResult> {
  const admin = await requireAdmin();
  if (!admin.ok) return { success: false, error: admin.error };

  const parsed = schema.safeParse(data);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  const { name, icon, description } = parsed.data;
  const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const supabase = createServiceClient();
  const { data: top } = await supabase
    .from("categories")
    .select("sort_order")
    .is("deleted_at", null)
    .order("sort_order", { ascending: false })
    .limit(1)
    .single();

  const { error } = await supabase.from("categories").insert({
    name: name.trim(),
    slug,
    icon,
    description: description?.trim() || null,
    sort_order: (top?.sort_order ?? 0) + 1,
  });

  if (error) {
    if (error.code === "23505") return { success: false, error: "A category with this name already exists." };
    return { success: false, error: "Failed to create category." };
  }

  revalidateTag("catalog");
  return { success: true };
}
