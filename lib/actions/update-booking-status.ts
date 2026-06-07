"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/require-admin";

const schema = z.object({
  id: z.string().uuid(),
  status: z.enum(["new", "called", "booked", "lost"]),
  notes: z.string().max(2000).optional(),
});

export type UpdateBookingResult = { success: true } | { success: false; error: string };

export async function updateBookingStatus(data: unknown): Promise<UpdateBookingResult> {
  const parsed = schema.safeParse(data);
  if (!parsed.success) return { success: false, error: "Invalid data." };

  const admin = await requireAdmin();
  if (!admin.ok) return { success: false, error: admin.error };

  const supabase = await createClient();

  const { error } = await supabase
    .from("bookings")
    .update({
      status: parsed.data.status,
      ...(parsed.data.notes !== undefined ? { notes: parsed.data.notes } : {}),
    })
    .eq("id", parsed.data.id)
    .is("deleted_at", null);

  if (error) {
    console.error("updateBookingStatus:", error);
    return { success: false, error: "Update failed. Please try again." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${parsed.data.id}`);
  return { success: true };
}
