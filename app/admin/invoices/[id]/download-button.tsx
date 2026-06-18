"use client";

export function DownloadButton({ invoiceId }: { invoiceId: string }) {
  return (
    <a
      href={`/api/invoice/${invoiceId}`}
      download
      className="inline-flex items-center gap-1.5 text-sm font-medium bg-[var(--color-accent)] text-white rounded-full px-4 py-2 hover:opacity-90 transition-opacity"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      Download PDF
    </a>
  );
}
