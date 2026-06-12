import { Resend } from "resend";
import { BUSINESS_NAME, BUSINESS_PHONE } from "@/lib/seo/business-info";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gaganmobilecare.com";

export async function sendTrackingEmail(to: string, customerName: string, bookingRef: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("sendTrackingEmail: RESEND_API_KEY not set, skipping email send");
    return;
  }

  const resend = new Resend(apiKey);
  const trackUrl = `${siteUrl}/track?ref=${encodeURIComponent(bookingRef)}`;
  const firstName = customerName.split(" ")[0];

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "Gagan Mobile Care <onboarding@resend.dev>",
      to,
      subject: `Your repair tracking code: ${bookingRef}`,
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; color: #1a1a1a;">
          <h2 style="margin-bottom: 4px;">${BUSINESS_NAME}</h2>
          <p>Hi ${firstName},</p>
          <p>Thanks for booking a repair with us. Your tracking code is:</p>
          <p style="font-size: 22px; font-weight: 700; letter-spacing: 1px; background: #f4f4f4; padding: 12px 16px; border-radius: 8px; display: inline-block;">
            ${bookingRef}
          </p>
          <p>Use this code to check your repair status anytime:</p>
          <p><a href="${trackUrl}" style="color: #1a1a1a; font-weight: 600;">${trackUrl}</a></p>
          <p>We'll call you within 15 minutes to confirm details and price.</p>
          <p style="margin-top: 24px; font-size: 13px; color: #777;">
            Questions? Call us at ${BUSINESS_PHONE}.
          </p>
        </div>
      `,
    });
  } catch (err) {
    console.error("sendTrackingEmail: failed to send", err);
  }
}
