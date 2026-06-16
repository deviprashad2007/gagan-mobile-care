import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

export type Booking = Database["public"]["Tables"]["bookings"]["Row"];
export type Repair = Database["public"]["Tables"]["repairs"]["Row"];
export type Invoice = Database["public"]["Tables"]["invoices"]["Row"];

export async function getAdminStats() {
  const supabase = await createClient();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [
    { count: newBookings },
    { count: workingRepairs },
    { count: readyRepairs },
    { data: todayInvoices },
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
      .from("invoices")
      .select("total")
      .is("deleted_at", null)
      .gte("created_at", todayStart.toISOString()),
  ]);

  return {
    newBookings: newBookings ?? 0,
    workingRepairs: workingRepairs ?? 0,
    readyRepairs: readyRepairs ?? 0,
    todayEarnings: todayInvoices?.reduce((s, i) => s + i.total, 0) ?? 0,
  };
}

export async function getEarningsStats() {
  const supabase = await createClient();
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    { data: todayInvoices },
    { data: monthInvoices },
    { data: allInvoices },
    { data: repairs },
    { data: invoiceLinks },
  ] = await Promise.all([
    supabase
      .from("invoices")
      .select("total")
      .is("deleted_at", null)
      .gte("created_at", todayStart.toISOString()),
    supabase
      .from("invoices")
      .select("total")
      .is("deleted_at", null)
      .gte("created_at", monthStart.toISOString()),
    supabase.from("invoices").select("total").is("deleted_at", null),
    supabase
      .from("repairs")
      .select("id, repair_ref, customer_name, customer_phone, issue_text, amount, status")
      .is("deleted_at", null)
      .neq("status", "picked")
      .order("intake_at", { ascending: false }),
    supabase.from("invoices").select("repair_id").is("deleted_at", null).not("repair_id", "is", null),
  ]);

  const billedRepairIds = new Set((invoiceLinks ?? []).map((i) => i.repair_id));
  const pendingRepairs = (repairs ?? []).filter((r) => !billedRepairIds.has(r.id));

  const sum = (rows: { total: number }[] | null) => (rows ?? []).reduce((s, r) => s + r.total, 0);

  return {
    today: sum(todayInvoices),
    month: sum(monthInvoices),
    allTime: sum(allInvoices),
    pendingRepairs,
    pendingTotal: pendingRepairs.reduce((s, r) => s + (r.amount ?? 0), 0),
  };
}

export async function getInvoicesByDateRange(from: string, to: string) {
  const supabase = await createClient();
  const fromDate = new Date(from);
  fromDate.setHours(0, 0, 0, 0);
  const toDate = new Date(to);
  toDate.setHours(23, 59, 59, 999);

  const { data } = await supabase
    .from("invoices")
    .select("*")
    .is("deleted_at", null)
    .gte("created_at", fromDate.toISOString())
    .lte("created_at", toDate.toISOString())
    .order("created_at", { ascending: false });

  const invoices = data ?? [];
  return {
    invoices,
    total: invoices.reduce((s, i) => s + i.total, 0),
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
  const bookings = data ?? [];

  const issueNames = await getIssueNamesMap();
  return bookings.map((b) => ({
    ...b,
    issue_names: b.issue_ids.map((id) => issueNames.get(id)).filter((n): n is string => !!n),
  }));
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

export async function getIssueNamesMap() {
  const supabase = await createClient();
  const { data } = await supabase.from("issues").select("id, name");
  return new Map((data ?? []).map((i) => [i.id, i.name]));
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
  const bookings = data ?? [];

  const issueNames = await getIssueNamesMap();
  return bookings.map((b) => ({
    ...b,
    issue_names: b.issue_ids.map((id) => issueNames.get(id)).filter((n): n is string => !!n),
  }));
}

export async function getBookingById(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("bookings")
    .select("*, model:model_id(name, release_year)")
    .eq("id", id)
    .is("deleted_at", null)
    .single();
  if (!data) return null;

  const issueNames = await getIssueNamesMap();
  return {
    ...data,
    issue_names: data.issue_ids.map((id) => issueNames.get(id)).filter((n): n is string => !!n),
  };
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

export async function getRepairByBookingId(bookingId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("repairs")
    .select("id, repair_ref, status")
    .eq("booking_id", bookingId)
    .is("deleted_at", null)
    .maybeSingle();
  return data;
}

export async function getRepairById(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("repairs")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .single();
  return data;
}

export async function getInvoices() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("invoices")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(100);
  return data ?? [];
}

export async function getInvoiceById(id: string) {
  const supabase = await createClient();
  const { data: invoice } = await supabase
    .from("invoices")
    .select("*, repairs(booking_id, bookings(booking_ref))")
    .eq("id", id)
    .is("deleted_at", null)
    .single();
  if (!invoice) return null;
  // Flatten the nested booking_ref for easy access
  const repairs = invoice.repairs as { booking_id: string | null; bookings: { booking_ref: string } | null } | null;
  const bookingRef: string | null = repairs?.bookings?.booking_ref ?? null;
  return { ...invoice, bookingRef };
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
