import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import type { Brand, Category } from "@/lib/repairs";
import { BrandsManager } from "./brands-manager";
import { PageHeader } from "@/components/admin/ui/page-header";

export default async function BrandsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const db = createServiceClient();
  const [{ data: categories }, { data: brands }] = await Promise.all([
    db.from("categories").select("*").is("deleted_at", null).order("sort_order"),
    db.from("brands").select("*").is("deleted_at", null).order("sort_order"),
  ]);

  return (
    <div className="px-4 md:px-8 py-6 max-w-5xl mx-auto">
      <PageHeader title="Brands & Categories" subtitle="Manage device categories, brands, and upload logos." />
      <BrandsManager
        categories={(categories ?? []) as Category[]}
        brands={(brands ?? []) as Brand[]}
      />
    </div>
  );
}
