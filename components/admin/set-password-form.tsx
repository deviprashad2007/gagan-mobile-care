"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SetPasswordForm() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [sessionError, setSessionError] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    // The invite/recovery link puts the session tokens in the URL hash.
    const hash = window.location.hash.replace(/^#/, "");
    const params = new URLSearchParams(hash);
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    if (access_token && refresh_token) {
      supabase.auth.setSession({ access_token, refresh_token }).then(({ error }) => {
        if (error) {
          setSessionError("This link has expired. Ask the owner to resend your invite.");
        } else {
          history.replaceState(null, "", window.location.pathname);
        }
        setReady(true);
      });
    } else {
      supabase.auth.getSession().then(({ data }) => {
        if (!data.session) {
          setSessionError("This link has expired. Ask the owner to resend your invite.");
        }
        setReady(true);
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);

    if (error) {
      setError("Failed to set password. Please try again.");
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  if (!ready) {
    return <p className="text-sm text-[var(--color-ink-3)] text-center">Loading…</p>;
  }

  if (sessionError) {
    return (
      <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-center">
        {sessionError}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card-surface border rounded-2xl p-6 space-y-4">
      <div>
        <label className="block font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)] mb-1.5">
          New password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          autoFocus
          className="w-full px-4 py-3 border border-[var(--color-line)] rounded-xl text-sm bg-[var(--color-bg-soft)] outline-none focus:border-[var(--color-ink)] focus:bg-[var(--color-bg-card)] transition-colors"
        />
      </div>

      <div>
        <label className="block font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)] mb-1.5">
          Confirm password
        </label>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
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
        disabled={saving || !password || !confirm}
        className="w-full bg-[var(--color-ink)] text-[var(--color-bg)] text-sm font-medium rounded-full py-3 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {saving ? "Saving…" : "Set password & continue"}
      </button>
    </form>
  );
}
