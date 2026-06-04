import type { MetadataRoute } from "next";
import { getAllBrandSlugs, getAllBrandIssueSlugs } from "@/lib/repairs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gaganmobilecare.in";
  const now = new Date();

  const [brandSlugs, brandIssueSlugs] = await Promise.all([
    getAllBrandSlugs(),
    getAllBrandIssueSlugs(),
  ]);

  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/repairs`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    ...brandSlugs.map((slug) => ({
      url: `${base}/repairs/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...brandIssueSlugs.map(({ brand, issue }) => ({
      url: `${base}/repairs/${brand}/${issue}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
