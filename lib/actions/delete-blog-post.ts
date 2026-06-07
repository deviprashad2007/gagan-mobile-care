"use server";

import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import { createServiceClient } from "@/lib/supabase/service";
import { requireAdmin } from "@/lib/auth/require-admin";

const schema = z.object({ id: z.string().uuid() });

export type DeleteBlogPostResult = { success: true } | { success: false; error: string };

export async function deleteBlogPost(data: unknown): Promise<DeleteBlogPostResult> {
  const admin = await requireAdmin();
  if (!admin.ok) return { success: false, error: admin.error };

  const parsed = schema.safeParse(data);
  if (!parsed.success) return { success: false, error: "Invalid data." };

  const supabase = createServiceClient();

  const { data: post } = await supabase
    .from("blog_posts")
    .select("cover_storage_path")
    .eq("id", parsed.data.id)
    .single();

  await supabase
    .from("blog_posts")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", parsed.data.id);

  if (post?.cover_storage_path) {
    await supabase.storage.from("gallery").remove([post.cover_storage_path]);
  }

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidateTag("blog");
  return { success: true };
}
