import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PostEditor } from "../post-editor";
import { PageHeader } from "@/components/admin/ui/page-header";

export const metadata = { title: "New post" };

export default async function NewBlogPostPage() {
  const authClient = await createClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="px-4 md:px-8 py-6 max-w-2xl mx-auto">
      <PageHeader title="New post" subtitle="Write something useful — repair tips, common problems, things customers search for." />
      <PostEditor />
    </div>
  );
}
