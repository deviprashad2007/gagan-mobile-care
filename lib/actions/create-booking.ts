"use server";

import { bookingSchema } from "@/lib/validations/booking";
import { createServiceClient } from "@/lib/supabase/service";
import { sendTrackingEmail } from "@/lib/email/send-tracking-email";

export type BookingResult =
  | {
      success: true;
      bookingRef: string;
      estimatedPriceMin: number;
      estimatedPriceMax: number;
    }
  | { success: false; error: string };

export async function createBooking(data: unknown): Promise<BookingResult> {
  const parsed = bookingSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Invalid form data. Please check your details." };
  }

  const {
    brandId,
    brandName,
    modelId,
    modelText,
    issueIds,
    serviceType,
    customerName,
    customerPhone,
    customerEmail,
    estimatedPriceMin,
    estimatedPriceMax,
    website,
  } = parsed.data;

  // Honeypot tripped — pretend success so the bot doesn't adapt.
  if (website) {
    return {
      success: true,
      bookingRef: "GMC-0000",
      estimatedPriceMin,
      estimatedPriceMax,
    };
  }

  const supabase = createServiceClient();

  // Rate limit: max 3 bookings per phone per 24 hours
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .eq("customer_phone", customerPhone)
    .is("deleted_at", null)
    .gte("created_at", yesterday);

  if ((count ?? 0) >= 3) {
    return {
      success: false,
      error: "Too many bookings from this number. Please wait 24 hours or call us directly.",
    };
  }

  // Generate unique booking reference via Postgres function
  const { data: bookingRef, error: refError } = await supabase.rpc(
    "generate_booking_ref"
  );
  if (refError || !bookingRef) {
    console.error("generate_booking_ref error:", refError);
    return {
      success: false,
      error: "Could not generate booking reference. Please try again.",
    };
  }

  const { error: insertError } = await supabase.from("bookings").insert({
    booking_ref: bookingRef,
    customer_name: customerName,
    customer_phone: customerPhone,
    customer_email: customerEmail || null,
    brand_id: brandId,
    brand_name: brandName,
    model_id: modelId ?? null,
    model_text: modelText,
    issue_ids: issueIds,
    service_type: serviceType,
    estimated_price_min: estimatedPriceMin,
    estimated_price_max: estimatedPriceMax,
    status: "new",
    source: "web",
  });

  if (insertError) {
    console.error("createBooking insert error:", insertError);
    return { success: false, error: "Failed to save booking. Please try again." };
  }

  if (customerEmail) {
    await sendTrackingEmail(customerEmail, customerName, bookingRef);
  }

  return {
    success: true,
    bookingRef,
    estimatedPriceMin,
    estimatedPriceMax,
  };
}
