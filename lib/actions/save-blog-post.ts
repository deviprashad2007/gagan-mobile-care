"use server";

import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import { createServiceClient } from "@/lib/supabase/service";
import { requireAdmin } from "@/lib/auth/require-admin";

const schema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1).max(150),
  excerpt: z.string().max(300).optional(),
  content: z.string().min(1).max(20000),
  published: z.boolean(),
  coverImageUrl: z.string().optional(),
  coverStoragePath: z.string().optional(),
});

export type SaveBlogPostResult =
  | { success: true; slug: string }
  | { success: false; error: string };

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function saveBlogPost(data: unknown): Promise<SaveBlogPostResult> {
  const admin = await requireAdmin();
  if (!admin.ok) return { success: false, error: admin.error };

  const parsed = schema.safeParse(data);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  const { id, title, excerpt, content, published, coverImageUrl, coverStoragePath } = parsed.data;
  const supabase = createServiceClient();
  const slug = slugify(title);

  // Preserve the original publish date — only stamp it the first time a post goes live
  let published_at: string | null = null;
  if (published) {
    if (id) {
      const { data: existing } = await supabase
        .from("blog_posts")
        .select("published_at")
        .eq("id", id)
        .single();
      published_at = existing?.published_at ?? new Date().toISOString();
    } else {
      published_at = new Date().toISOString();
    }
  }

  const payload = {
    title,
    slug,
    excerpt: excerpt || null,
    content,
    cover_image_url: coverImageUrl || null,
    cover_storage_path: coverStoragePath || null,
    published,
    published_at,
  };

  const { error } = id
    ? await supabase.from("blog_posts").update(payload).eq("id", id)
    : await supabase.from("blog_posts").insert(payload);

  if (error) {
    if (error.code === "23505") return { success: false, error: "A post with this title already exists." };
    return { success: false, error: "Failed to save post." };
  }

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidateTag("blog");
  return { success: true, slug };
}
