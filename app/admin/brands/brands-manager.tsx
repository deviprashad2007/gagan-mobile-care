"use client";

import { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Brand, Category } from "@/lib/repairs";
import { BrandIcon } from "@/components/marketing/brand-icon";
import { createCategory } from "@/lib/actions/create-category";
import { createBrand } from "@/lib/actions/create-brand";
import { uploadBrandLogo } from "@/lib/actions/upload-brand-logo";

const BRAND_COLORS = [
  "#1a1a1a", "#2563eb", "#16a34a", "#dc2626",
  "#9333ea", "#ea580c", "#0891b2", "#be185d",
  "#ca8a04", "#0f766e",
];

const CATEGORY_ICONS = ["📱", "💻", "📲", "🎧", "⌚", "🖥️", "🖨️", "📷"];

interface Props {
  categories: Category[];
  brands: Brand[];
}

export function BrandsManager({ categories, brands }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [activeCategoryId, setActiveCategoryId] = useState<string>(categories[0]?.id ?? "");

  // Category form
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [catName, setCatName] = useState("");
  const [catIcon, setCatIcon] = useState("📱");
  const [catError, setCatError] = useState("");
  const [addingCat, setAddingCat] = useState(false);

  // Brand form
  const [showAddBrand, setShowAddBrand] = useState(false);
  const [brandName, setBrandName] = useState("");
  const [brandTone, setBrandTone] = useState(BRAND_COLORS[0]);
  const [brandError, setBrandError] = useState("");
  const [addingBrand, setAddingBrand] = useState(false);

  // Logo upload state per brand id
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [uploadError, setUploadError] = useState<Record<string, string>>({});
  const [localLogos, setLocalLogos] = useState<Record<string, string>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const categoryBrands = brands.filter((b) => b.category_id === activeCategoryId);
  const activeCategory = categories.find((c) => c.id === activeCategoryId);

  const handleAddCategory = async () => {
    if (!catName.trim()) return;
    setCatError("");
    setAddingCat(true);
    const result = await createCategory({ name: catName.trim(), icon: catIcon });
    setAddingCat(false);
    if (!result.success) { setCatError(result.error); return; }
    setCatName(""); setCatIcon("📱"); setShowAddCategory(false);
    startTransition(() => router.refresh());
  };

  const handleAddBrand = async () => {
    if (!brandName.trim() || !activeCategoryId) return;
    setBrandError("");
    setAddingBrand(true);
    const glyph = brandName.trim().slice(0, 2).toUpperCase();
    const result = await createBrand({
      name: brandName.trim(),
      glyph,
      tone: brandTone,
      category_id: activeCategoryId,
    });
    setAddingBrand(false);
    if (!result.success) { setBrandError(result.error); return; }
    setBrandName(""); setBrandTone(BRAND_COLORS[0]); setShowAddBrand(false);
    startTransition(() => router.refresh());
  };

  const handleLogoUpload = async (brand: Brand, file: File) => {
    setUploading((p) => ({ ...p, [brand.id]: true }));
    setUploadError((p) => ({ ...p, [brand.id]: "" }));
    const formData = new FormData();
    formData.append("logo", file);
    const result = await uploadBrandLogo(brand.id, formData);
    setUploading((p) => ({ ...p, [brand.id]: false }));
    if (!result.success) {
      setUploadError((p) => ({ ...p, [brand.id]: result.error }));
      return;
    }
    setLocalLogos((p) => ({ ...p, [brand.id]: result.url }));
    startTransition(() => router.refresh());
  };

  return (
    <div className="flex flex-col gap-6">

      {/* ── Category tabs ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setActiveCategoryId(cat.id); setShowAddBrand(false); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              activeCategoryId === cat.id
                ? "bg-[var(--color-ink)] text-white border-[var(--color-ink)]"
                : "bg-white text-[var(--color-ink-3)] border-[var(--color-line)] hover:border-[var(--color-ink-3)]"
            }`}
          >
            <span>{cat.icon}</span>
            {cat.name}
            <span className="font-mono text-[10px] opacity-60">
              {brands.filter((b) => b.category_id === cat.id).length}
            </span>
          </button>
        ))}

        {/* Add category inline */}
        {showAddCategory ? (
          <div className="flex items-center gap-2 bg-white border border-[var(--color-line)] rounded-2xl px-3 py-2">
            <div className="flex gap-1.5 flex-wrap">
              {CATEGORY_ICONS.map((ic) => (
                <button
                  key={ic}
                  onClick={() => setCatIcon(ic)}
                  className={`text-base px-1.5 py-0.5 rounded-lg transition-colors ${
                    catIcon === ic ? "bg-[var(--color-ink)] text-white" : "hover:bg-[var(--color-bg-soft)]"
                  }`}
                >
                  {ic}
                </button>
              ))}
            </div>
            <input
              autoFocus
              placeholder="Category name"
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddCategory();
                if (e.key === "Escape") { setShowAddCategory(false); setCatError(""); }
              }}
              className="w-36 px-2 py-1 border border-[var(--color-line)] rounded-lg text-sm outline-none focus:border-[var(--color-ink)]"
            />
            {catError && <p className="text-xs text-red-500">{catError}</p>}
            <button
              onClick={handleAddCategory}
              disabled={addingCat || !catName.trim()}
              className="px-3 py-1.5 bg-[var(--color-ink)] text-white text-xs rounded-lg disabled:opacity-40"
            >
              {addingCat ? "…" : "Add"}
            </button>
            <button
              onClick={() => { setShowAddCategory(false); setCatError(""); setCatName(""); }}
              className="text-[var(--color-ink-3)] text-xs hover:text-[var(--color-ink)]"
            >✕</button>
          </div>
        ) : (
          <button
            onClick={() => setShowAddCategory(true)}
            className="flex items-center gap-1 px-4 py-2 rounded-full text-sm border border-dashed border-[var(--color-line)] text-[var(--color-ink-3)] hover:border-[var(--color-ink-3)] hover:text-[var(--color-ink)] transition-colors"
          >
            + Add category
          </button>
        )}
      </div>

      {/* ── Brand grid ────────────────────────────────────────────────────── */}
      {categories.length === 0 ? (
        <p className="text-sm text-[var(--color-ink-3)]">Create a category first.</p>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)]">
              {activeCategory?.icon} {activeCategory?.name} · {categoryBrands.length} brand{categoryBrands.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {categoryBrands.map((brand) => {
              const logoUrl = localLogos[brand.id] ?? brand.logo_url;
              const isUploading = uploading[brand.id];
              const err = uploadError[brand.id];

              return (
                <div
                  key={brand.id}
                  className="flex flex-col items-center gap-3 bg-white border border-[var(--color-line)] rounded-2xl p-4"
                >
                  <BrandIcon
                    slug={brand.slug}
                    name={brand.name}
                    tone={brand.tone}
                    glyph={brand.glyph}
                    logo_url={logoUrl}
                    size={56}
                  />
                  <p className="text-sm font-medium text-[var(--color-ink)] text-center leading-tight">
                    {brand.name}
                  </p>

                  {err && <p className="text-[10px] text-red-500 text-center">{err}</p>}

                  <input
                    ref={(el) => { fileInputRefs.current[brand.id] = el; }}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/svg+xml"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleLogoUpload(brand, file);
                      e.target.value = "";
                    }}
                  />
                  <button
                    onClick={() => fileInputRefs.current[brand.id]?.click()}
                    disabled={isUploading}
                    className="w-full text-xs text-center py-1.5 px-3 rounded-xl border border-[var(--color-line)] text-[var(--color-ink-3)] hover:text-[var(--color-ink)] hover:border-[var(--color-ink-3)] transition-colors disabled:opacity-50"
                  >
                    {isUploading ? "Uploading…" : logoUrl ? "Change logo" : "Upload logo"}
                  </button>
                </div>
              );
            })}

            {/* Add brand card */}
            {showAddBrand ? (
              <div className="flex flex-col gap-3 bg-white border border-[var(--color-line)] rounded-2xl p-4">
                <input
                  autoFocus
                  placeholder="Brand name"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddBrand();
                    if (e.key === "Escape") { setShowAddBrand(false); setBrandError(""); }
                  }}
                  className="w-full px-2 py-1.5 border border-[var(--color-line)] rounded-lg text-sm outline-none focus:border-[var(--color-ink)]"
                />
                <div>
                  <p className="text-[10px] text-[var(--color-ink-3)] mb-1.5">Colour</p>
                  <div className="flex flex-wrap gap-1.5">
                    {BRAND_COLORS.map((c) => (
                      <button
                        key={c}
                        onClick={() => setBrandTone(c)}
                        className="w-5 h-5 rounded-full border-2 transition-all"
                        style={{ background: c, borderColor: brandTone === c ? "#000" : "transparent" }}
                      />
                    ))}
                  </div>
                </div>
                {brandError && <p className="text-[10px] text-red-500">{brandError}</p>}
                <div className="flex gap-1.5">
                  <button
                    onClick={handleAddBrand}
                    disabled={addingBrand || !brandName.trim()}
                    className="flex-1 py-1.5 bg-[var(--color-ink)] text-white text-xs rounded-lg disabled:opacity-40"
                  >
                    {addingBrand ? "Adding…" : "Add"}
                  </button>
                  <button
                    onClick={() => { setShowAddBrand(false); setBrandError(""); setBrandName(""); }}
                    className="px-2 py-1.5 border border-[var(--color-line)] text-xs rounded-lg text-[var(--color-ink-3)]"
                  >✕</button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddBrand(true)}
                className="flex flex-col items-center justify-center gap-2 bg-white border border-dashed border-[var(--color-line)] rounded-2xl p-4 text-[var(--color-ink-3)] hover:text-[var(--color-ink)] hover:border-[var(--color-ink-3)] transition-colors min-h-[160px]"
              >
                <span className="text-3xl font-light leading-none">+</span>
                <span className="text-sm">Add brand</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
