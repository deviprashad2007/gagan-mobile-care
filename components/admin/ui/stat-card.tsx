import { Card, CardHeader, CardDescription, CardTitle, CardAction, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

const TONE_VALUE_COLOR: Record<StatusTone, string> = {
  accent: "var(--color-accent)",
  success: "var(--color-success)",
  info: "var(--color-info)",
  warning: "var(--color-warning)",
  neutral: "var(--color-ink)",
};

export function StatCard({ label, value, sub, icon, tone = "neutral", trend }: StatCardProps) {
  return (
    <Card className="@container/card gap-3 rounded-2xl bg-linear-to-t from-primary/5 to-card shadow-xs dark:bg-card">
      <CardHeader>
        <CardDescription className="flex items-center gap-1.5">
          <span className="opacity-70 [&_svg]:size-3.5">{icon}</span>
          {label}
        </CardDescription>
        <CardTitle
          className="text-2xl font-semibold tabular-nums @[180px]/card:text-3xl"
          style={{ color: TONE_VALUE_COLOR[tone] }}
        >
          {value}
        </CardTitle>
        {trend && (
          <CardAction>
            <Badge
              variant="outline"
              className={
                trend.direction === "up"
                  ? "text-[var(--color-success)] border-[var(--color-success)]/30"
                  : "text-[var(--color-accent)] border-[var(--color-accent)]/30"
              }
            >
              {trend.direction === "up" ? "↑" : "↓"} {trend.value}
            </Badge>
          </CardAction>
        )}
      </CardHeader>
      {sub && (
        <CardFooter className="border-t-0 bg-transparent p-0 px-4 pb-4 text-xs text-muted-foreground line-clamp-1">
          {sub}
        </CardFooter>
      )}
    </Card>
  );
}
