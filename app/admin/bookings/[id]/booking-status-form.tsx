"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Booking } from "@/lib/admin";
import { updateBookingStatus } from "@/lib/actions/update-booking-status";
import { InlineAlert } from "@/components/admin/ui/inline-alert";
import type { StatusTone } from "@/components/admin/ui/status-pill";

const STATUSES: { id: string; label: string; tone: StatusTone }[] = [
  { id: "new", label: "New", tone: "accent" },
  { id: "called", label: "Called", tone: "info" },
  { id: "booked", label: "Booked", tone: "success" },
  { id: "lost", label: "Lost", tone: "neutral" },
];

const TONE_STYLES: Record<StatusTone, { bg: string; fg: string; border: string }> = {
  accent: { bg: "var(--color-accent-soft)", fg: "var(--color-accent)", border: "var(--color-accent)" },
  success: { bg: "color-mix(in srgb, var(--color-success) 14%, transparent)", fg: "var(--color-success)", border: "var(--color-success)" },
  info: { bg: "color-mix(in srgb, var(--color-info) 14%, transparent)", fg: "var(--color-info)", border: "var(--color-info)" },
  warning: { bg: "color-mix(in srgb, var(--color-warning) 14%, transparent)", fg: "var(--color-warning)", border: "var(--color-warning)" },
  neutral: { bg: "var(--color-bg-soft)", fg: "var(--color-ink-3)", border: "var(--color-ink-4)" },
};

export function BookingStatusForm({ booking }: { booking: Booking }) {
  const [status, setStatus] = useState(booking.status as string);
  const [notes, setNotes] = useState(booking.notes ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSave = () => {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const result = await updateBookingStatus({ id: booking.id, status, notes });
      if (!result.success) {
        setError(result.error);
        return;
      }
      setSaved(true);
      router.refresh();
    });
  };

  return (
    <div className="card-surface border rounded-2xl p-5 space-y-4">
      <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)]">
        Update status
      </p>

      <div className="flex gap-2 flex-wrap">
        {STATUSES.map((s) => {
          const active = status === s.id;
          const tone = TONE_STYLES[s.tone];
          return (
            <button
              key={s.id}
              onClick={() => setStatus(s.id)}
              className="px-4 py-2 rounded-full text-sm font-medium border transition-all"
              style={{
                borderColor: active ? tone.border : "var(--color-line)",
                background: active ? tone.bg : "transparent",
                color: active ? tone.fg : "var(--color-ink-3)",
              }}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      <div>
        <label className="block font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)] mb-1.5">
          Notes (internal)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Add notes about this booking…"
          className="w-full px-4 py-3 border border-[var(--color-line)] rounded-xl text-sm bg-[var(--color-bg-soft)] outline-none focus:border-[var(--color-accent)] focus:bg-[var(--color-bg-card)] transition-colors resize-none"
        />
      </div>

      {error && <InlineAlert tone="error" message={error} />}
      {saved && <InlineAlert tone="success" message="Saved." />}

      <button
        onClick={handleSave}
        disabled={isPending}
        className="w-full bg-[var(--color-accent)] text-white text-sm font-medium rounded-full py-3 hover:opacity-90 transition-opacity disabled:opacity-40"
      >
        {isPending ? "Saving…" : "Save changes"}
      </button>
    </div>
  );
}
