"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getIssueNamesMap } from "@/lib/admin";

const schema = z.object({
  bookingId: z.string().uuid(),
});

export type CreateRepairResult =
  | { success: true; repairId: string }
  | { success: false; error: string };

export async function createRepairFromBooking(data: unknown): Promise<CreateRepairResult> {
  const parsed = schema.safeParse(data);
  if (!parsed.success) return { success: false, error: "Invalid data." };

  const admin = await requireAdmin();
  if (!admin.ok) return { success: false, error: admin.error };

  const supabase = await createClient();

  const { data: booking } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", parsed.data.bookingId)
    .is("deleted_at", null)
    .single();

  if (!booking) return { success: false, error: "Booking not found." };

  const { data: existing } = await supabase
    .from("repairs")
    .select("id")
    .eq("booking_id", booking.id)
    .is("deleted_at", null)
    .maybeSingle();

  if (existing) return { success: false, error: "A repair already exists for this booking." };

  const issueNames = await getIssueNamesMap();
  const issueText =
    booking.issue_ids.map((id) => issueNames.get(id)).filter(Boolean).join(", ") || "—";

  const { data: ref, error: refError } = await supabase.rpc("generate_repair_ref");
  if (refError || !ref) {
    console.error("createRepairFromBooking: generate_repair_ref", refError);
    return { success: false, error: "Could not generate repair number. Please try again." };
  }

  const { data: repair, error } = await supabase
    .from("repairs")
    .insert({
      repair_ref: ref,
      booking_id: booking.id,
      customer_id: booking.customer_id,
      customer_name: booking.customer_name,
      customer_phone: booking.customer_phone,
      model_id: booking.model_id,
      model_text: booking.model_text,
      issue_text: issueText,
      service_type: booking.service_type,
      status: "received",
      amount: booking.confirmed_price ?? booking.estimated_price_min,
    })
    .select("id")
    .single();

  if (error || !repair) {
    console.error("createRepairFromBooking:", error);
    return { success: false, error: "Could not create repair. Please try again." };
  }

  revalidatePath("/admin/repairs");
  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${booking.id}`);
  return { success: true, repairId: repair.id };
}
