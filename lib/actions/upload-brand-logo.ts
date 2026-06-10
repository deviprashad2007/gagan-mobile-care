"use server";

import { revalidateTag } from "next/cache";
import { createServiceClient } from "@/lib/supabase/service";
import { requireAdmin } from "@/lib/auth/require-admin";
import { extensionForMimeType } from "@/lib/utils/file-validation";

const MAX_BYTES = 2 * 1024 * 1024;

export type UploadLogoResult = { success: true; url: string } | { success: false; error: string };

export async function uploadBrandLogo(brandId: string, formData: FormData): Promise<UploadLogoResult> {
  const admin = await requireAdmin();
  if (!admin.ok) return { success: false, error: admin.error };

  const file = formData.get("logo");
  if (!(file instanceof File) || file.size === 0) return { success: false, error: "No file selected." };
  if (file.size > MAX_BYTES) return { success: false, error: "File too large — max 2 MB." };

  const ext = extensionForMimeType(file.type);
  if (!ext) return { success: false, error: "Only JPEG, PNG or WebP images accepted." };

  const path = `brands/${brandId}.${ext}`;

  const supabase = createServiceClient();
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from("brand-logos")
    .upload(path, buffer, { contentType: file.type, upsert: true });

  if (uploadError) return { success: false, error: uploadError.message };

  const { data: { publicUrl } } = supabase.storage.from("brand-logos").getPublicUrl(path);

  const { error: updateError } = await supabase
    .from("brands")
    .update({ logo_url: publicUrl, logo_storage_path: path })
    .eq("id", brandId);

  if (updateError) return { success: false, error: updateError.message };

  revalidateTag("catalog");
  return { success: true, url: publicUrl };
}
