"use client";

import { useState, useTransition } from "react";
import type { Repair } from "@/lib/admin";
import { updateRepairStatus } from "@/lib/actions/update-repair-status";

const STATUSES = [
  { id: "received", label: "Received", color: "#6B7280" },
  { id: "working", label: "Working", color: "#2563EB" },
  { id: "ready", label: "Ready", color: "#16A34A" },
  { id: "picked", label: "Picked up", color: "#9CA3AF" },
] as const;


function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

export function RepairsBoard({ initialRepairs }: { initialRepairs: Repair[] }) {
  const [repairs, setRepairs] = useState(initialRepairs);
  const [, startTransition] = useTransition();

  const advance = (repair: Repair) => {
    const idx = STATUSES.findIndex((s) => s.id === repair.status);
    if (idx >= STATUSES.length - 1) return;
    const nextStatus = STATUSES[idx + 1].id;

    setRepairs((prev) =>
      prev.map((r) => (r.id === repair.id ? { ...r, status: nextStatus } : r))
    );

    startTransition(async () => {
      const result = await updateRepairStatus({ id: repair.id, status: nextStatus });
      if (!result.success) {
        setRepairs((prev) =>
          prev.map((r) => (r.id === repair.id ? { ...r, status: repair.status } : r))
        );
      }
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {STATUSES.map((col) => {
        const items = repairs.filter((r) => r.status === col.id);
        const nextCol = STATUSES[STATUSES.findIndex((s) => s.id === col.id) + 1];

        return (
          <div key={col.id} className="flex flex-col gap-2">
            {/* Column header */}
            <div className="flex items-center gap-2 px-1 mb-1">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: col.color }} />
              <span className="text-sm font-semibold text-[var(--color-ink)]">{col.label}</span>
              <span className="font-mono text-xs text-[var(--color-ink-3)]">{items.length}</span>
            </div>

            {items.length === 0 && (
              <div className="border border-dashed border-[var(--color-line)] rounded-2xl p-6 text-center text-xs text-[var(--color-ink-3)]">
                Nothing here
              </div>
            )}

            {items.map((r) => (
              <div
                key={r.id}
                className="card-surface border rounded-2xl p-4 flex flex-col gap-3 transition-colors hover:border-[var(--color-ink-4)]"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[var(--color-bg-soft)] flex items-center justify-center text-[10px] font-bold text-[var(--color-ink)] shrink-0">
                    {initials(r.customer_name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[var(--color-ink)] truncate">{r.customer_name}</p>
                    <p className="text-xs text-[var(--color-ink-3)] truncate">{r.model_text ?? "—"}</p>
                  </div>
                </div>

                <p className="text-xs text-[var(--color-ink-3)] bg-[var(--color-bg-soft)] rounded-lg px-2.5 py-1.5 leading-snug">
                  {r.issue_text}
                </p>

                <div className="flex items-center justify-between">
                  {r.amount ? (
                    <span className="font-mono text-sm font-semibold text-[var(--color-ink)]">
                      {fmt(r.amount)}
                    </span>
                  ) : (
                    <span className="text-xs text-[var(--color-ink-3)]">Price TBC</span>
                  )}

                  <div className="flex items-center gap-1">
                    <a
                      href={`tel:+91${r.customer_phone}`}
                      className="w-7 h-7 flex items-center justify-center rounded-lg border border-[var(--color-line)] text-[var(--color-ink-3)] hover:text-[var(--color-ink)] transition-colors"
                      aria-label="Call"
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.45 2 2 0 0 1 3.57 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.5a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </a>
                    {nextCol && (
                      <button
                        onClick={() => advance(r)}
                        className="text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-colors"
                        style={{
                          borderColor: nextCol.color,
                          color: nextCol.color,
                          background: nextCol.color + "12",
                        }}
                      >
                        → {nextCol.label}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
