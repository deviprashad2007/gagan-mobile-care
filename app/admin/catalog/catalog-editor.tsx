"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Brand, Issue } from "@/lib/repairs";
import type { Database } from "@/lib/supabase/types";
import { upsertPrice } from "@/lib/actions/upsert-price";
import { createBrand } from "@/lib/actions/create-brand";
import { createModel } from "@/lib/actions/create-model";

type Model = Database["public"]["Tables"]["models"]["Row"];
type Price = Database["public"]["Tables"]["prices"]["Row"];

interface Props {
  brands: Brand[];
  issues: Issue[];
  models: Model[];
  prices: Price[];
}

const BRAND_COLORS = [
  "#1a1a1a", "#2563eb", "#16a34a", "#dc2626",
  "#9333ea", "#ea580c", "#0891b2", "#be185d",
];

export function CatalogEditor({ brands, issues, models, prices }: Props) {
  const router = useRouter();
  const [selectedBrandId, setSelectedBrandId] = useState(brands[0]?.id ?? "");
  const [editingCell, setEditingCell] = useState<{ modelId: string; issueId: string } | null>(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [, startTransition] = useTransition();

  const [showAddBrand, setShowAddBrand] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [newBrandTone, setNewBrandTone] = useState(BRAND_COLORS[0]);
  const [brandError, setBrandError] = useState("");
  const [addingBrand, setAddingBrand] = useState(false);

  const [showAddModel, setShowAddModel] = useState(false);
  const [newModelName, setNewModelName] = useState("");
  const [newModelYear, setNewModelYear] = useState("");
  const [modelError, setModelError] = useState("");
  const [addingModel, setAddingModel] = useState(false);

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
    if (isNaN(price) || price < 0) { setEditingCell(null); return; }
    setSaving(true);
    startTransition(async () => {
      await upsertPrice({ modelId: editingCell.modelId, issueId: editingCell.issueId, price });
      setSaving(false);
      setEditingCell(null);
    });
  };

  const handleAddBrand = async () => {
    if (!newBrandName.trim()) return;
    setBrandError("");
    setAddingBrand(true);
    const glyph = newBrandName.trim().slice(0, 2).toUpperCase();
    const result = await createBrand({ name: newBrandName.trim(), glyph, tone: newBrandTone });
    setAddingBrand(false);
    if (!result.success) { setBrandError(result.error); return; }
    setNewBrandName(""); setNewBrandTone(BRAND_COLORS[0]); setShowAddBrand(false);
    router.refresh();
  };

  const handleAddModel = async () => {
    if (!newModelName.trim() || !selectedBrandId) return;
    setModelError("");
    setAddingModel(true);
    const year = newModelYear ? parseInt(newModelYear, 10) : null;
    const result = await createModel({ name: newModelName.trim(), brand_id: selectedBrandId, release_year: year });
    setAddingModel(false);
    if (!result.success) { setModelError(result.error); return; }
    setNewModelName(""); setNewModelYear(""); setShowAddModel(false);
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-4">

      {/* ── Brand selector ───────────────────────────────────────────────── */}
      {/* Mobile: horizontal scrollable pills | Desktop: vertical sidebar */}

      {/* Mobile pill row */}
      <div className="md:hidden flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
        {brands.map((brand) => (
          <button
            key={brand.id}
            onClick={() => { setSelectedBrandId(brand.id); setShowAddModel(false); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm whitespace-nowrap border transition-colors shrink-0"
            style={
              selectedBrandId === brand.id
                ? { background: brand.tone, borderColor: brand.tone, color: "#fff" }
                : { background: "#fff", borderColor: "var(--color-line)", color: "var(--color-ink)" }
            }
          >
            <span className="font-bold text-[10px]">{brand.glyph}</span>
            {brand.name}
          </button>
        ))}
        <button
          onClick={() => setShowAddBrand(true)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm whitespace-nowrap border border-dashed border-[var(--color-line)] text-[var(--color-ink-3)] shrink-0"
        >
          + Add
        </button>
      </div>

      {/* Desktop layout: sidebar + grid side by side */}
      <div className="flex flex-col md:flex-row gap-4 min-h-0">

        {/* Desktop sidebar */}
        <div className="hidden md:flex md:flex-col w-44 shrink-0 bg-white border border-[var(--color-line)] rounded-2xl overflow-hidden self-start">
          {brands.map((brand) => (
            <button
              key={brand.id}
              onClick={() => { setSelectedBrandId(brand.id); setShowAddModel(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-sm transition-colors border-b border-[var(--color-line)] ${
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

          {showAddBrand ? (
            <div className="p-3 border-t border-[var(--color-line)] flex flex-col gap-2">
              <input
                autoFocus
                placeholder="Brand name"
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddBrand();
                  if (e.key === "Escape") { setShowAddBrand(false); setBrandError(""); }
                }}
                className="w-full px-2 py-1.5 border border-[var(--color-line)] rounded-lg text-xs outline-none focus:border-[var(--color-ink)]"
              />
              <div className="flex flex-wrap gap-1.5">
                {BRAND_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setNewBrandTone(c)}
                    className="w-5 h-5 rounded-full border-2 transition-all"
                    style={{ background: c, borderColor: newBrandTone === c ? "#000" : "transparent" }}
                  />
                ))}
              </div>
              {brandError && <p className="text-[10px] text-red-500">{brandError}</p>}
              <div className="flex gap-1.5">
                <button
                  onClick={handleAddBrand}
                  disabled={addingBrand || !newBrandName.trim()}
                  className="flex-1 py-1.5 bg-[var(--color-ink)] text-white text-xs rounded-lg disabled:opacity-40"
                >
                  {addingBrand ? "Adding…" : "Add"}
                </button>
                <button
                  onClick={() => { setShowAddBrand(false); setBrandError(""); setNewBrandName(""); }}
                  className="px-2 py-1.5 border border-[var(--color-line)] text-xs rounded-lg text-[var(--color-ink-3)]"
                >
                  ✕
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddBrand(true)}
              className="w-full flex items-center gap-1.5 px-3 py-2.5 text-xs text-[var(--color-ink-3)] hover:text-[var(--color-ink)] hover:bg-[var(--color-bg-soft)] transition-colors border-t border-[var(--color-line)]"
            >
              <span className="text-base leading-none font-light">+</span> Add brand
            </button>
          )}
        </div>

        {/* Add brand modal for mobile */}
        {showAddBrand && (
          <div className="md:hidden bg-white border border-[var(--color-line)] rounded-2xl p-4 flex flex-col gap-3">
            <p className="text-sm font-medium text-[var(--color-ink)]">Add brand</p>
            <input
              autoFocus
              placeholder="Brand name"
              value={newBrandName}
              onChange={(e) => setNewBrandName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddBrand();
                if (e.key === "Escape") { setShowAddBrand(false); setBrandError(""); }
              }}
              className="w-full px-3 py-2 border border-[var(--color-line)] rounded-xl text-sm outline-none focus:border-[var(--color-ink)]"
            />
            <div className="flex flex-wrap gap-2">
              {BRAND_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setNewBrandTone(c)}
                  className="w-7 h-7 rounded-full border-2 transition-all"
                  style={{ background: c, borderColor: newBrandTone === c ? "#000" : "transparent" }}
                />
              ))}
            </div>
            {brandError && <p className="text-xs text-red-500">{brandError}</p>}
            <div className="flex gap-2">
              <button
                onClick={handleAddBrand}
                disabled={addingBrand || !newBrandName.trim()}
                className="flex-1 py-2 bg-[var(--color-ink)] text-white text-sm rounded-xl disabled:opacity-40"
              >
                {addingBrand ? "Adding…" : "Add brand"}
              </button>
              <button
                onClick={() => { setShowAddBrand(false); setBrandError(""); setNewBrandName(""); }}
                className="px-4 py-2 border border-[var(--color-line)] text-sm rounded-xl text-[var(--color-ink-3)]"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ── Price grid ──────────────────────────────────────────────────── */}
        <div className="flex-1 bg-white border border-[var(--color-line)] rounded-2xl overflow-hidden min-w-0">
          {!selectedBrand ? (
            <p className="text-center text-sm text-[var(--color-ink-3)] py-16">Select a brand</p>
          ) : (
            <>
              {/* Grid header */}
              <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-[var(--color-line)] flex-wrap">
                <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)]">
                  {selectedBrand.name} &mdash; {brandModels.length} model{brandModels.length !== 1 ? "s" : ""}
                </p>

                {showAddModel ? (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                    <div className="flex gap-2 w-full sm:w-auto">
                      <input
                        autoFocus
                        placeholder="Model name"
                        value={newModelName}
                        onChange={(e) => setNewModelName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAddModel();
                          if (e.key === "Escape") { setShowAddModel(false); setModelError(""); }
                        }}
                        className="flex-1 sm:w-44 px-2 py-1 border border-[var(--color-line)] rounded-lg text-sm outline-none focus:border-[var(--color-ink)]"
                      />
                      <input
                        placeholder="Year"
                        value={newModelYear}
                        onChange={(e) => setNewModelYear(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        className="w-16 px-2 py-1 border border-[var(--color-line)] rounded-lg text-sm outline-none focus:border-[var(--color-ink)]"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddModel}
                        disabled={addingModel || !newModelName.trim()}
                        className="px-3 py-1 bg-[var(--color-ink)] text-white text-sm rounded-lg disabled:opacity-40"
                      >
                        {addingModel ? "…" : "Add"}
                      </button>
                      <button
                        onClick={() => { setShowAddModel(false); setModelError(""); setNewModelName(""); setNewModelYear(""); }}
                        className="px-2 py-1 text-[var(--color-ink-3)] text-sm hover:text-[var(--color-ink)]"
                      >
                        ✕
                      </button>
                    </div>
                    {modelError && <p className="text-xs text-red-500 w-full">{modelError}</p>}
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAddModel(true)}
                    className="flex items-center gap-1 text-sm text-[var(--color-ink-3)] hover:text-[var(--color-ink)] transition-colors"
                  >
                    <span className="text-base leading-none font-light">+</span> Add model
                  </button>
                )}
              </div>

              {brandModels.length === 0 ? (
                <p className="text-center text-sm text-[var(--color-ink-3)] py-16">
                  No models yet — tap &ldquo;Add model&rdquo; above
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[var(--color-line)]">
                        <th className="text-left px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)] sticky left-0 z-10 bg-white min-w-[130px]">
                          Model
                        </th>
                        {issues.map((issue) => (
                          <th
                            key={issue.id}
                            className="text-center px-2 py-3 font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)] min-w-[80px]"
                          >
                            {issue.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-line)]">
                      {brandModels.map((model) => (
                        <tr key={model.id} className="group hover:bg-[var(--color-bg-soft)] transition-colors">
                          <td className="px-4 py-3 font-medium text-[var(--color-ink)] sticky left-0 z-10 bg-white group-hover:bg-[var(--color-bg-soft)] transition-colors whitespace-nowrap">
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
                              <td key={issue.id} className="px-1 py-2 text-center">
                                {isEditing ? (
                                  <div className="flex items-center gap-0.5 justify-center">
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
                                    className="w-full font-mono text-sm text-center py-1 px-1 rounded-lg hover:bg-[var(--color-bg-soft)] transition-colors"
                                  >
                                    {price !== null ? (
                                      <span className="text-[var(--color-ink)]">
                                        ₹{price.toLocaleString("en-IN")}
                                      </span>
                                    ) : (
                                      <span className="text-[var(--color-ink-3)] text-[11px]">—</span>
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
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
