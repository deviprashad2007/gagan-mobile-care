import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getRepairById } from "@/lib/admin";
import { InvoiceForm } from "./invoice-form";

type Props = { searchParams: Promise<{ repairId?: string }> };

export default async function NewInvoicePage({ searchParams }: Props) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { repairId } = await searchParams;
  const repair = repairId ? await getRepairById(repairId) : null;

  return (
    <div className="px-4 md:px-8 py-6 max-w-2xl mx-auto">
      <h1 className="font-serif text-2xl md:text-3xl tracking-tight text-[var(--color-ink)] mb-5">
        New invoice
      </h1>
      <InvoiceForm repair={repair} />
    </div>
  );
}
