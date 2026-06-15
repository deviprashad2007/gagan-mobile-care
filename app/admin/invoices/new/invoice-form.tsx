"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Repair, Invoice } from "@/lib/admin";
import { createInvoice } from "@/lib/actions/create-invoice";
import { updateInvoice } from "@/lib/actions/update-invoice";
import type { InvoiceItem } from "@/lib/validations/invoice";
import { InlineAlert } from "@/components/admin/ui/inline-alert";

const PAYMENT_METHODS = [
  { id: "cash", label: "Cash" },
  { id: "upi", label: "UPI" },
  { id: "card", label: "Card" },
  { id: "other", label: "Other" },
] as const;

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

export function InvoiceForm({ repair, invoice }: { repair?: Repair | null; invoice?: Invoice }) {
  const isEdit = !!invoice;
  const [customerName, setCustomerName] = useState(invoice?.customer_name ?? repair?.customer_name ?? "");
  const [customerPhone, setCustomerPhone] = useState(invoice?.customer_phone ?? repair?.customer_phone ?? "");
  const [modelText, setModelText] = useState(invoice?.model_text ?? repair?.model_text ?? "");
  const [issueText, setIssueText] = useState(repair?.issue_text ?? "");
  const [partCost, setPartCost] = useState(0);
  const [serviceCost, setServiceCost] = useState(repair?.amount ?? 0);
  const [isPostal, setIsPostal] = useState(repair?.service_type === "post");
  const [repostCost, setRepostCost] = useState(0);
  const [extraItems, setExtraItems] = useState<InvoiceItem[]>(
    isEdit ? ((invoice!.items as unknown as InvoiceItem[]) ?? []) : []
  );
  const [discount, setDiscount] = useState(invoice?.discount ?? 0);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "upi" | "card" | "other">(
    (invoice?.payment_method as "cash" | "upi" | "card" | "other") ?? "cash"
  );
  const [notes, setNotes] = useState(invoice?.notes ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const buildItems = (): InvoiceItem[] => {
    if (isEdit) {
      const items = extraItems.filter((item) => item.description.trim());
      if (items.length === 0) items.push({ description: "Item", qty: 1, price: 0 });
      return items;
    }
    const items: InvoiceItem[] = [];
    const label = issueText.trim() || "Repair";
    if (partCost > 0) items.push({ description: `${label} – Replacement part`, qty: 1, price: partCost });
    if (serviceCost > 0) items.push({ description: `${label} – Service charge`, qty: 1, price: serviceCost });
    if (isPostal && repostCost > 0) items.push({ description: "Return postage", qty: 1, price: repostCost });
    for (const item of extraItems) {
      if (item.description.trim()) items.push(item);
    }
    if (items.length === 0) items.push({ description: label, qty: 1, price: 0 });
    return items;
  };

  const items = buildItems();
  const subtotal = items.reduce((sum, item) => sum + item.qty * item.price, 0);
  const total = Math.max(subtotal - discount, 0);

  const updateExtraItem = (i: number, patch: Partial<InvoiceItem>) => {
    setExtraItems((prev) => prev.map((item, idx) => (idx === i ? { ...item, ...patch } : item)));
  };

  const addExtraItem = () => setExtraItems((prev) => [...prev, { description: "", qty: 1, price: 0 }]);
  const removeExtraItem = (i: number) => setExtraItems((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = () => {
    setError(null);
    startTransition(async () => {
      if (isEdit) {
        const result = await updateInvoice({
          id: invoice!.id,
          data: {
            customerName,
            customerPhone,
            modelText: modelText || undefined,
            items: buildItems(),
            discount,
            paymentMethod,
            notes: notes || undefined,
          },
        });
        if (!result.success) {
          setError(result.error);
          return;
        }
        router.push(`/admin/invoices/${invoice!.id}`);
        return;
      }

      const result = await createInvoice({
        repairId: repair?.id,
        customerName,
        customerPhone,
        modelText: modelText || undefined,
        items: buildItems(),
        discount,
        paymentMethod,
        notes: notes || undefined,
      });
      if (!result.success) {
        setError(result.error);
        return;
      }
      router.push(`/admin/invoices/${result.id}`);
    });
  };

  return (
    <div className="card-surface border rounded-2xl p-5 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)] mb-1.5">
            Customer name
          </label>
          <input
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full px-4 py-3 border border-[var(--color-line)] rounded-xl text-sm bg-[var(--color-bg-soft)] outline-none focus:border-[var(--color-accent)] focus:bg-[var(--color-bg-card)] transition-colors"
          />
        </div>
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)] mb-1.5">
            Phone (optional)
          </label>
          <input
            value={customerPhone ?? ""}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="w-full px-4 py-3 border border-[var(--color-line)] rounded-xl text-sm bg-[var(--color-bg-soft)] outline-none focus:border-[var(--color-accent)] focus:bg-[var(--color-bg-card)] transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)] mb-1.5">
          Model
        </label>
        <input
          value={modelText ?? ""}
          onChange={(e) => setModelText(e.target.value)}
          placeholder="e.g. iPhone 13"
          className="w-full px-4 py-3 border border-[var(--color-line)] rounded-xl text-sm bg-[var(--color-bg-soft)] outline-none focus:border-[var(--color-accent)] focus:bg-[var(--color-bg-card)] transition-colors"
        />
      </div>

      {!isEdit && (
        <>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)] mb-1.5">
              Issue / problem
            </label>
            <input
              value={issueText}
              onChange={(e) => setIssueText(e.target.value)}
              placeholder="e.g. Screen replacement"
              className="w-full px-4 py-3 border border-[var(--color-line)] rounded-xl text-sm bg-[var(--color-bg-soft)] outline-none focus:border-[var(--color-accent)] focus:bg-[var(--color-bg-card)] transition-colors"
            />
          </div>

          {/* Cost breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)] mb-1.5">
                Part / replacement cost
              </label>
              <input
                type="number"
                min={0}
                value={partCost}
                onChange={(e) => setPartCost(Number(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-[var(--color-line)] rounded-xl text-sm bg-[var(--color-bg-soft)] outline-none focus:border-[var(--color-accent)] focus:bg-[var(--color-bg-card)] transition-colors"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)] mb-1.5">
                Repair / service cost
              </label>
              <input
                type="number"
                min={0}
                value={serviceCost}
                onChange={(e) => setServiceCost(Number(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-[var(--color-line)] rounded-xl text-sm bg-[var(--color-bg-soft)] outline-none focus:border-[var(--color-accent)] focus:bg-[var(--color-bg-card)] transition-colors"
              />
            </div>
          </div>

          {/* Postal repost cost */}
          <div>
            <label className="inline-flex items-center gap-2 text-sm text-[var(--color-ink-3)] cursor-pointer">
              <input
                type="checkbox"
                checked={isPostal}
                onChange={(e) => setIsPostal(e.target.checked)}
                className="w-4 h-4"
              />
              Sent back by post (add return postage cost)
            </label>
            {isPostal && (
              <div className="mt-2">
                <label className="block font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)] mb-1.5">
                  Repost / return postage cost
                </label>
                <input
                  type="number"
                  min={0}
                  value={repostCost}
                  onChange={(e) => setRepostCost(Number(e.target.value) || 0)}
                  className="w-full sm:w-1/2 px-4 py-3 border border-[var(--color-line)] rounded-xl text-sm bg-[var(--color-bg-soft)] outline-none focus:border-[var(--color-accent)] focus:bg-[var(--color-bg-card)] transition-colors"
                />
              </div>
            )}
          </div>
        </>
      )}

      {/* Items */}
      <div>
        <label className="block font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)] mb-1.5">
          {isEdit ? "Items" : "Other items (optional)"}
        </label>
        <div className="space-y-2">
          {extraItems.map((item, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={item.description}
                onChange={(e) => updateExtraItem(i, { description: e.target.value })}
                placeholder="Description"
                className="flex-1 px-3 py-2.5 border border-[var(--color-line)] rounded-xl text-sm bg-[var(--color-bg-soft)] outline-none focus:border-[var(--color-accent)] focus:bg-[var(--color-bg-card)] transition-colors"
              />
              <input
                type="number"
                min={1}
                value={item.qty}
                onChange={(e) => updateExtraItem(i, { qty: Number(e.target.value) || 1 })}
                className="w-16 px-2 py-2.5 border border-[var(--color-line)] rounded-xl text-sm bg-[var(--color-bg-soft)] outline-none focus:border-[var(--color-accent)] focus:bg-[var(--color-bg-card)] transition-colors text-center"
              />
              <input
                type="number"
                min={0}
                value={item.price}
                onChange={(e) => updateExtraItem(i, { price: Number(e.target.value) || 0 })}
                className="w-24 px-2 py-2.5 border border-[var(--color-line)] rounded-xl text-sm bg-[var(--color-bg-soft)] outline-none focus:border-[var(--color-accent)] focus:bg-[var(--color-bg-card)] transition-colors text-right"
              />
              <button
                type="button"
                onClick={() => removeExtraItem(i)}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-[var(--color-line)] text-[var(--color-ink-3)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-colors"
                aria-label="Remove item"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addExtraItem}
          className="mt-2 text-sm font-medium text-[var(--color-ink-3)] hover:text-[var(--color-accent)] transition-colors"
        >
          + Add item
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)] mb-1.5">
            Discount
          </label>
          <input
            type="number"
            min={0}
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value) || 0)}
            className="w-full px-4 py-3 border border-[var(--color-line)] rounded-xl text-sm bg-[var(--color-bg-soft)] outline-none focus:border-[var(--color-accent)] focus:bg-[var(--color-bg-card)] transition-colors"
          />
        </div>
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)] mb-1.5">
            Payment method
          </label>
          <div className="flex gap-2 flex-wrap">
            {PAYMENT_METHODS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setPaymentMethod(m.id)}
                className="px-3 py-2 rounded-full text-sm font-medium border transition-colors"
                style={{
                  borderColor: paymentMethod === m.id ? "var(--color-accent)" : "var(--color-line)",
                  background: paymentMethod === m.id ? "var(--color-accent-soft)" : "transparent",
                  color: paymentMethod === m.id ? "var(--color-accent)" : "var(--color-ink-3)",
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="block font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)] mb-1.5">
          Notes (optional)
        </label>
        <textarea
          value={notes ?? ""}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="e.g. warranty terms"
          className="w-full px-4 py-3 border border-[var(--color-line)] rounded-xl text-sm bg-[var(--color-bg-soft)] outline-none focus:border-[var(--color-accent)] focus:bg-[var(--color-bg-card)] transition-colors resize-none"
        />
      </div>

      {/* Bill preview */}
      <div className="border-t border-[var(--color-line)] pt-4 space-y-1.5 text-sm">
        {items.map((item, i) => (
          <div key={i} className="flex justify-between text-[var(--color-ink-3)]">
            <span>{item.description}{item.qty > 1 ? ` ×${item.qty}` : ""}</span>
            <span className="font-mono">{fmt(item.qty * item.price)}</span>
          </div>
        ))}
        <div className="flex justify-between text-[var(--color-ink-3)] pt-1.5 border-t border-[var(--color-line)]">
          <span>Subtotal</span>
          <span className="font-mono">{fmt(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-[var(--color-ink-3)]">
            <span>Discount</span>
            <span className="font-mono">−{fmt(discount)}</span>
          </div>
        )}
        <div className="flex justify-between font-semibold text-[var(--color-ink)] text-base">
          <span>Total</span>
          <span className="font-mono">{fmt(total)}</span>
        </div>
      </div>

      {error && <InlineAlert tone="error" message={error} />}

      <button
        onClick={handleSubmit}
        disabled={isPending || !customerName.trim()}
        className="w-full bg-[var(--color-accent)] text-white text-sm font-medium rounded-full py-3 hover:opacity-90 transition-opacity disabled:opacity-40"
      >
        {isPending ? "Saving…" : isEdit ? "Save changes" : "Create invoice"}
      </button>
    </div>
  );
}
