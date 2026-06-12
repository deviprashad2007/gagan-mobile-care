"use client";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-1.5 text-sm font-medium bg-[var(--color-ink)] text-[var(--color-bg)] rounded-full px-4 py-2 hover:opacity-90 transition-opacity"
    >
      Print
    </button>
  );
}
