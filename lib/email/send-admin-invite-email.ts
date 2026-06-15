import { Resend } from "resend";
import { BUSINESS_NAME } from "@/lib/seo/business-info";

export type SendAdminInviteEmailResult = { success: true } | { success: false; error: string };

export async function sendAdminInviteEmail(to: string, actionLink: string, role: "owner" | "staff"): Promise<SendAdminInviteEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("sendAdminInviteEmail: RESEND_API_KEY not set, skipping email send");
    return { success: false, error: "Email service is not configured." };
  }

  const resend = new Resend(apiKey);

  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "Gagan Mobile Care <onboarding@resend.dev>",
      to,
      subject: `You've been added to the ${BUSINESS_NAME} admin dashboard`,
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; color: #1a1a1a;">
          <h2 style="margin-bottom: 4px;">${BUSINESS_NAME}</h2>
          <p>You've been given <strong>${role}</strong> access to the admin dashboard.</p>
          <p>Click the button below to set your password and sign in:</p>
          <p>
            <a href="${actionLink}" style="display: inline-block; background: #1a1a1a; color: #fff; font-weight: 600; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 8px;">
              Set your password
            </a>
          </p>
          <p style="margin-top: 24px; font-size: 13px; color: #777;">
            This link will sign you in and let you choose a password. If you weren't expecting this, you can ignore this email.
          </p>
        </div>
      `,
    });

    if (result.error) {
      console.error("sendAdminInviteEmail: failed to send", result.error);
      return { success: false, error: "Failed to send the invite email." };
    }
    return { success: true };
  } catch (err) {
    console.error("sendAdminInviteEmail: failed to send", err);
    return { success: false, error: "Failed to send the invite email." };
  }
}
