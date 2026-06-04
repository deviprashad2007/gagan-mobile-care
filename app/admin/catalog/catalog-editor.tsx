"use client";

import { useState, useTransition } from "react";
import type { Brand, Issue } from "@/lib/repairs";
import type { Database } from "@/lib/supabase/types";
import { upsertPrice } from "@/lib/actions/upsert-price";

type Model = Database["public"]["Tables"]["models"]["Row"];
type Price = Database["public"]["Tables"]["prices"]["Row"];

interface Props {
  brands: Brand[];
  issues: Issue[];
  models: Model[];
  prices: Price[];
}

export function CatalogEditor({ brands, issues, models, prices }: Props) {
  const [selectedBrandId, setSelectedBrandId] = useState(brands[0]?.id ?? "");
  const [editingCell, setEditingCell] = useState<{ modelId: string; issueId: string } | null>(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [, startTransition] = useTransition();

  const selectedBrand = brands.find((b) => b.id === selectedBrandId);
  const brandModels = models.filter((m) => m.brand_id === selectedBrandId);

  const getPrice = (modelId: string, issueId: string): number | null => {
    const p = prices.find((p) => p.model_id === modelId && p.issue_id === issueId);
    return p?.price ?? null;
  };

  const startEdit = (modelId: string, issueId: string) => {
    const current = getPrice(modelId, issueId);
    setEditValue(current?.toString() ?? "");
    setEditingCell({ modelId, issueId });
  };

  const saveEdit = () => {
    if (!editingCell) return;
    const price = parseInt(editValue, 10);
    if (isNaN(price) || price < 0) {
      setEditingCell(null);
      return;
    }

    setSaving(true);
    startTransition(async () => {
      await upsertPrice({
        modelId: editingCell.modelId,
        issueId: editingCell.issueId,
        price,
      });
      setSaving(false);
      setEditingCell(null);
    });
  };

  return (
    <div className="flex gap-4 min-h-0">
      {/* Brand list */}
      <div className="w-44 shrink-0 bg-white border border-[var(--color-line)] rounded-2xl overflow-hidden self-start">
        {brands.map((brand) => (
          <button
            key={brand.id}
            onClick={() => setSelectedBrandId(brand.id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-sm transition-colors border-b border-[var(--color-line)] last:border-0 ${
              selectedBrandId === brand.id
                ? "bg-[var(--color-ink)] text-white"
                : "hover:bg-[var(--color-bg-soft)] text-[var(--color-ink)]"
            }`}
          >
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center text-white font-bold text-[9px] shrink-0"
              style={{ background: brand.tone }}
            >
              {brand.glyph}
            </div>
            <span className="truncate">{brand.name}</span>
          </button>
        ))}
      </div>

      {/* Price grid */}
      <div className="flex-1 bg-white border border-[var(--color-line)] rounded-2xl overflow-auto">
        {!selectedBrand ? (
          <p className="text-center text-sm text-[var(--color-ink-3)] py-16">Select a brand</p>
        ) : brandModels.length === 0 ? (
          <p className="text-center text-sm text-[var(--color-ink-3)] py-16">
            No models for {selectedBrand.name}
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-line)]">
                <th className="text-left px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)] sticky left-0 bg-white min-w-[140px]">
                  Model
                </th>
                {issues.map((issue) => (
                  <th
                    key={issue.id}
                    className="text-center px-3 py-3 font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)] min-w-[90px]"
                  >
                    {issue.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-line)]">
              {brandModels.map((model) => (
                <tr key={model.id} className="hover:bg-[var(--color-bg-soft)] transition-colors">
                  <td className="px-4 py-3 font-medium text-[var(--color-ink)] sticky left-0 bg-inherit">
                    {model.name}
                    {model.release_year && (
                      <span className="ml-1.5 font-mono text-[10px] text-[var(--color-ink-3)]">
                        {model.release_year}
                      </span>
                    )}
                  </td>
                  {issues.map((issue) => {
                    const price = getPrice(model.id, issue.id);
                    const isEditing =
                      editingCell?.modelId === model.id && editingCell?.issueId === issue.id;

                    return (
                      <td key={issue.id} className="px-2 py-2 text-center">
                        {isEditing ? (
                          <div className="flex items-center gap-1 justify-center">
                            <span className="text-xs text-[var(--color-ink-3)]">₹</span>
                            <input
                              autoFocus
                              type="number"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") saveEdit();
                                if (e.key === "Escape") setEditingCell(null);
                              }}
                              onBlur={saveEdit}
                              className="w-20 px-2 py-1 border border-[var(--color-ink)] rounded-lg text-sm text-center outline-none"
                              disabled={saving}
                            />
                          </div>
                        ) : (
                          <button
                            onClick={() => startEdit(model.id, issue.id)}
                            className="w-full font-mono text-sm text-center py-1 px-2 rounded-lg hover:bg-[var(--color-bg-soft)] transition-colors"
                          >
                            {price !== null ? (
                              <span className="text-[var(--color-ink)]">₹{price.toLocaleString("en-IN")}</span>
                            ) : (
                              <span className="text-[var(--color-ink-3)] text-[11px]">
                                ₹{issue.range_min.toLocaleString("en-IN")}+
                              </span>
                            )}
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
