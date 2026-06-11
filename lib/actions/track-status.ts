"use server";

import { trackStatusSchema } from "@/lib/validations/track-status";
import { createServiceClient } from "@/lib/supabase/service";

export interface TrackedItem {
  ref: string;
  brand: string | null;
  model: string | null;
  problem: string;
  serviceType: "walkin" | "post";
  createdAt: string;
  statusLabel: string;
  statusDescription: string;
  amount: number | null;
}

export type TrackResult =
  | { success: true; items: TrackedItem[] }
  | { success: false; error: string };

const BOOKING_STATUS_INFO: Record<string, { label: string; description: string }> = {
  new: { label: "Received", description: "We've got your booking — we'll call you shortly to confirm details and a price." },
  called: { label: "Contacted", description: "We've called you to confirm the details and price." },
  booked: { label: "Confirmed", description: "Your booking is confirmed. Bring your phone in or send it by post." },
  lost: { label: "Cancelled", description: "This booking was cancelled." },
};

const REPAIR_STATUS_INFO: Record<string, { label: string; description: string }> = {
  received: { label: "Received at shop", description: "Your phone has arrived at our workshop and is in the queue." },
  working: { label: "Being repaired", description: "Our technician is working on your phone right now." },
  ready: { label: "Ready for pickup!", description: "Your phone is fixed and ready to collect." },
  picked: { label: "Completed", description: "This repair is complete and the phone has been picked up." },
};

export async function trackStatus(data: unknown): Promise<TrackResult> {
  const parsed = trackStatusSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { query, website } = parsed.data;

  // Honeypot tripped — pretend nothing was found.
  if (website) {
    return { success: false, error: "No booking found. Check your code or phone number and try again." };
  }

  const trimmed = query.trim();
  const isPhone = /^\d{10}$/.test(trimmed);
  const isRef = /^[a-zA-Z]{2,5}-?[a-zA-Z0-9]{3,8}$/.test(trimmed);

  if (!isPhone && !isRef) {
    return { success: false, error: "Enter a valid booking code (e.g. GMC-1A2B3) or 10-digit mobile number." };
  }

  const supabase = createServiceClient();

  let bookingsQuery = supabase
    .from("bookings")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(5);

  if (isPhone) {
    bookingsQuery = bookingsQuery.eq("customer_phone", trimmed);
  } else {
    const ref = trimmed.toUpperCase().replace(/\s+/g, "");
    bookingsQuery = bookingsQuery.eq("booking_ref", ref);
  }

  const { data: bookings } = await bookingsQuery;

  if (!bookings || bookings.length === 0) {
    return { success: false, error: "No booking found. Check your code or phone number and try again." };
  }

  const [{ data: issues }, { data: repairs }] = await Promise.all([
    supabase.from("issues").select("id, name"),
    supabase
      .from("repairs")
      .select("*")
      .in("booking_id", bookings.map((b) => b.id))
      .is("deleted_at", null),
  ]);

  const issueMap = new Map((issues ?? []).map((i) => [i.id, i.name]));
  const repairByBooking = new Map((repairs ?? []).map((r) => [r.booking_id, r]));

  const items: TrackedItem[] = bookings.map((b) => {
    const problem = b.issue_ids.map((id) => issueMap.get(id)).filter(Boolean).join(", ") || "—";
    const repair = repairByBooking.get(b.id);

    if (repair) {
      const info = REPAIR_STATUS_INFO[repair.status] ?? REPAIR_STATUS_INFO.received;
      return {
        ref: b.booking_ref,
        brand: b.brand_name,
        model: b.model_text,
        problem,
        serviceType: b.service_type as "walkin" | "post",
        createdAt: b.created_at,
        statusLabel: info.label,
        statusDescription: info.description,
        amount: repair.amount,
      };
    }

    const info = BOOKING_STATUS_INFO[b.status] ?? BOOKING_STATUS_INFO.new;
    return {
      ref: b.booking_ref,
      brand: b.brand_name,
      model: b.model_text,
      problem,
      serviceType: b.service_type as "walkin" | "post",
      createdAt: b.created_at,
      statusLabel: info.label,
      statusDescription: info.description,
      amount: b.confirmed_price ?? b.estimated_price_min,
    };
  });

  return { success: true, items };
}
