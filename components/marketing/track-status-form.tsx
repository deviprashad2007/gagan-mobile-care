"use client";

import { useEffect, useState } from "react";
import { trackStatus, type TrackedItem } from "@/lib/actions/track-status";

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function TrackStatusForm({ initialQuery }: { initialQuery?: string } = {}) {
  const [query, setQuery] = useState(initialQuery ?? "");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [items, setItems] = useState<TrackedItem[] | null>(null);

  const runSearch = async (q: string) => {
    if (!q.trim() || loading) return;

    setLoading(true);
    setError("");
    setItems(null);

    const result = await trackStatus({ query: q.trim(), website });
    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }
    setItems(result.items);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await runSearch(query);
  };

  useEffect(() => {
    if (initialQuery?.trim()) {
      runSearch(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md">
        {/* Honeypot field — hidden from real users, bots tend to fill every field */}
        <input
          type="text"
          name="website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute left-[-9999px] w-px h-px opacity-0"
        />

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)]">
            Booking code or mobile number
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. GMC-1A2B3 or 9814012345"
            className="px-4 py-3.5 border border-[var(--color-line)] rounded-xl text-sm bg-[var(--color-bg-card)] outline-none focus:border-[var(--color-ink)] transition-colors"
          />
        </label>

        <button
          type="submit"
          disabled={!query.trim() || loading}
          className="px-4 py-3.5 bg-[var(--color-ink)] text-[var(--color-bg)] text-sm font-medium rounded-xl disabled:opacity-40 transition-opacity hover:opacity-90"
        >
          {loading ? "Checking…" : "Check status"}
        </button>

        {error && <p className="text-sm text-red-500">{error}</p>}
      </form>

      {items && items.length > 0 && (
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div key={item.ref} className="card-surface border rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="font-mono text-xs text-[var(--color-ink-3)]">{item.ref}</p>
                  <p className="text-sm font-medium text-[var(--color-ink)] mt-0.5">
                    {[item.brand, item.model].filter(Boolean).join(" · ") || "—"}
                  </p>
                  <p className="text-xs text-[var(--color-ink-3)] mt-0.5">{item.problem}</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--color-bg-soft)] text-[var(--color-ink)] shrink-0">
                  {item.statusLabel}
                </span>
              </div>

              <p className="text-sm text-[var(--color-ink)] mb-3">{item.statusDescription}</p>

              <div className="flex items-center justify-between text-xs text-[var(--color-ink-3)] pt-3 border-t border-[var(--color-line)]">
                <span>Booked {fmtDate(item.createdAt)}</span>
                <span>{item.serviceType === "post" ? "📦 Send by post" : "🏪 Walk-in"}</span>
                {item.amount != null && <span className="font-mono">{fmt(item.amount)}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
