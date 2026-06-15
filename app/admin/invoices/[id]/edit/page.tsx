import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getInvoiceById } from "@/lib/admin";
import { InvoiceForm } from "../../new/invoice-form";
import { PageHeader } from "@/components/admin/ui/page-header";

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
      <PageHeader title={`Edit invoice ${invoice.invoice_number}`} />
      <InvoiceForm invoice={invoice} />
    </div>
  );
}
