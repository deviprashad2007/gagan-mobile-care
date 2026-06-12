import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getInvoiceById } from "@/lib/admin";
import { InvoiceForm } from "../../new/invoice-form";

type Props = { params: Promise<{ id: string }> };

export default async function EditInvoicePage({ params }: Props) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { id } = await params;
  const invoice = await getInvoiceById(id);
  if (!invoice) notFound();

  return (
    <div className="px-4 md:px-8 py-6 max-w-2xl mx-auto">
      <h1 className="font-serif text-2xl md:text-3xl tracking-tight text-[var(--color-ink)] mb-5">
        Edit invoice {invoice.invoice_number}
      </h1>
      <InvoiceForm invoice={invoice} />
    </div>
  );
}
