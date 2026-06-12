"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createRepairFromBooking } from "@/lib/actions/create-repair-from-booking";

export function StartRepairButton({ bookingId }: { bookingId: string }) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const result = await createRepairFromBooking({ bookingId });
      if (result.success) {
        router.push("/admin/repairs");
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className="inline-flex items-center gap-1.5 text-sm font-medium bg-[var(--color-ink)] text-[var(--color-bg)] rounded-full px-4 py-2 hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        {isPending ? "Starting…" : "Start repair"}
      </button>
      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
    </div>
  );
}
