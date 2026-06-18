"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { MonthlyBar } from "@/lib/admin";

const chartConfig = {
  total: {
    label: "Revenue",
    color: "var(--color-accent)",
  },
} satisfies ChartConfig;

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

export function RevenueChart({ data }: { data: MonthlyBar[] }) {
  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-[220px] w-full">
      <BarChart data={data} margin={{ left: 0, right: 0 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value: string) => value.split(" ")[0]}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(_, payload) => payload?.[0]?.payload?.month}
              formatter={(value) => [fmt(Number(value)), " Revenue"]}
            />
          }
        />
        <Bar dataKey="total" fill="var(--color-total)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}
