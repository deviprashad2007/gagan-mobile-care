"use server";

import { createServiceClient } from "@/lib/supabase/service";
import { requireAdmin } from "@/lib/auth/require-admin";
import { revalidateTag } from "next/cache";

export type UploadGalleryResult =
  | { success: true }
  | { success: false; error: string };

export async function uploadGalleryImage(
  formData: FormData
): Promise<UploadGalleryResult> {
  const admin = await requireAdmin();
  if (!admin.ok) return { success: false, error: admin.error };

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) return { success: false, error: "No file provided." };
  if (file.size > 5 * 1024 * 1024) return { success: false, error: "File too large. Max 5 MB." };

  const caption = (formData.get("caption") as string | null)?.trim() || null;

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const bytes = new Uint8Array(await file.arrayBuffer());
  const supabase = createServiceClient();

  const { error: storageError } = await supabase.storage
    .from("gallery")
    .upload(filename, bytes, { contentType: file.type, upsert: false });

  if (storageError) return { success: false, error: "Upload failed. Try again." };

  const { data: { publicUrl } } = supabase.storage
    .from("gallery")
    .getPublicUrl(filename);

  const { data: last } = await supabase
    .from("gallery_images")
    .select("sort_order")
    .is("deleted_at", null)
    .order("sort_order", { ascending: false })
    .limit(1);

  const sort_order = (last?.[0]?.sort_order ?? 0) + 1;

  const { error: dbError } = await supabase.from("gallery_images").insert({
    url: publicUrl,
    storage_path: filename,
    caption,
    sort_order,
  });

  if (dbError) {
    await supabase.storage.from("gallery").remove([filename]);
    return { success: false, error: "Failed to save image." };
  }

  revalidateTag("gallery");
  return { success: true };
}
