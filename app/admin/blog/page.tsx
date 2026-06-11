import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { BlogList } from "./blog-list";

export const metadata = { title: "Blog" };

export default async function AdminBlogPage() {
  const authClient = await createClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) redirect("/admin/login");

  const supabase = createServiceClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  return (
    <div className="px-4 md:px-8 py-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-serif text-2xl md:text-3xl tracking-tight text-[var(--color-ink)]">
          Blog
        </h1>
        <Link
          href="/admin/blog/new"
          className="px-4 py-2 bg-[var(--color-ink)] text-[var(--color-bg)] text-sm font-medium rounded-xl"
        >
          + New post
        </Link>
      </div>
      <p className="text-sm text-[var(--color-ink-3)] mb-6">
        Posts here help customers find you on Google and AI search engines.
      </p>
      <BlogList posts={posts ?? []} />
    </div>
  );
}
