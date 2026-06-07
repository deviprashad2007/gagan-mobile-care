import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { AdminNav } from "@/components/admin/admin-nav";

export const metadata: Metadata = {
  title: { default: "Admin — Gagan Mobile Hospital", template: "%s — GMH Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let role: "owner" | "staff" | null = null;

  try {
    const authClient = await createClient();
    const { data: { user } } = await authClient.auth.getUser();
    if (user?.email) {
      const supabase = createServiceClient();
      const { data } = await supabase
        .from("admin_users")
        .select("role")
        .eq("email", user.email)
        .is("deleted_at", null)
        .single();
      role = (data?.role as "owner" | "staff") ?? null;
    }
  } catch {
    // Layout renders even on /admin/login and /admin/denied — ignore auth errors
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-soft)]">
      <AdminNav role={role} />
      <div className="md:ml-56 pb-20 md:pb-0">
        {children}
      </div>
    </div>
  );
}
