import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { PostEditor } from "../post-editor";
import { PageHeader } from "@/components/admin/ui/page-header";

export const metadata = { title: "Edit post" };

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const authClient = await createClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) redirect("/admin/login");

  const supabase = createServiceClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (!post) notFound();

  return (
    <div className="px-4 md:px-8 py-6 max-w-2xl mx-auto">
      <PageHeader
        title="Edit post"
        subtitle={post.published ? "This post is live on your website." : "This post is a draft — only you can see it."}
      />
      <PostEditor post={post} />
    </div>
  );
}
