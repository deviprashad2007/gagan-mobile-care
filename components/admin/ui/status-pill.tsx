const TONE_STYLES: Record<string, { bg: string; fg: string }> = {
  accent: { bg: "var(--color-accent-soft)", fg: "var(--color-accent)" },
  success: { bg: "color-mix(in srgb, var(--color-success) 14%, transparent)", fg: "var(--color-success)" },
  info: { bg: "color-mix(in srgb, var(--color-info) 14%, transparent)", fg: "var(--color-info)" },
  warning: { bg: "color-mix(in srgb, var(--color-warning) 14%, transparent)", fg: "var(--color-warning)" },
  neutral: { bg: "var(--color-bg-soft)", fg: "var(--color-ink-3)" },
};

export type StatusTone = "accent" | "success" | "info" | "warning" | "neutral";

interface StatusPillProps {
  label: string;
  tone?: StatusTone;
}

export function StatusPill({ label, tone = "neutral" }: StatusPillProps) {
  const { bg, fg } = TONE_STYLES[tone] ?? TONE_STYLES.neutral;
  return (
    <span
      className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ background: bg, color: fg }}
    >
      {label}
    </span>
  );
}
