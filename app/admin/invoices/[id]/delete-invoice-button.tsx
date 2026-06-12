"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteInvoice } from "@/lib/actions/delete-invoice";

export function DeleteInvoiceButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    if (!window.confirm("Delete this invoice? This cannot be undone.")) return;
    startTransition(async () => {
      const result = await deleteInvoice({ id });
      if (!result.success) {
        window.alert(result.error);
        return;
      }
      router.push("/admin/invoices");
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="no-print inline-flex items-center gap-1.5 text-sm font-medium border border-[var(--color-line)] text-[var(--color-ink-3)] rounded-full px-4 py-2 hover:text-red-600 hover:border-red-200 transition-colors disabled:opacity-50"
    >
      {isPending ? "Deleting…" : "Delete"}
    </button>
  );
}
