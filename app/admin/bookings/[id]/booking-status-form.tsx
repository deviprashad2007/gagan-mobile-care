"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Booking } from "@/lib/admin";
import { updateBookingStatus } from "@/lib/actions/update-booking-status";

const STATUSES = [
  { id: "new", label: "New", color: "#F2521F" },
  { id: "called", label: "Called", color: "#2563EB" },
  { id: "booked", label: "Booked", color: "#16A34A" },
  { id: "lost", label: "Lost", color: "#9CA3AF" },
] as const;

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
    <div className="bg-white border border-[var(--color-line)] rounded-2xl p-5 space-y-4">
      <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)]">
        Update status
      </p>

      <div className="flex gap-2 flex-wrap">
        {STATUSES.map((s) => (
          <button
            key={s.id}
            onClick={() => setStatus(s.id)}
            className="px-4 py-2 rounded-full text-sm font-medium border transition-all"
            style={{
              borderColor: status === s.id ? s.color : "var(--color-line)",
              background: status === s.id ? s.color + "18" : "transparent",
              color: status === s.id ? s.color : "var(--color-ink-3)",
            }}
          >
            {s.label}
          </button>
        ))}
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
          className="w-full px-4 py-3 border border-[var(--color-line)] rounded-xl text-sm bg-[var(--color-bg-soft)] outline-none focus:border-[var(--color-ink)] focus:bg-white transition-colors resize-none"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2">
          {error}
        </p>
      )}

      {saved && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-2">
          Saved.
        </p>
      )}

      <button
        onClick={handleSave}
        disabled={isPending}
        className="w-full bg-[var(--color-ink)] text-white text-sm font-medium rounded-full py-3 hover:opacity-90 transition-opacity disabled:opacity-40"
      >
        {isPending ? "Saving…" : "Save changes"}
      </button>
    </div>
  );
}
