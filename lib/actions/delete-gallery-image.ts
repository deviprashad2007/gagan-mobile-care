"use server";

import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/service";
import { requireAdmin } from "@/lib/auth/require-admin";
import { revalidateTag } from "next/cache";

const schema = z.object({ id: z.string().uuid(), storagePath: z.string().min(1) });

export type DeleteGalleryResult =
  | { success: true }
  | { success: false; error: string };

export async function deleteGalleryImage(data: unknown): Promise<DeleteGalleryResult> {
  const admin = await requireAdmin();
  if (!admin.ok) return { success: false, error: admin.error };

  const parsed = schema.safeParse(data);
  if (!parsed.success) return { success: false, error: "Invalid data." };

  const supabase = createServiceClient();

  await supabase
    .from("gallery_images")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", parsed.data.id);

  await supabase.storage.from("gallery").remove([parsed.data.storagePath]);

  revalidateTag("gallery");
  return { success: true };
}
