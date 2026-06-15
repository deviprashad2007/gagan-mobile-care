"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addAdminUser } from "@/lib/actions/add-admin-user";
import { removeAdminUser } from "@/lib/actions/remove-admin-user";
import { resendAdminInvite } from "@/lib/actions/resend-admin-invite";
import { StatusPill } from "@/components/admin/ui/status-pill";
import { InlineAlert } from "@/components/admin/ui/inline-alert";

interface AdminUser {
  id: string;
  email: string;
  role: string;
  invited_by: string | null;
  created_at: string;
}

interface Props {
  users: AdminUser[];
  ownerEmail: string;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return "Today";
  if (d === 1) return "Yesterday";
  return `${d} days ago`;
}

export function UsersManager({ users, ownerEmail }: Props) {
  const router = useRouter();
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<"staff" | "owner">("staff");
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");
  const [adding, setAdding] = useState(false);
  const [removingEmail, setRemovingEmail] = useState<string | null>(null);
  const [resendingEmail, setResendingEmail] = useState<string | null>(null);
  const [resendResult, setResendResult] = useState<{ email: string; tone: "success" | "error"; message: string } | null>(null);
  const [, startTransition] = useTransition();

  const handleAdd = async () => {
    if (!newEmail.trim()) return;
    setAddError("");
    setAddSuccess("");
    setAdding(true);
    const result = await addAdminUser({ email: newEmail.trim().toLowerCase(), role: newRole });
    setAdding(false);
    if (!result.success) { setAddError(result.error); return; }
    setNewEmail("");
    setNewRole("staff");
    setAddSuccess(
      result.emailSent
        ? "Invite sent. They'll get an email to set their password and sign in."
        : "User added, but the invite email could not be sent. Use \"Resend invite\" below to try again."
    );
    router.refresh();
  };

  const handleRemove = (email: string) => {
    setRemovingEmail(email);
    startTransition(async () => {
      await removeAdminUser({ email });
      setRemovingEmail(null);
      router.refresh();
    });
  };

  const handleResend = (email: string) => {
    setResendingEmail(email);
    setResendResult(null);
    startTransition(async () => {
      const result = await resendAdminInvite({ email });
      setResendingEmail(null);
      setResendResult({
        email,
        tone: result.success ? "success" : "error",
        message: result.success ? "Invite resent." : result.error,
      });
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Add user */}
      <div className="card-surface border rounded-2xl p-5">
        <p className="text-sm font-semibold text-[var(--color-ink)] mb-3">Add user</p>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="staff@example.com"
            value={newEmail}
            onChange={(e) => { setNewEmail(e.target.value); setAddError(""); setAddSuccess(""); }}
            onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
            className="flex-1 px-3 py-2 border border-[var(--color-line)] rounded-xl text-sm outline-none focus:border-[var(--color-accent)]"
          />
          <select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value as "staff" | "owner")}
            className="px-3 py-2 border border-[var(--color-line)] rounded-xl text-sm bg-[var(--color-bg-card)] outline-none focus:border-[var(--color-accent)]"
          >
            <option value="staff">Staff</option>
            <option value="owner">Owner</option>
          </select>
          <button
            onClick={handleAdd}
            disabled={adding || !newEmail.trim()}
            className="px-4 py-2 bg-[var(--color-accent)] text-white text-sm font-medium rounded-xl disabled:opacity-40"
          >
            {adding ? "Inviting…" : "Invite"}
          </button>
        </div>
        {addError && (
          <div className="mt-2"><InlineAlert tone="error" message={addError} /></div>
        )}
        {addSuccess && (
          <div className="mt-2"><InlineAlert tone="success" message={addSuccess} /></div>
        )}
        <p className="text-xs text-[var(--color-ink-3)] mt-2">
          Staff can manage bookings, repairs and invoices. Owners can also manage other users.
          The new user gets an email with a link to set their password.
        </p>
      </div>

      {/* User list */}
      <div className="card-surface border rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-[var(--color-line)]">
          <p className="text-sm font-semibold text-[var(--color-ink)]">
            {users.length} user{users.length !== 1 ? "s" : ""} with access
          </p>
        </div>
        <div className="divide-y divide-[var(--color-line)]">
          {users.map((u) => (
            <div key={u.id} className="flex flex-col gap-2 px-5 py-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={
                    u.role === "owner"
                      ? { background: "var(--color-accent-soft)", color: "var(--color-accent)" }
                      : { background: "var(--color-bg-soft)", color: "var(--color-ink-3)" }
                  }
                >
                  {u.email.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-[var(--color-ink)] truncate">{u.email}</p>
                    <StatusPill label={u.role} tone={u.role === "owner" ? "accent" : "neutral"} />
                  </div>
                  <p className="text-xs text-[var(--color-ink-3)]">
                    Added {timeAgo(u.created_at)}
                    {u.invited_by && ` by ${u.invited_by}`}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {u.email !== ownerEmail && (
                    <button
                      onClick={() => handleResend(u.email)}
                      disabled={resendingEmail === u.email}
                      className="text-xs text-[var(--color-ink-3)] hover:text-[var(--color-accent)] transition-colors disabled:opacity-40"
                    >
                      {resendingEmail === u.email ? "Resending…" : "Resend invite"}
                    </button>
                  )}
                  {u.email !== ownerEmail && u.role !== "owner" && (
                    <button
                      onClick={() => handleRemove(u.email)}
                      disabled={removingEmail === u.email}
                      className="text-xs text-[var(--color-ink-3)] hover:text-[var(--color-accent)] transition-colors disabled:opacity-40"
                    >
                      {removingEmail === u.email ? "Removing…" : "Remove"}
                    </button>
                  )}
                </div>
              </div>
              {resendResult?.email === u.email && (
                <InlineAlert tone={resendResult.tone} message={resendResult.message} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
