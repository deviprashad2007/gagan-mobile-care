import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCatalog } from "@/lib/admin";
import { CatalogEditor } from "./catalog-editor";

export default async function CatalogPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { brands, issues, models, prices } = await getCatalog();

  return (
    <div className="px-4 md:px-8 py-6 max-w-6xl mx-auto">
      <h1 className="font-serif text-2xl md:text-3xl tracking-tight text-[var(--color-ink)] mb-2">
        Catalog
      </h1>
      <p className="text-sm text-[var(--color-ink-3)] mb-5">
        Edit repair prices. Select a brand on the left, then tap any price cell to update it.
      </p>
      <CatalogEditor brands={brands} issues={issues} models={models} prices={prices} />
    </div>
  );
}
