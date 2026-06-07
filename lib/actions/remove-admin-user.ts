"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/service";
import { requireAdmin } from "@/lib/auth/require-admin";

const schema = z.object({ email: z.string().email() });

export type RemoveAdminUserResult = { success: true } | { success: false; error: string };

export async function removeAdminUser(data: unknown): Promise<RemoveAdminUserResult> {
  const admin = await requireAdmin();
  if (!admin.ok) return { success: false, error: admin.error };
  if (admin.user.role !== "owner") return { success: false, error: "Only the owner can remove users." };

  const parsed = schema.safeParse(data);
  if (!parsed.success) return { success: false, error: "Invalid email." };

  if (parsed.data.email === admin.user.email) return { success: false, error: "Cannot remove your own owner account." };

  const supabase = createServiceClient();

  // Cannot remove another owner
  const { data: target } = await supabase
    .from("admin_users")
    .select("role")
    .eq("email", parsed.data.email)
    .is("deleted_at", null)
    .single();
  if (target?.role === "owner") return { success: false, error: "Cannot remove another owner." };

  const { error } = await supabase
    .from("admin_users")
    .update({ deleted_at: new Date().toISOString() })
    .eq("email", parsed.data.email)
    .is("deleted_at", null);

  if (error) return { success: false, error: "Failed to remove user." };

  revalidatePath("/admin/users");
  return { success: true };
}
