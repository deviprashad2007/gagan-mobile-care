"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/actions/sign-in";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await signIn({ email, password });
      if (!result.success) {
        setError(result.error);
        return;
      }
      router.push("/admin");
      router.refresh();
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo mark */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[var(--color-ink)] text-[var(--color-bg)] font-bold text-lg mb-4">
            G
          </div>
          <h1 className="font-serif text-3xl tracking-tight text-[var(--color-ink)]">
            Admin login
          </h1>
          <p className="text-sm text-[var(--color-ink-3)] mt-1">
            Gagan Mobile Care dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card-surface border rounded-2xl p-6 space-y-4">
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
              className="w-full px-4 py-3 border border-[var(--color-line)] rounded-xl text-sm bg-[var(--color-bg-soft)] outline-none focus:border-[var(--color-ink)] focus:bg-[var(--color-bg-card)] transition-colors"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)] mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 border border-[var(--color-line)] rounded-xl text-sm bg-[var(--color-bg-soft)] outline-none focus:border-[var(--color-ink)] focus:bg-[var(--color-bg-card)] transition-colors"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending || !email || !password}
            className="w-full bg-[var(--color-ink)] text-[var(--color-bg)] text-sm font-medium rounded-full py-3 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isPending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
