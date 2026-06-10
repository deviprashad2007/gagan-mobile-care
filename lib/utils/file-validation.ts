// Maps allowed image MIME types to a safe, fixed file extension.
// Never derive storage-path extensions from user-supplied file names —
// always look them up here so an attacker can't inject "/" or ".." via file.name.
export const IMAGE_MIME_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export function extensionForMimeType(mimeType: string): string | null {
  return IMAGE_MIME_EXTENSIONS[mimeType] ?? null;
}
