"use client";

import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PERIOD_TABS = [
  { id: "today", label: "Today" },
  { id: "week", label: "This week" },
  { id: "month", label: "This month" },
  { id: "last_month", label: "Last month" },
  { id: "custom", label: "Custom" },
] as const;

export function PeriodTabs({ period }: { period: string }) {
  const router = useRouter();

  return (
    <Tabs
      value={period}
      onValueChange={(value) => router.push(`/admin/earnings?period=${value}`)}
    >
      <TabsList variant="line" className="w-full justify-start overflow-x-auto">
        {PERIOD_TABS.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id} className="flex-none">
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
