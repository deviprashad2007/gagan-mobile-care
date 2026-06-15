import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { UsersManager } from "./users-manager";
import { PageHeader } from "@/components/admin/ui/page-header";

export const metadata = { title: "Users" };

export default async function UsersPage() {
  const authClient = await createClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) redirect("/admin/login");

  const supabase = createServiceClient();

  const { data: caller } = await supabase
    .from("admin_users")
    .select("role")
    .eq("email", user.email!)
    .is("deleted_at", null)
    .single();

  if (caller?.role !== "owner") redirect("/admin");

  const { data: adminUsers } = await supabase
    .from("admin_users")
    .select("*")
    .is("deleted_at", null)
    .order("created_at");

  return (
    <div className="px-4 md:px-8 py-6 max-w-2xl mx-auto">
      <PageHeader title="Users" subtitle="Only approved emails can log into the admin panel." />
      <UsersManager users={adminUsers ?? []} ownerEmail={user.email!} />
    </div>
  );
}
