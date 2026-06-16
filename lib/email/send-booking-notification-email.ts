import { Resend } from "resend";
import { BUSINESS_NAME } from "@/lib/seo/business-info";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gaganmobilecare.com";

export async function sendBookingNotificationEmail(booking: {
  bookingRef: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  brandName: string;
  modelText: string;
  issueIds: string[];
  issueNames: string[];
  serviceType: string;
  estimatedPriceMin: number;
  estimatedPriceMax: number;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const ownerEmail = process.env.OWNER_NOTIFICATION_EMAIL;

  if (!apiKey) {
    console.warn("sendBookingNotificationEmail: RESEND_API_KEY not set, skipping");
    return;
  }
  if (!ownerEmail) {
    console.warn("sendBookingNotificationEmail: OWNER_NOTIFICATION_EMAIL not set, skipping");
    return;
  }

  const resend = new Resend(apiKey);
  const adminUrl = `${siteUrl}/admin/bookings`;
  const serviceLabel = booking.serviceType === "walkin" ? "Walk-in" : "Speed Post";
  const estimate =
    booking.estimatedPriceMin === booking.estimatedPriceMax
      ? `₹${booking.estimatedPriceMin.toLocaleString("en-IN")}`
      : `₹${booking.estimatedPriceMin.toLocaleString("en-IN")} – ₹${booking.estimatedPriceMax.toLocaleString("en-IN")}`;

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? `${BUSINESS_NAME} <onboarding@resend.dev>`,
      to: ownerEmail,
      subject: `New booking ${booking.bookingRef} — ${booking.customerName} (${booking.brandName})`,
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 520px; margin: 0 auto; color: #1a1a1a;">
          <h2 style="margin-bottom: 4px; color: #E63329;">New Repair Booking</h2>
          <p style="color: #555; font-size: 13px; margin-top: 0;">Ref: <strong>${booking.bookingRef}</strong></p>

          <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin: 16px 0;">
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 8px 0; color: #777; width: 140px;">Customer</td>
              <td style="padding: 8px 0; font-weight: 600;">${booking.customerName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 8px 0; color: #777;">Phone</td>
              <td style="padding: 8px 0;"><a href="tel:${booking.customerPhone}" style="color: #1a1a1a; font-weight: 600;">${booking.customerPhone}</a></td>
            </tr>
            ${booking.customerEmail ? `
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 8px 0; color: #777;">Email</td>
              <td style="padding: 8px 0;">${booking.customerEmail}</td>
            </tr>` : ""}
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 8px 0; color: #777;">Device</td>
              <td style="padding: 8px 0;">${booking.brandName} ${booking.modelText}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 8px 0; color: #777;">Issues</td>
              <td style="padding: 8px 0;">${booking.issueNames.length > 0 ? booking.issueNames.join(", ") : booking.issueIds.join(", ")}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 8px 0; color: #777;">Service</td>
              <td style="padding: 8px 0;">${serviceLabel}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #777;">Estimate</td>
              <td style="padding: 8px 0; font-weight: 600;">${estimate}</td>
            </tr>
          </table>

          <a href="${adminUrl}" style="display: inline-block; background: #E63329; color: white; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; font-size: 14px; margin-top: 8px;">
            View in Admin →
          </a>

          <p style="margin-top: 24px; font-size: 12px; color: #aaa;">
            Call the customer back within 15 minutes to confirm details.
          </p>
        </div>
      `,
    });
  } catch (err) {
    console.error("sendBookingNotificationEmail: failed to send", err);
  }
}
