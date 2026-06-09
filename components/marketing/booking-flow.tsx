"use client";

import { useState, useTransition } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Brand, Issue, Model } from "@/lib/repairs";
import { BrandIcon } from "./brand-icon";
import { createBooking } from "@/lib/actions/create-booking";
import { WHATSAPP_URL, BUSINESS_PHONE } from "@/lib/seo/business-info";

type Step = "brand" | "model" | "issue" | "service" | "contact";
const STEPS: Step[] = ["brand", "model", "issue", "service", "contact"];

interface Confirmed {
  bookingRef: string;
  customerName: string;
  estimatedMin: number;
  estimatedMax: number;
}

interface Props {
  brands: Brand[];
  issues: Issue[];
  models: Model[];
  onClose: () => void;
}

export function BookingFlow({ brands, issues, models, onClose }: Props) {
  const [step, setStep] = useState<Step>("brand");
  const [brand, setBrand] = useState<Brand | null>(null);
  const [model, setModel] = useState<Model | null>(null);
  const [modelText, setModelText] = useState("");
  const [issueIds, setIssueIds] = useState<string[]>([]);
  const [serviceType, setServiceType] = useState<"walkin" | "post" | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<Confirmed | null>(null);
  const [isPending, startTransition] = useTransition();

  const stepIndex = STEPS.indexOf(step);
  const selectedIssues = issues.filter((i) => issueIds.includes(i.id));
  const estimatedMin = selectedIssues.reduce((s, i) => s + i.range_min, 0);
  const estimatedMax = selectedIssues.reduce((s, i) => s + i.range_max, 0);

  const goBack = () => {
    if (stepIndex > 0) setStep(STEPS[stepIndex - 1]);
  };

  const handleSubmit = () => {
    if (!brand || (!model && !modelText.trim()) || issueIds.length === 0 || !serviceType) return;
    if (name.trim().length < 2 || !/^\d{10}$/.test(phone)) return;
    setError(null);

    startTransition(async () => {
      const result = await createBooking({
        brandId: brand.id,
        brandName: brand.name,
        modelId: model?.id,
        modelText: model ? model.name : modelText.trim(),
        issueIds,
        serviceType,
        customerName: name.trim(),
        customerPhone: phone,
        estimatedPriceMin: estimatedMin,
        estimatedPriceMax: estimatedMax,
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      setConfirmed({
        bookingRef: result.bookingRef,
        customerName: name.trim(),
        estimatedMin: result.estimatedPriceMin,
        estimatedMax: result.estimatedPriceMax,
      });
    });
  };

  return (
    <motion.div
      className="fixed inset-0 bg-[var(--color-bg)] z-50 flex flex-col"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Top bar */}
      <div className="flex items-center gap-3 px-5 md:px-8 py-4 border-b border-[var(--color-line)] bg-[var(--color-bg)]/90 backdrop-blur-sm shrink-0">
        {!confirmed && stepIndex > 0 ? (
          <button
            onClick={goBack}
            className="text-sm text-[var(--color-ink-3)] hover:text-[var(--color-ink)] transition-colors"
          >
            ← Back
          </button>
        ) : (
          <span className="text-sm text-[var(--color-ink-3)]">
            {confirmed ? "Booking confirmed" : "Book a repair"}
          </span>
        )}

        {!confirmed && (
          <div className="flex flex-1 gap-1.5 max-w-xs mx-auto">
            {STEPS.map((s, i) => (
              <div
                key={s}
                className="flex-1 h-0.5 rounded-full transition-all duration-300"
                style={{
                  background:
                    i < stepIndex
                      ? "var(--color-ink)"
                      : i === stepIndex
                        ? "var(--color-accent)"
                        : "var(--color-line)",
                }}
              />
            ))}
          </div>
        )}

        <button
          onClick={onClose}
          className="ml-auto text-[var(--color-ink-3)] hover:text-[var(--color-ink)] transition-colors p-1"
          aria-label="Close"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-5 md:px-8 py-10 pb-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={confirmed ? "confirmed" : step}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              {confirmed ? (
                <ConfirmationScreen confirmed={confirmed} onClose={onClose} />
              ) : step === "brand" ? (
                <StepBrand
                  brands={brands}
                  onPick={(b) => {
                    setBrand(b);
                    setModel(null);
                    setModelText("");
                    setStep("model");
                  }}
                />
              ) : step === "model" ? (
                <StepModel
                  models={models.filter((m) => m.brand_id === brand!.id)}
                  brand={brand!}
                  selected={model}
                  customText={modelText}
                  onPick={(m) => {
                    setModel(m);
                    setModelText("");
                  }}
                  onCustomTextChange={(v) => {
                    setModelText(v);
                    setModel(null);
                  }}
                  onContinue={() => setStep("issue")}
                />
              ) : step === "issue" ? (
                <StepIssue
                  issues={issues}
                  brand={brand!}
                  selected={issueIds}
                  onToggle={(id) =>
                    setIssueIds((prev) =>
                      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
                    )
                  }
                  onContinue={() => setStep("service")}
                />
              ) : step === "service" ? (
                <StepService
                  selected={serviceType}
                  onPick={(s) => {
                    setServiceType(s);
                    setStep("contact");
                  }}
                />
              ) : (
                <StepContact
                  brand={brand!}
                  modelLabel={model ? model.name : modelText.trim()}
                  issues={selectedIssues}
                  serviceType={serviceType!}
                  estimatedMin={estimatedMin}
                  estimatedMax={estimatedMax}
                  name={name}
                  phone={phone}
                  onNameChange={setName}
                  onPhoneChange={(v) => setPhone(v.replace(/\D/g, "").slice(0, 10))}
                  onSubmit={handleSubmit}
                  isPending={isPending}
                  error={error}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Step 1: Brand ───────────────────────────────────────────────────────────

function StepBrand({
  brands,
  onPick,
}: {
  brands: Brand[];
  onPick: (b: Brand) => void;
}) {
  const [q, setQ] = useState("");
  const filtered = brands.filter((b) =>
    b.name.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-ink-3)] mb-2">
        Step 1 of 5 · Pick brand
      </p>
      <h2 className="font-serif text-4xl md:text-5xl tracking-tight leading-tight text-[var(--color-ink)] mb-6">
        Which brand made <em>your</em> phone?
      </h2>

      <div className="flex items-center gap-2 bg-white border border-[var(--color-line)] rounded-xl px-4 py-3 mb-6 max-w-xs">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search brand…"
          className="flex-1 bg-transparent text-sm outline-none"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {filtered.map((b) => (
          <button
            key={b.id}
            onClick={() => onPick(b)}
            className="flex items-center gap-3 p-3.5 bg-white border border-[var(--color-line)] rounded-xl hover:border-[var(--color-ink-4)] hover:-translate-y-px transition-all text-left"
          >
            <BrandIcon slug={b.slug} name={b.name} tone={b.tone} glyph={b.glyph} size={36} className="rounded-full" />
            <span className="text-sm font-medium text-[var(--color-ink)]">{b.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Step 2: Model ───────────────────────────────────────────────────────────

function StepModel({
  models,
  brand,
  selected,
  customText,
  onPick,
  onCustomTextChange,
  onContinue,
}: {
  models: Model[];
  brand: Brand;
  selected: Model | null;
  customText: string;
  onPick: (m: Model) => void;
  onCustomTextChange: (v: string) => void;
  onContinue: () => void;
}) {
  const [q, setQ] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const filtered = models.filter((m) =>
    m.name.toLowerCase().includes(q.toLowerCase())
  );
  const canContinue = !!selected || customText.trim().length > 1;

  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-ink-3)] mb-2">
        Step 2 of 5 · {brand.name} · Pick your model
      </p>
      <h2 className="font-serif text-4xl md:text-5xl tracking-tight leading-tight text-[var(--color-ink)] mb-6">
        Which <em>{brand.name}</em> phone is it?
      </h2>

      {models.length > 0 && !showCustom && (
        <div className="flex items-center gap-2 bg-white border border-[var(--color-line)] rounded-xl px-4 py-3 mb-6 max-w-xs">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search model…"
            className="flex-1 bg-transparent text-sm outline-none"
          />
        </div>
      )}

      {!showCustom && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
          {filtered.map((m) => {
            const on = selected?.id === m.id;
            return (
              <button
                key={m.id}
                onClick={() => onPick(m)}
                className="relative flex items-center p-3.5 rounded-xl border text-left transition-all"
                style={{
                  border: `1px solid ${on ? "var(--color-ink)" : "var(--color-line)"}`,
                  background: on ? "var(--color-ink)" : "#fff",
                  color: on ? "#fff" : "var(--color-ink)",
                }}
              >
                <span className="text-sm font-medium">{m.name}</span>
                {on && (
                  <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[var(--color-accent)] flex items-center justify-center">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {models.length === 0 && !showCustom && (
        <p className="text-sm text-[var(--color-ink-3)] mb-6">
          We don&apos;t have a model list for {brand.name} yet — just type it in below.
        </p>
      )}

      {showCustom ? (
        <label className="flex flex-col gap-1.5 max-w-sm mb-6">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)]">
            Type your model
          </span>
          <input
            value={customText}
            onChange={(e) => onCustomTextChange(e.target.value)}
            placeholder={`e.g. ${brand.name} ...`}
            autoFocus
            className="px-4 py-3 border border-[var(--color-line)] rounded-xl text-sm bg-white outline-none focus:border-[var(--color-ink)] transition-colors"
          />
        </label>
      ) : (
        <button
          onClick={() => setShowCustom(true)}
          className="text-sm text-[var(--color-ink-3)] hover:text-[var(--color-ink)] underline underline-offset-2 transition-colors mb-6"
        >
          Can&apos;t find your model? Type it in
        </button>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--color-ink-3)]">
          {canContinue ? "Model selected" : "Pick or type your phone model"}
        </p>
        <button
          onClick={onContinue}
          disabled={!canContinue}
          className="inline-flex items-center gap-2 bg-[var(--color-ink)] text-white text-sm font-medium rounded-full px-5 py-2.5 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── Step 3: Issue ───────────────────────────────────────────────────────────

function StepIssue({
  issues,
  brand,
  selected,
  onToggle,
  onContinue,
}: {
  issues: Issue[];
  brand: Brand;
  selected: string[];
  onToggle: (id: string) => void;
  onContinue: () => void;
}) {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-ink-3)] mb-2">
        Step 3 of 5 · {brand.name} · Pick one or many
      </p>
      <h2 className="font-serif text-4xl md:text-5xl tracking-tight leading-tight text-[var(--color-ink)] mb-6">
        What&apos;s <em>wrong</em> with it?
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {issues.map((issue) => {
          const on = selected.includes(issue.id);
          return (
            <button
              key={issue.id}
              onClick={() => onToggle(issue.id)}
              className="relative flex flex-col gap-2 p-4 rounded-xl border text-left transition-all"
              style={{
                border: `1px solid ${on ? "var(--color-ink)" : "var(--color-line)"}`,
                background: on ? "var(--color-ink)" : "#fff",
                color: on ? "#fff" : "var(--color-ink)",
              }}
            >
              {issue.is_common && !on && (
                <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent)]">
                  Common
                </span>
              )}
              {on && (
                <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[var(--color-accent)] flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
              )}
              <p className="font-semibold text-sm">{issue.name}</p>
              {issue.description && (
                <p className="text-[12px] opacity-70">{issue.description}</p>
              )}
              <p className="text-[12px] font-medium mt-1" style={{ color: on ? "var(--color-accent)" : "var(--color-ink)" }}>
                ₹{issue.range_min.toLocaleString("en-IN")} – ₹{issue.range_max.toLocaleString("en-IN")}
              </p>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--color-ink-3)]">
          {selected.length === 0
            ? "Pick at least one issue"
            : `${selected.length} issue${selected.length > 1 ? "s" : ""} selected`}
        </p>
        <button
          onClick={onContinue}
          disabled={selected.length === 0}
          className="inline-flex items-center gap-2 bg-[var(--color-ink)] text-white text-sm font-medium rounded-full px-5 py-2.5 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── Step 3: Service type ─────────────────────────────────────────────────────

function StepService({
  selected,
  onPick,
}: {
  selected: "walkin" | "post" | null;
  onPick: (s: "walkin" | "post") => void;
}) {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-ink-3)] mb-2">
        Step 4 of 5 · How should we get the phone?
      </p>
      <h2 className="font-serif text-4xl md:text-5xl tracking-tight leading-tight text-[var(--color-ink)] mb-6">
        Walk in, or <em>send by post.</em>
      </h2>

      <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
        {/* Walk in */}
        <button
          onClick={() => onPick("walkin")}
          className="relative flex flex-col text-left bg-white rounded-2xl overflow-hidden transition-all"
          style={{
            border: `1px solid ${selected === "walkin" ? "var(--color-ink)" : "var(--color-line)"}`,
          }}
        >
          <div className="map-bg h-28 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="relative flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent)] opacity-60" />
                <span className="relative inline-flex rounded-full h-5 w-5 bg-[var(--color-accent)] border-2 border-white" />
              </span>
            </div>
          </div>
          <div className="p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-accent)] mb-1">
              Walk-in repair
            </p>
            <p className="font-semibold text-[var(--color-ink)] mb-1">Visit our store</p>
            <p className="text-[13px] text-[var(--color-ink-3)]">
              Village Baran, Sirhand Road, Patiala, Punjab 147004
            </p>
            <p className="text-[12px] text-[var(--color-ink-3)] mt-2">Mon–Sat 10am–9pm · Sun 11am–7pm</p>
          </div>
          {selected === "walkin" && (
            <span className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[var(--color-ink)] flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
          )}
        </button>

        {/* Send by post */}
        <button
          onClick={() => onPick("post")}
          className="relative flex flex-col text-left bg-white rounded-2xl overflow-hidden transition-all"
          style={{
            border: `1px solid ${selected === "post" ? "var(--color-ink)" : "var(--color-line)"}`,
          }}
        >
          <div className="h-28 bg-[var(--color-bg-ink)] relative overflow-hidden flex items-center justify-center">
            <svg width="80" height="40" viewBox="0 0 80 40" fill="none" aria-hidden="true">
              <path d="M0 30 Q20 5 40 20 T80 10" stroke="rgba(255,255,255,.15)" strokeDasharray="4 6" strokeWidth="1.5" />
              <path d="M10 35 Q35 8 55 25 T80 15" stroke="var(--color-accent)" strokeDasharray="3 5" strokeWidth="1.5" />
            </svg>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white/30" />
          </div>
          <div className="p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-accent)] mb-1">
              Send by post
            </p>
            <p className="font-semibold text-[var(--color-ink)] mb-1">Speed Post / Courier</p>
            <p className="text-[13px] text-[var(--color-ink-3)]">
              Pan-India. We guide you on packing and pay return courier.
            </p>
            <p className="text-[12px] text-[var(--color-ink-3)] mt-2">COD on return · 2–4 days turnaround</p>
          </div>
          {selected === "post" && (
            <span className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[var(--color-ink)] flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Step 4: Contact details ──────────────────────────────────────────────────

function StepContact({
  brand,
  modelLabel,
  issues,
  serviceType,
  estimatedMin,
  estimatedMax,
  name,
  phone,
  onNameChange,
  onPhoneChange,
  onSubmit,
  isPending,
  error,
}: {
  brand: Brand;
  modelLabel: string;
  issues: Issue[];
  serviceType: "walkin" | "post";
  estimatedMin: number;
  estimatedMax: number;
  name: string;
  phone: string;
  onNameChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
  onSubmit: () => void;
  isPending: boolean;
  error: string | null;
}) {
  const nameValid = name.trim().length >= 2;
  const phoneValid = /^\d{10}$/.test(phone);
  const canSubmit = nameValid && phoneValid && !isPending;

  return (
    <div className="grid lg:grid-cols-[1fr_300px] gap-10">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-ink-3)] mb-2">
          Step 5 of 5 · Almost there
        </p>
        <h2 className="font-serif text-4xl md:text-5xl tracking-tight leading-tight text-[var(--color-ink)] mb-3">
          We&apos;ll call you in <em>15 minutes.</em>
        </h2>
        <p className="text-[var(--color-ink-3)] text-sm mb-8 max-w-md">
          A real person, not a bot. They&apos;ll confirm the issue, lock the price, and book your slot.
        </p>

        <div className="flex flex-col gap-4 max-w-sm">
          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)]">
              Your name
            </span>
            <input
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="e.g. Aarav Sharma"
              className="px-4 py-3.5 border border-[var(--color-line)] rounded-xl text-sm bg-white outline-none focus:border-[var(--color-ink)] transition-colors"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)]">
              Mobile number
            </span>
            <div className="flex items-stretch border border-[var(--color-line)] rounded-xl bg-white focus-within:border-[var(--color-ink)] transition-colors">
              <span className="px-3.5 py-3.5 text-sm text-[var(--color-ink-3)] border-r border-[var(--color-line)]">
                +91
              </span>
              <input
                value={phone}
                onChange={(e) => onPhoneChange(e.target.value)}
                placeholder="98765 43210"
                inputMode="numeric"
                maxLength={10}
                className="flex-1 px-3.5 py-3.5 text-sm bg-transparent outline-none"
              />
            </div>
          </label>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <button
            onClick={onSubmit}
            disabled={!canSubmit}
            className="flex items-center justify-center gap-2 bg-[var(--color-ink)] text-white text-sm font-medium rounded-full px-5 py-3.5 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed mt-2"
          >
            {isPending ? (
              "Booking…"
            ) : (
              <>
                Get free callback in 15 min
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </>
            )}
          </button>
          <p className="text-[12px] text-[var(--color-ink-3)]">
            Your number stays private. No spam, ever.
          </p>
        </div>
      </div>

      {/* Summary card */}
      <div className="lg:sticky lg:top-6 self-start bg-[var(--color-bg-soft)] rounded-2xl p-5 space-y-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)]">
          Booking summary
        </p>

        <div className="flex items-center gap-2.5 pb-4 border-b border-[var(--color-line)]">
          <BrandIcon slug={brand.slug} name={brand.name} tone={brand.tone} glyph={brand.glyph} size={32} className="rounded-full" />
          <div>
            <span className="text-sm font-medium text-[var(--color-ink)] block">{brand.name}</span>
            <span className="text-[12px] text-[var(--color-ink-3)]">{modelLabel}</span>
          </div>
        </div>

        <div className="space-y-2 pb-4 border-b border-[var(--color-line)]">
          {issues.map((issue) => (
            <div key={issue.id} className="flex justify-between text-[13px]">
              <span className="text-[var(--color-ink)]">{issue.name}</span>
              <span className="font-mono text-[var(--color-ink-3)]">
                ₹{issue.range_min.toLocaleString("en-IN")}+
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 text-[13px] text-[var(--color-ink)] pb-4 border-b border-[var(--color-line)]">
          {serviceType === "walkin" ? "🏪 Walk-in at Patiala" : "📦 Send by Speed Post"}
        </div>

        <div className="flex items-baseline justify-between">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)]">
            Estimate
          </p>
          <p className="font-serif text-xl text-[var(--color-ink)]">
            ₹{estimatedMin.toLocaleString("en-IN")}
            <span className="text-[var(--color-ink-3)]"> – </span>
            ₹{estimatedMax.toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Confirmation screen ──────────────────────────────────────────────────────

function ConfirmationScreen({
  confirmed,
  onClose,
}: {
  confirmed: Confirmed;
  onClose: () => void;
}) {
  const firstName = confirmed.customerName.split(" ")[0];

  return (
    <div className="max-w-xl mx-auto text-center pt-4">
      <div className="w-16 h-16 rounded-full bg-[var(--color-ink)] flex items-center justify-center mx-auto">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h2 className="font-serif text-4xl md:text-5xl tracking-tight leading-tight text-[var(--color-ink)] mt-5 mb-2">
        Booking received.
      </h2>
      <p className="text-[var(--color-ink-3)] text-base max-w-sm mx-auto">
        Hi {firstName}, Gagan will call you back within 15 minutes to confirm the details and price.
      </p>

      <div className="grid grid-cols-2 gap-3 mt-8 text-left">
        <div className="bg-white border border-[var(--color-line)] rounded-2xl p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)] mb-1">
            Booking ID
          </p>
          <p className="font-mono text-lg text-[var(--color-ink)]">{confirmed.bookingRef}</p>
        </div>
        <div className="bg-white border border-[var(--color-line)] rounded-2xl p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-3)] mb-1">
            Estimate
          </p>
          <p className="font-serif text-lg text-[var(--color-ink)]">
            ₹{confirmed.estimatedMin.toLocaleString("en-IN")}
            <span className="text-[var(--color-ink-3)]">–</span>
            ₹{confirmed.estimatedMax.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      <div className="flex gap-3 justify-center mt-6 flex-wrap">
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#25D366] text-white text-sm font-medium rounded-full px-5 py-2.5 hover:opacity-90 transition-opacity"
        >
          Chat on WhatsApp
        </a>
        <a
          href={`tel:${BUSINESS_PHONE}`}
          className="inline-flex items-center gap-2 border border-[var(--color-line)] text-[var(--color-ink)] text-sm font-medium rounded-full px-5 py-2.5 hover:border-[var(--color-ink)] transition-colors"
        >
          Call us
        </a>
        <button
          onClick={onClose}
          className="text-sm text-[var(--color-ink-3)] hover:text-[var(--color-ink)] transition-colors px-3"
        >
          Back to home
        </button>
      </div>
    </div>
  );
}
