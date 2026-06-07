import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { UsersManager } from "./users-manager";

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
      <h1 className="font-serif text-2xl md:text-3xl tracking-tight text-[var(--color-ink)] mb-1">
        Users
      </h1>
      <p className="text-sm text-[var(--color-ink-3)] mb-6">
        Only approved emails can log into the admin panel.
      </p>
      <UsersManager users={adminUsers ?? []} ownerEmail={user.email!} />
    </div>
  );
}
