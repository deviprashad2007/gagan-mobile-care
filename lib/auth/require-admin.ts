import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export type AdminUser = { email: string; role: "owner" | "staff" };

export type RequireAdminResult =
  | { ok: true; user: AdminUser }
  | { ok: false; error: "Unauthorized." };

/**
 * Confirms the caller has a valid session AND is in the admin_users allowlist.
 * Server actions must use this — middleware only gates page navigation, not
 * direct invocation of the action endpoint.
 */
export async function requireAdmin(): Promise<RequireAdminResult> {
  const authClient = await createClient();
  const { data: { session } } = await authClient.auth.getSession();
  const email = session?.user?.email;
  if (!email) return { ok: false, error: "Unauthorized." };

  const supabase = createServiceClient();
  const { data: admin } = await supabase
    .from("admin_users")
    .select("email, role")
    .eq("email", email)
    .is("deleted_at", null)
    .single();

  if (!admin) return { ok: false, error: "Unauthorized." };
  return { ok: true, user: admin as AdminUser };
}
