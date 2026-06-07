import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PostEditor } from "../post-editor";

export const metadata = { title: "New post" };

export default async function NewBlogPostPage() {
  const authClient = await createClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="px-4 md:px-8 py-6 max-w-2xl mx-auto">
      <h1 className="font-serif text-2xl md:text-3xl tracking-tight text-[var(--color-ink)] mb-1">
        New post
      </h1>
      <p className="text-sm text-[var(--color-ink-3)] mb-6">
        Write something useful — repair tips, common problems, things customers search for.
      </p>
      <PostEditor />
    </div>
  );
}
