import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import type { Database } from "@/lib/supabase/types";

function db() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export type Brand = Database["public"]["Tables"]["brands"]["Row"];
export type Issue = Database["public"]["Tables"]["issues"]["Row"];
export type GalleryImage = Database["public"]["Tables"]["gallery_images"]["Row"];
export type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"];

export const getBlogPosts = unstable_cache(
  async (): Promise<BlogPost[]> => {
    const { data } = await db()
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .is("deleted_at", null)
      .order("published_at", { ascending: false });
    return data ?? [];
  },
  ["blog-posts"],
  { revalidate: 600, tags: ["blog"] }
);

export const getBlogPostBySlug = unstable_cache(
  async (slug: string): Promise<BlogPost | null> => {
    const { data } = await db()
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .is("deleted_at", null)
      .single();
    return data ?? null;
  },
  ["blog-post-by-slug"],
  { revalidate: 600, tags: ["blog"] }
);

export const getAllBlogSlugs = unstable_cache(
  async (): Promise<string[]> => {
    const { data } = await db()
      .from("blog_posts")
      .select("slug")
      .eq("published", true)
      .is("deleted_at", null);
    return data?.map((p) => p.slug) ?? [];
  },
  ["blog-slugs"],
  { revalidate: 600, tags: ["blog"] }
);

export const getGalleryImages = unstable_cache(
  async (): Promise<GalleryImage[]> => {
    const { data } = await db()
      .from("gallery_images")
      .select("*")
      .is("deleted_at", null)
      .order("sort_order");
    return data ?? [];
  },
  ["gallery"],
  { revalidate: 300, tags: ["gallery"] }
);

export const getBrands = unstable_cache(
  async (): Promise<Brand[]> => {
    const { data, error } = await db()
      .from("brands")
      .select("*")
      .is("deleted_at", null)
      .order("sort_order");
    if (error) throw error;
    return data;
  },
  ["brands"],
  { revalidate: 3600, tags: ["catalog"] }
);

export const getBrandBySlug = unstable_cache(
  async (slug: string): Promise<Brand | null> => {
    const { data } = await db()
      .from("brands")
      .select("*")
      .eq("slug", slug)
      .is("deleted_at", null)
      .single();
    return data ?? null;
  },
  ["brand-by-slug"],
  { revalidate: 3600, tags: ["catalog"] }
);

export const getIssues = unstable_cache(
  async (): Promise<Issue[]> => {
    const { data, error } = await db()
      .from("issues")
      .select("*")
      .is("deleted_at", null)
      .order("sort_order");
    if (error) throw error;
    return data;
  },
  ["issues"],
  { revalidate: 3600, tags: ["catalog"] }
);

export const getIssueBySlug = unstable_cache(
  async (slug: string): Promise<Issue | null> => {
    const { data } = await db()
      .from("issues")
      .select("*")
      .eq("slug", slug)
      .is("deleted_at", null)
      .single();
    return data ?? null;
  },
  ["issue-by-slug"],
  { revalidate: 3600, tags: ["catalog"] }
);

export type ModelWithPrice = {
  id: string;
  name: string;
  slug: string;
  series: string | null;
  release_year: number | null;
  sort_order: number;
  price: number | null;
};

export const getModelsWithPrices = unstable_cache(
  async (brandSlug: string, issueSlug: string): Promise<ModelWithPrice[]> => {
    const client = db();

    const [{ data: brand }, { data: issue }] = await Promise.all([
      client.from("brands").select("id").eq("slug", brandSlug).is("deleted_at", null).single(),
      client.from("issues").select("id").eq("slug", issueSlug).is("deleted_at", null).single(),
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
      .in("model_id", models.map((m) => m.id))
      .eq("issue_id", issue.id)
      .is("deleted_at", null);

    const priceMap = new Map<string, number>();
    for (const p of prices ?? []) {
      priceMap.set(p.model_id, p.price);
    }

    return models.map((m) => ({ ...m, price: priceMap.get(m.id) ?? null }));
  },
  ["models-with-prices"],
  { revalidate: 3600, tags: ["catalog"] }
);

export const getAllBrandIssueSlugs = unstable_cache(
  async (): Promise<{ brand: string; issue: string }[]> => {
    const client = db();
    const [{ data: brands }, { data: issues }] = await Promise.all([
      client.from("brands").select("slug").is("deleted_at", null),
      client.from("issues").select("slug").is("deleted_at", null),
    ]);
    if (!brands || !issues) return [];
    return brands.flatMap((b) => issues.map((i) => ({ brand: b.slug, issue: i.slug })));
  },
  ["brand-issue-slugs"],
  { revalidate: 3600, tags: ["catalog"] }
);

export const getAllBrandSlugs = unstable_cache(
  async (): Promise<string[]> => {
    const { data } = await db()
      .from("brands")
      .select("slug")
      .is("deleted_at", null);
    return data?.map((b) => b.slug) ?? [];
  },
  ["brand-slugs"],
  { revalidate: 3600, tags: ["catalog"] }
);
