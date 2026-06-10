import type { MetadataRoute } from "next";
import { getAllBrandSlugs, getAllBrandIssueSlugs, getBlogPosts } from "@/lib/repairs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gaganmobilehospital.com";
  const now = new Date();

  const [brandSlugs, brandIssueSlugs, blogPosts] = await Promise.all([
    getAllBrandSlugs(),
    getAllBrandIssueSlugs(),
    getBlogPosts(),
  ]);

  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/repairs`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/gallery`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    ...blogPosts.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: new Date(post.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
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
