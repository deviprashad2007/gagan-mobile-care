import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getRepairs } from "@/lib/admin";
import { RepairsBoard } from "./repairs-board";

export default async function RepairsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const repairs = await getRepairs();
  return (
    <div className="px-4 md:px-8 py-6 max-w-6xl mx-auto">
      <h1 className="font-serif text-2xl md:text-3xl tracking-tight text-[var(--color-ink)] mb-5">
        Repairs
      </h1>
      <RepairsBoard initialRepairs={repairs} />
    </div>
  );
}
