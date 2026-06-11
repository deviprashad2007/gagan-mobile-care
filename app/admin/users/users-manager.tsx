"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addAdminUser } from "@/lib/actions/add-admin-user";
import { removeAdminUser } from "@/lib/actions/remove-admin-user";

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
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");
  const [adding, setAdding] = useState(false);
  const [removingEmail, setRemovingEmail] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const handleAdd = async () => {
    if (!newEmail.trim()) return;
    setAddError("");
    setAddSuccess("");
    setAdding(true);
    const result = await addAdminUser({ email: newEmail.trim().toLowerCase() });
    setAdding(false);
    if (!result.success) { setAddError(result.error); return; }
    setNewEmail("");
    setAddSuccess("User added. They can now log in with a magic link.");
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
            className="flex-1 px-3 py-2 border border-[var(--color-line)] rounded-xl text-sm outline-none focus:border-[var(--color-ink)]"
          />
          <button
            onClick={handleAdd}
            disabled={adding || !newEmail.trim()}
            className="px-4 py-2 bg-[var(--color-ink)] text-[var(--color-bg)] text-sm font-medium rounded-xl disabled:opacity-40"
          >
            {adding ? "Adding…" : "Add"}
          </button>
        </div>
        {addError && <p className="text-xs text-red-500 mt-2">{addError}</p>}
        {addSuccess && <p className="text-xs text-green-600 mt-2">{addSuccess}</p>}
        <p className="text-xs text-[var(--color-ink-3)] mt-2">
          The user will be able to log in immediately using a magic link sent to their email.
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
            <div key={u.id} className="flex items-center gap-3 px-5 py-3">
              <div className="w-8 h-8 rounded-full bg-[var(--color-bg-soft)] flex items-center justify-center text-xs font-bold text-[var(--color-ink)] shrink-0">
                {u.email[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium text-[var(--color-ink)] truncate">{u.email}</p>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                      u.role === "owner"
                        ? "bg-[var(--color-ink)] text-[var(--color-bg)]"
                        : "bg-[var(--color-bg-soft)] text-[var(--color-ink-3)]"
                    }`}
                  >
                    {u.role}
                  </span>
                </div>
                <p className="text-xs text-[var(--color-ink-3)]">
                  Added {timeAgo(u.created_at)}
                  {u.invited_by && ` by ${u.invited_by}`}
                </p>
              </div>
              {u.email !== ownerEmail && u.role !== "owner" && (
                <button
                  onClick={() => handleRemove(u.email)}
                  disabled={removingEmail === u.email}
                  className="text-xs text-red-500 hover:text-red-700 transition-colors disabled:opacity-40 shrink-0"
                >
                  {removingEmail === u.email ? "Removing…" : "Remove"}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
