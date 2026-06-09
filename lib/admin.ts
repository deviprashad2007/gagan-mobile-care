import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

export type Booking = Database["public"]["Tables"]["bookings"]["Row"];
export type Repair = Database["public"]["Tables"]["repairs"]["Row"];

export async function getAdminStats() {
  const supabase = await createClient();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [
    { count: newBookings },
    { count: workingRepairs },
    { count: readyRepairs },
    { data: pickedToday },
  ] = await Promise.all([
    supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("status", "new")
      .is("deleted_at", null),
    supabase
      .from("repairs")
      .select("*", { count: "exact", head: true })
      .eq("status", "working")
      .is("deleted_at", null),
    supabase
      .from("repairs")
      .select("*", { count: "exact", head: true })
      .eq("status", "ready")
      .is("deleted_at", null),
    supabase
      .from("repairs")
      .select("amount")
      .eq("status", "picked")
      .is("deleted_at", null)
      .gte("completed_at", todayStart.toISOString()),
  ]);

  return {
    newBookings: newBookings ?? 0,
    workingRepairs: workingRepairs ?? 0,
    readyRepairs: readyRepairs ?? 0,
    todayEarnings: pickedToday?.reduce((s, r) => s + (r.amount ?? 0), 0) ?? 0,
  };
}

export async function getNewBookings(limit = 8) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("bookings")
    .select("*")
    .eq("status", "new")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getReadyRepairs(limit = 8) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("repairs")
    .select("*")
    .eq("status", "ready")
    .is("deleted_at", null)
    .order("intake_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getBookings(status?: string) {
  const supabase = await createClient();
  let query = supabase
    .from("bookings")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(100);
  if (status && status !== "all") query = query.eq("status", status);
  const { data } = await query;
  return data ?? [];
}

export async function getBookingById(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("bookings")
    .select("*, model:model_id(name, release_year)")
    .eq("id", id)
    .is("deleted_at", null)
    .single();
  return data ?? null;
}

export async function getRepairs() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("repairs")
    .select("*")
    .is("deleted_at", null)
    .order("intake_at", { ascending: false })
    .limit(200);
  return data ?? [];
}

export async function getCatalog() {
  const supabase = await createClient();
  const [{ data: brands }, { data: issues }, { data: models }, { data: prices }] =
    await Promise.all([
      supabase
        .from("brands")
        .select("*")
        .is("deleted_at", null)
        .order("sort_order"),
      supabase
        .from("issues")
        .select("*")
        .is("deleted_at", null)
        .order("sort_order"),
      supabase
        .from("models")
        .select("*")
        .is("deleted_at", null)
        .order("brand_id, sort_order"),
      supabase
        .from("prices")
        .select("*")
        .is("deleted_at", null),
    ]);
  return {
    brands: brands ?? [],
    issues: issues ?? [],
    models: models ?? [],
    prices: prices ?? [],
  };
}
