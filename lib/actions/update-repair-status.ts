"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  id: z.string().uuid(),
  status: z.enum(["received", "working", "ready", "picked"]),
});

export type UpdateRepairResult = { success: true } | { success: false; error: string };

export async function updateRepairStatus(data: unknown): Promise<UpdateRepairResult> {
  const parsed = schema.safeParse(data);
  if (!parsed.success) return { success: false, error: "Invalid data." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized." };

  const { error } = await supabase
    .from("repairs")
    .update({
      status: parsed.data.status,
      ...(parsed.data.status === "picked"
        ? { completed_at: new Date().toISOString() }
        : {}),
    })
    .eq("id", parsed.data.id)
    .is("deleted_at", null);

  if (error) {
    console.error("updateRepairStatus:", error);
    return { success: false, error: "Update failed. Please try again." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/repairs");
  return { success: true };
}
