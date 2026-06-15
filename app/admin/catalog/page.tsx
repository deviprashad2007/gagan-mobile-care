import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCatalog } from "@/lib/admin";
import { getCategories } from "@/lib/repairs";
import { CatalogEditor } from "./catalog-editor";
import { PageHeader } from "@/components/admin/ui/page-header";

export default async function CatalogPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const [{ brands, issues, models, prices }, categories] = await Promise.all([
    getCatalog(),
    getCategories(),
  ]);

  return (
    <div className="px-4 md:px-8 py-6 max-w-6xl mx-auto">
      <PageHeader title="Catalog" subtitle="Pick a device, then a brand, then tap any price cell to update it." />
      <CatalogEditor categories={categories} brands={brands} issues={issues} models={models} prices={prices} />
    </div>
  );
}
