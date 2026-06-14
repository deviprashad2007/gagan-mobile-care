import type { StatusTone } from "./status-pill";

const TONE_STYLES: Record<StatusTone, { bg: string; fg: string }> = {
  accent: { bg: "var(--color-accent-soft)", fg: "var(--color-accent)" },
  success: { bg: "color-mix(in srgb, var(--color-success) 14%, transparent)", fg: "var(--color-success)" },
  info: { bg: "color-mix(in srgb, var(--color-info) 14%, transparent)", fg: "var(--color-info)" },
  warning: { bg: "color-mix(in srgb, var(--color-warning) 14%, transparent)", fg: "var(--color-warning)" },
  neutral: { bg: "var(--color-bg-soft)", fg: "var(--color-ink)" },
};

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

interface AvatarProps {
  name: string;
  tone?: StatusTone;
  size?: "sm" | "md";
}

export function Avatar({ name, tone = "neutral", size = "md" }: AvatarProps) {
  const { bg, fg } = TONE_STYLES[tone] ?? TONE_STYLES.neutral;
  const dimensions = size === "sm" ? "w-7 h-7 text-[11px]" : "w-8 h-8 text-xs";
  return (
    <div
      className={`${dimensions} rounded-full flex items-center justify-center font-bold shrink-0`}
      style={{ background: bg, color: fg }}
    >
      {initials(name)}
    </div>
  );
}
