"use server";

import { createServiceClient } from "@/lib/supabase/service";
import { requireAdmin } from "@/lib/auth/require-admin";

export type UploadBlogCoverResult =
  | { success: true; url: string; storagePath: string }
  | { success: false; error: string };

export async function uploadBlogCover(formData: FormData): Promise<UploadBlogCoverResult> {
  const admin = await requireAdmin();
  if (!admin.ok) return { success: false, error: admin.error };

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) return { success: false, error: "No file provided." };
  if (file.size > 5 * 1024 * 1024) return { success: false, error: "File too large. Max 5 MB." };

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const filename = `covers/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const bytes = new Uint8Array(await file.arrayBuffer());
  const supabase = createServiceClient();

  const { error: storageError } = await supabase.storage
    .from("gallery")
    .upload(filename, bytes, { contentType: file.type, upsert: false });

  if (storageError) return { success: false, error: "Upload failed. Try again." };

  const { data: { publicUrl } } = supabase.storage.from("gallery").getPublicUrl(filename);

  return { success: true, url: publicUrl, storagePath: filename };
}
