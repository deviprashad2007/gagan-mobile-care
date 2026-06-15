import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getRepairs } from "@/lib/admin";
import { RepairsBoard } from "./repairs-board";
import { PageHeader } from "@/components/admin/ui/page-header";

export default async function RepairsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const repairs = await getRepairs();
  return (
    <div className="px-4 md:px-8 py-6 max-w-6xl mx-auto">
      <PageHeader title="Repairs" />
      <RepairsBoard initialRepairs={repairs} />
    </div>
  );
}
