"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/service";
import { requireAdmin } from "@/lib/auth/require-admin";
import { sendAdminInviteEmail } from "@/lib/email/send-admin-invite-email";

const schema = z.object({
  email: z.string().email(),
  role: z.enum(["owner", "staff"]),
});

export type AddAdminUserResult = { success: true } | { success: false; error: string };

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gaganmobilecare.com";

export async function addAdminUser(data: unknown): Promise<AddAdminUserResult> {
  const admin = await requireAdmin();
  if (!admin.ok) return { success: false, error: admin.error };
  if (admin.user.role !== "owner") return { success: false, error: "Only the owner can add users." };

  const parsed = schema.safeParse(data);
  if (!parsed.success) return { success: false, error: "Invalid email address or role." };

  const { email, role } = parsed.data;
  if (email === admin.user.email) return { success: false, error: "You are already an admin." };

  const supabase = createServiceClient();

  const { data: existing } = await supabase
    .from("admin_users")
    .select("id")
    .eq("email", email)
    .is("deleted_at", null)
    .maybeSingle();
  if (existing) return { success: false, error: "This email already has access." };

  const redirectTo = `${siteUrl}/admin/set-password`;

  let link = await supabase.auth.admin.generateLink({
    type: "invite",
    email,
    options: { redirectTo },
  });

  if (link.error) {
    // Account already exists in Supabase Auth (e.g. previously removed user) — send a reset link instead.
    link = await supabase.auth.admin.generateLink({
      type: "recovery",
      email,
      options: { redirectTo },
    });
  }

  if (link.error || !link.data) {
    console.error("addAdminUser: generateLink error:", link.error);
    return { success: false, error: "Failed to create the user's account." };
  }

  const { error } = await supabase
    .from("admin_users")
    .insert({ email, role, invited_by: admin.user.email });

  if (error) {
    if (error.code === "23505") return { success: false, error: "This email already has access." };
    return { success: false, error: "Failed to add user." };
  }

  await sendAdminInviteEmail(email, link.data.properties.action_link, role);

  revalidatePath("/admin/users");
  return { success: true };
}
