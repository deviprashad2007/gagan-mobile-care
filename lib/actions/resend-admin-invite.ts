"use server";

import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/service";
import { requireAdmin } from "@/lib/auth/require-admin";
import { sendAdminInviteEmail } from "@/lib/email/send-admin-invite-email";

const schema = z.object({ email: z.string().email() });

export type ResendAdminInviteResult = { success: true } | { success: false; error: string };

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gaganmobilecare.com";

export async function resendAdminInvite(data: unknown): Promise<ResendAdminInviteResult> {
  const admin = await requireAdmin();
  if (!admin.ok) return { success: false, error: admin.error };
  if (admin.user.role !== "owner") return { success: false, error: "Only the owner can resend invites." };

  const parsed = schema.safeParse(data);
  if (!parsed.success) return { success: false, error: "Invalid email." };

  const { email } = parsed.data;

  const supabase = createServiceClient();

  const { data: target } = await supabase
    .from("admin_users")
    .select("role")
    .eq("email", email)
    .is("deleted_at", null)
    .single();
  if (!target) return { success: false, error: "User not found." };

  const redirectTo = `${siteUrl}/admin/set-password`;

  let link = await supabase.auth.admin.generateLink({
    type: "invite",
    email,
    options: { redirectTo },
  });

  if (link.error) {
    link = await supabase.auth.admin.generateLink({
      type: "recovery",
      email,
      options: { redirectTo },
    });
  }

  if (link.error || !link.data) {
    return { success: false, error: "Failed to create an invite link." };
  }

  const emailResult = await sendAdminInviteEmail(email, link.data.properties.action_link, target.role as "owner" | "staff");
  if (!emailResult.success) return { success: false, error: emailResult.error };

  return { success: true };
}
