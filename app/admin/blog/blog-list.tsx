"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteBlogPost } from "@/lib/actions/delete-blog-post";
import type { Database } from "@/lib/supabase/types";
import { StatusPill } from "@/components/admin/ui/status-pill";
import { EmptyState } from "@/components/admin/ui/empty-state";

type Post = Database["public"]["Tables"]["blog_posts"]["Row"];

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function BlogList({ posts }: { posts: Post[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    setDeletingId(id);
    startTransition(async () => {
      await deleteBlogPost({ id });
      setDeletingId(null);
      router.refresh();
    });
  };

  if (posts.length === 0) {
    return (
      <EmptyState title="No posts yet" description="Write your first post to start showing up in Google searches." />
    );
  }

  return (
    <div className="card-surface border rounded-2xl overflow-hidden divide-y divide-[var(--color-line)]">
      {posts.map((post) => (
        <div key={post.id} className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-[var(--color-bg-soft)]">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-medium text-[var(--color-ink)] truncate">{post.title}</p>
              <StatusPill label={post.published ? "Published" : "Draft"} tone={post.published ? "success" : "neutral"} />
            </div>
            <p className="text-xs text-[var(--color-ink-3)] mt-0.5">
              {post.published ? `Published ${formatDate(post.published_at)}` : `Created ${formatDate(post.created_at)}`}
            </p>
          </div>
          <Link
            href={`/admin/blog/${post.id}`}
            className="text-xs font-medium text-[var(--color-ink)] hover:text-[var(--color-accent)] transition-colors shrink-0"
          >
            Edit
          </Link>
          <button
            onClick={() => handleDelete(post.id)}
            disabled={deletingId === post.id}
            className="text-xs text-[var(--color-ink-3)] hover:text-[var(--color-accent)] transition-colors disabled:opacity-40 shrink-0"
          >
            {deletingId === post.id ? "Deleting…" : "Delete"}
          </button>
        </div>
      ))}
    </div>
  );
}
