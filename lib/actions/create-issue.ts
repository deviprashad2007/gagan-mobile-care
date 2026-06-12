"use server";

import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import { createServiceClient } from "@/lib/supabase/service";
import { requireAdmin } from "@/lib/auth/require-admin";

const schema = z.object({
  name: z.string().min(1).max(60),
  rangeMin: z.number().int().min(0),
  rangeMax: z.number().int().min(0),
});

export type CreateIssueResult = { success: true } | { success: false; error: string };

export async function createIssue(data: unknown): Promise<CreateIssueResult> {
  const admin = await requireAdmin();
  if (!admin.ok) return { success: false, error: admin.error };

  const parsed = schema.safeParse(data);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  const { name, rangeMin, rangeMax } = parsed.data;
  if (rangeMax < rangeMin) return { success: false, error: "Max price must be greater than min price." };

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const supabase = createServiceClient();

  const { data: existing } = await supabase
    .from("issues")
    .select("sort_order")
    .is("deleted_at", null)
    .order("sort_order", { ascending: false })
    .limit(1);

  const sort_order = (existing?.[0]?.sort_order ?? 0) + 1;

  const { error } = await supabase.from("issues").insert({
    name,
    slug,
    range_min: rangeMin,
    range_max: rangeMax,
    is_common: true,
    sort_order,
  });

  if (error) {
    if (error.code === "23505") return { success: false, error: "An issue with this name already exists." };
    return { success: false, error: "Failed to create issue." };
  }

  revalidatePath("/admin/catalog");
  revalidateTag("catalog");
  return { success: true };
}
