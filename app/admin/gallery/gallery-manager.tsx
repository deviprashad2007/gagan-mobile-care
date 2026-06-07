"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { uploadGalleryImage } from "@/lib/actions/upload-gallery-image";
import { deleteGalleryImage } from "@/lib/actions/delete-gallery-image";
import type { GalleryImage } from "@/lib/repairs";

interface Props {
  images: GalleryImage[];
}

export function GalleryManager({ images }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setUploadError("");
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setUploadError("");

    const fd = new FormData();
    fd.append("file", selectedFile);
    if (caption.trim()) fd.append("caption", caption.trim());

    const result = await uploadGalleryImage(fd);
    setUploading(false);

    if (!result.success) {
      setUploadError(result.error);
      return;
    }

    setSelectedFile(null);
    setPreview(null);
    setCaption("");
    if (fileRef.current) fileRef.current.value = "";
    router.refresh();
  };

  const handleDelete = (id: string, storagePath: string) => {
    setDeletingId(id);
    startTransition(async () => {
      await deleteGalleryImage({ id, storagePath });
      setDeletingId(null);
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Upload card */}
      <div className="bg-white border border-[var(--color-line)] rounded-2xl p-5">
        <p className="text-sm font-semibold text-[var(--color-ink)] mb-4">Add photo</p>

        {/* Drop zone */}
        <div
          onClick={() => fileRef.current?.click()}
          className="relative border-2 border-dashed border-[var(--color-line)] rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[var(--color-ink)] transition-colors"
          style={{ minHeight: preview ? "auto" : 160 }}
        >
          {preview ? (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden">
              <Image src={preview} alt="Preview" fill className="object-cover" />
            </div>
          ) : (
            <>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-ink-4)]">
                <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <p className="text-sm text-[var(--color-ink-3)]">Click to choose photo</p>
              <p className="text-xs text-[var(--color-ink-4)]">JPG, PNG, WebP — max 5 MB</p>
            </>
          )}
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleFileChange}
        />

        {selectedFile && (
          <div className="mt-3 flex flex-col gap-2">
            <input
              type="text"
              placeholder="Caption (optional)"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--color-line)] rounded-xl text-sm outline-none focus:border-[var(--color-ink)]"
            />
            <div className="flex gap-2">
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="flex-1 py-2 bg-[var(--color-ink)] text-white text-sm font-medium rounded-xl disabled:opacity-50"
              >
                {uploading ? "Uploading…" : "Upload photo"}
              </button>
              <button
                onClick={() => { setSelectedFile(null); setPreview(null); setCaption(""); if (fileRef.current) fileRef.current.value = ""; }}
                className="px-4 py-2 border border-[var(--color-line)] rounded-xl text-sm text-[var(--color-ink-3)]"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {uploadError && (
          <p className="text-xs text-red-500 mt-2">{uploadError}</p>
        )}
      </div>

      {/* Image grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((img) => (
            <div key={img.id} className="relative group rounded-xl overflow-hidden bg-[var(--color-bg-soft)] aspect-square border border-[var(--color-line)]">
              <Image
                src={img.url}
                alt={img.caption ?? "Gallery image"}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, 33vw"
              />
              {img.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1">
                  <p className="text-white text-xs truncate">{img.caption}</p>
                </div>
              )}
              <button
                onClick={() => handleDelete(img.id, img.storage_path)}
                disabled={deletingId === img.id}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-40 text-xs"
                aria-label="Delete image"
              >
                {deletingId === img.id ? "…" : "✕"}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-[var(--color-line)] rounded-2xl p-10 flex flex-col items-center gap-2 text-center">
          <p className="text-sm font-medium text-[var(--color-ink)]">No photos yet</p>
          <p className="text-xs text-[var(--color-ink-3)]">Upload photos of your shop, repairs, and team above.</p>
        </div>
      )}
    </div>
  );
}
