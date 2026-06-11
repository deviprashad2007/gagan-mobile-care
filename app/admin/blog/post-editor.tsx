"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { saveBlogPost } from "@/lib/actions/save-blog-post";
import { uploadBlogCover } from "@/lib/actions/upload-blog-cover";
import type { Database } from "@/lib/supabase/types";

type Post = Database["public"]["Tables"]["blog_posts"]["Row"];

interface Props {
  post?: Post;
}

export function PostEditor({ post }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(post?.title ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [coverUrl, setCoverUrl] = useState(post?.cover_image_url ?? "");
  const [coverPath, setCoverPath] = useState(post?.cover_storage_path ?? "");
  const [uploadingCover, setUploadingCover] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    setError("");

    const fd = new FormData();
    fd.append("file", file);
    const result = await uploadBlogCover(fd);
    setUploadingCover(false);

    if (!result.success) {
      setError(result.error);
      return;
    }
    setCoverUrl(result.url);
    setCoverPath(result.storagePath);
  };

  const handleSave = async (publish: boolean) => {
    if (!title.trim()) { setError("Title is required."); return; }
    if (!content.trim()) { setError("Content is required."); return; }

    setSaving(true);
    setError("");

    const result = await saveBlogPost({
      id: post?.id,
      title: title.trim(),
      excerpt: excerpt.trim() || undefined,
      content: content.trim(),
      published: publish,
      coverImageUrl: coverUrl || undefined,
      coverStoragePath: coverPath || undefined,
    });

    setSaving(false);

    if (!result.success) {
      setError(result.error);
      return;
    }
    router.push("/admin/blog");
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Cover image */}
      <div className="card-surface border rounded-2xl p-5">
        <p className="text-sm font-semibold text-[var(--color-ink)] mb-3">Cover image</p>
        <div
          onClick={() => fileRef.current?.click()}
          className="relative border-2 border-dashed border-[var(--color-line)] rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[var(--color-ink)] transition-colors overflow-hidden"
          style={{ minHeight: coverUrl ? "auto" : 140 }}
        >
          {coverUrl ? (
            <div className="relative w-full aspect-[2/1]">
              <Image src={coverUrl} alt="Cover preview" fill className="object-cover" />
            </div>
          ) : uploadingCover ? (
            <p className="text-sm text-[var(--color-ink-3)]">Uploading…</p>
          ) : (
            <>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-ink-4)]">
                <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <p className="text-sm text-[var(--color-ink-3)]">Click to choose cover image</p>
            </>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleCoverChange}
        />
      </div>

      {/* Title */}
      <div className="card-surface border rounded-2xl p-5">
        <label className="text-sm font-semibold text-[var(--color-ink)] mb-2 block">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. 5 signs your phone battery needs replacing"
          className="w-full px-3 py-2 border border-[var(--color-line)] rounded-xl text-sm outline-none focus:border-[var(--color-ink)]"
        />
      </div>

      {/* Excerpt */}
      <div className="card-surface border rounded-2xl p-5">
        <label className="text-sm font-semibold text-[var(--color-ink)] mb-2 block">
          Short summary <span className="font-normal text-[var(--color-ink-3)]">(shown in search results & post list)</span>
        </label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          maxLength={300}
          placeholder="One or two sentences summarising the post"
          className="w-full px-3 py-2 border border-[var(--color-line)] rounded-xl text-sm outline-none focus:border-[var(--color-ink)] resize-none"
        />
      </div>

      {/* Content */}
      <div className="card-surface border rounded-2xl p-5">
        <label className="text-sm font-semibold text-[var(--color-ink)] mb-2 block">
          Content <span className="font-normal text-[var(--color-ink-3)]">(leave a blank line between paragraphs)</span>
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={16}
          placeholder={"Write your post here.\n\nLeave a blank line to start a new paragraph."}
          className="w-full px-3 py-2 border border-[var(--color-line)] rounded-xl text-sm outline-none focus:border-[var(--color-ink)] resize-y font-mono leading-relaxed"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => handleSave(true)}
          disabled={saving || uploadingCover}
          className="flex-1 py-3 bg-[var(--color-ink)] text-[var(--color-bg)] text-sm font-medium rounded-xl disabled:opacity-50"
        >
          {saving ? "Saving…" : post?.published ? "Save changes" : "Publish post"}
        </button>
        <button
          onClick={() => handleSave(false)}
          disabled={saving || uploadingCover}
          className="px-5 py-3 border border-[var(--color-line)] text-[var(--color-ink-3)] text-sm font-medium rounded-xl disabled:opacity-50 transition-colors hover:border-[var(--color-ink-3)] hover:text-[var(--color-ink)]"
        >
          Save as draft
        </button>
      </div>
    </div>
  );
}
