"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/service";
import { requireAdmin } from "@/lib/auth/require-admin";

const schema = z.object({ email: z.string().email() });

export type AddAdminUserResult = { success: true } | { success: false; error: string };

export async function addAdminUser(data: unknown): Promise<AddAdminUserResult> {
  const admin = await requireAdmin();
  if (!admin.ok) return { success: false, error: admin.error };
  if (admin.user.role !== "owner") return { success: false, error: "Only the owner can add users." };

  const parsed = schema.safeParse(data);
  if (!parsed.success) return { success: false, error: "Invalid email address." };

  const { email } = parsed.data;
  if (email === admin.user.email) return { success: false, error: "You are already an admin." };

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("admin_users")
    .insert({ email, role: "staff", invited_by: admin.user.email });

  if (error) {
    if (error.code === "23505") return { success: false, error: "This email already has access." };
    return { success: false, error: "Failed to add user." };
  }

  revalidatePath("/admin/users");
  return { success: true };
}
