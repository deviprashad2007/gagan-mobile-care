import { Card, CardContent } from "@/components/ui/card";
import type { StatusTone } from "./status-pill";

interface StatCardTrend {
  direction: "up" | "down";
  value: string;
}

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  sub?: string;
  icon: React.ReactNode;
  tone?: StatusTone;
  trend?: StatCardTrend;
}

const ICON_TONE_STYLES: Record<StatusTone, { bg: string; fg: string }> = {
  accent: { bg: "var(--color-accent-soft)", fg: "var(--color-accent)" },
  success: { bg: "color-mix(in srgb, var(--color-success) 14%, transparent)", fg: "var(--color-success)" },
  info: { bg: "color-mix(in srgb, var(--color-info) 14%, transparent)", fg: "var(--color-info)" },
  warning: { bg: "color-mix(in srgb, var(--color-warning) 14%, transparent)", fg: "var(--color-warning)" },
  neutral: { bg: "var(--color-bg-soft)", fg: "var(--color-ink-3)" },
};

export function StatCard({ label, value, sub, icon, tone = "neutral", trend }: StatCardProps) {
  const iconStyle = ICON_TONE_STYLES[tone] ?? ICON_TONE_STYLES.neutral;

  return (
    <Card className="rounded-2xl p-4 gap-0 overflow-hidden transition-colors hover:ring-[var(--color-ink-4)]">
      <CardContent className="p-0">
        <div className="flex items-start justify-between mb-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: iconStyle.bg, color: iconStyle.fg }}
          >
            {icon}
          </div>
          {trend && (
            <span
              className={`inline-flex items-center gap-0.5 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                trend.direction === "up"
                  ? "text-[var(--color-success)] bg-[color-mix(in_srgb,var(--color-success)_14%,transparent)]"
                  : "text-[var(--color-accent)] bg-[var(--color-accent-soft)]"
              }`}
            >
              {trend.direction === "up" ? "↑" : "↓"} {trend.value}
            </span>
          )}
        </div>
        <p
          className="font-serif text-2xl md:text-3xl leading-none tracking-tight truncate"
          style={{ color: tone === "accent" ? "var(--color-accent)" : "var(--color-ink)" }}
        >
          {value}
        </p>
        <p className="text-xs text-[var(--color-ink-3)] mt-1.5 truncate">{label}</p>
        {sub && <p className="text-[11px] text-[var(--color-ink-4)] mt-0.5 truncate">{sub}</p>}
      </CardContent>
    </Card>
  );
}
