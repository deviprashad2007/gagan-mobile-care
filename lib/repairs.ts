import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

function db() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export type Brand = Database["public"]["Tables"]["brands"]["Row"];
export type Issue = Database["public"]["Tables"]["issues"]["Row"];

export async function getBrands(): Promise<Brand[]> {
  const { data, error } = await db()
    .from("brands")
    .select("*")
    .is("deleted_at", null)
    .order("sort_order");
  if (error) throw error;
  return data;
}

export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  const { data } = await db()
    .from("brands")
    .select("*")
    .eq("slug", slug)
    .is("deleted_at", null)
    .single();
  return data ?? null;
}

export async function getIssues(): Promise<Issue[]> {
  const { data, error } = await db()
    .from("issues")
    .select("*")
    .is("deleted_at", null)
    .order("sort_order");
  if (error) throw error;
  return data;
}

export async function getIssueBySlug(slug: string): Promise<Issue | null> {
  const { data } = await db()
    .from("issues")
    .select("*")
    .eq("slug", slug)
    .is("deleted_at", null)
    .single();
  return data ?? null;
}

export type ModelWithPrice = {
  id: string;
  name: string;
  slug: string;
  series: string | null;
  release_year: number | null;
  sort_order: number;
  price: number | null;
};

export async function getModelsWithPrices(
  brandSlug: string,
  issueSlug: string
): Promise<ModelWithPrice[]> {
  const client = db();

  const [{ data: brand }, { data: issue }] = await Promise.all([
    client
      .from("brands")
      .select("id")
      .eq("slug", brandSlug)
      .is("deleted_at", null)
      .single(),
    client
      .from("issues")
      .select("id")
      .eq("slug", issueSlug)
      .is("deleted_at", null)
      .single(),
  ]);

  if (!brand || !issue) return [];

  const { data: models } = await client
    .from("models")
    .select("id, name, slug, series, release_year, sort_order")
    .eq("brand_id", brand.id)
    .is("deleted_at", null)
    .order("sort_order");

  if (!models?.length) return [];

  const { data: prices } = await client
    .from("prices")
    .select("model_id, price")
    .in(
      "model_id",
      models.map((m) => m.id)
    )
    .eq("issue_id", issue.id)
    .is("deleted_at", null);

  const priceMap = new Map<string, number>();
  for (const p of prices ?? []) {
    priceMap.set(p.model_id, p.price);
  }

  return models.map((m) => ({
    ...m,
    price: priceMap.get(m.id) ?? null,
  }));
}

export async function getAllBrandIssueSlugs(): Promise<
  { brand: string; issue: string }[]
> {
  const client = db();
  const [{ data: brands }, { data: issues }] = await Promise.all([
    client.from("brands").select("slug").is("deleted_at", null),
    client.from("issues").select("slug").is("deleted_at", null),
  ]);
  if (!brands || !issues) return [];
  return brands.flatMap((b) => issues.map((i) => ({ brand: b.slug, issue: i.slug })));
}

export async function getAllBrandSlugs(): Promise<string[]> {
  const { data } = await db()
    .from("brands")
    .select("slug")
    .is("deleted_at", null);
  return data?.map((b) => b.slug) ?? [];
}
