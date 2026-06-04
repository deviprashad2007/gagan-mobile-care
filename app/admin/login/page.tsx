"use client";

import { useState, useTransition } from "react";
import { sendMagicLink } from "@/lib/actions/send-magic-link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const urlError =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("error")
      : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await sendMagicLink({ email });
      if (!result.success) {
        setError(result.error);
        return;
      }
      setSent(true);
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo mark */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[var(--color-ink)] text-white font-bold text-lg mb-4">
            G
          </div>
          <h1 className="font-serif text-3xl tracking-tight text-[var(--color-ink)]">
            Admin login
          </h1>
          <p className="text-sm text-[var(--color-ink-3)] mt-1">
            Gagan Mobile Care dashboard
          </p>
        </div>

        {urlError === "auth" && !sent && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-center">
            Link expired or invalid. Please request a new one.
          </div>
        )}

        {sent ? (
          <div className="text-center bg-white border border-[var(--color-line)] rounded-2xl p-8">
            <div className="w-12 h-12 rounded-full bg-[var(--color-bg-soft)] flex items-center justify-center mx-auto mb-4 text-2xl">
              ✉️
            </div>
            <p className="font-semibold text-[var(--color-ink)] mb-1">Check your email</p>
            <p className="text-sm text-[var(--color-ink-3)]">
              We sent a magic link to{" "}
              <span className="font-mono text-[var(--color-ink)]">{email}</span>.
              Click it to sign in.
            </p>
            <button
              onClick={() => { setSent(false); setEmail(""); }}
              className="mt-6 text-sm text-[var(--color-ink-3)] hover:text-[var(--color-ink)] transition-colors underline underline-offset-4"
            >
              Use a different email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white border border-[var(--color-line)] rounded-2xl p-6 space-y-4">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)] mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoFocus
                className="w-full px-4 py-3 border border-[var(--color-line)] rounded-xl text-sm bg-[var(--color-bg-soft)] outline-none focus:border-[var(--color-ink)] focus:bg-white transition-colors"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending || !email}
              className="w-full bg-[var(--color-ink)] text-white text-sm font-medium rounded-full py-3 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isPending ? "Sending…" : "Send magic link"}
            </button>

            <p className="text-[12px] text-center text-[var(--color-ink-3)]">
              No password. A sign-in link is emailed to you.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
