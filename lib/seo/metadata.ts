import type { Metadata } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://gaganmobilecare.in";

export function generateRepairsMetadata(): Metadata {
  return {
    title: "Phone Repair Prices in Delhi — All Brands | Gagan Mobile Care",
    description:
      "Transparent repair prices for iPhone, Samsung, OnePlus, Pixel and 12 more brands. Screen, battery, charging port, camera and more. Walk in or send by post.",
    alternates: { canonical: `${siteUrl}/repairs` },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: `${siteUrl}/repairs`,
      siteName: "Gagan Mobile Care",
      title: "Phone Repair Prices in Delhi — All Brands | Gagan Mobile Care",
      description:
        "Transparent repair prices for iPhone, Samsung, OnePlus, Pixel and 12 more brands.",
    },
  };
}

export function generateBrandRepairsMetadata(
  brandName: string,
  brandSlug: string
): Metadata {
  const title = `${brandName} Repair in Delhi — Screen, Battery & More | Gagan Mobile Care`;
  const description = `${brandName} repair prices in Lajpat Nagar, Delhi. Screen replacement, battery swap, charging port, camera and more. Genuine parts, 6-month warranty.`;
  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}/repairs/${brandSlug}` },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: `${siteUrl}/repairs/${brandSlug}`,
      siteName: "Gagan Mobile Care",
      title,
      description,
    },
  };
}

export function generateRepairPageMetadata(
  brandName: string,
  brandSlug: string,
  issueName: string,
  issueSlug: string,
  priceFrom: number
): Metadata {
  const title = `${brandName} ${issueName} in Delhi — from ₹${priceFrom.toLocaleString("en-IN")} | Gagan Mobile Care`;
  const description = `${brandName} ${issueName.toLowerCase()} in Lajpat Nagar, Delhi. Genuine parts, 6-month warranty. Walk in or mail your phone from anywhere in India.`;
  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}/repairs/${brandSlug}/${issueSlug}` },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: `${siteUrl}/repairs/${brandSlug}/${issueSlug}`,
      siteName: "Gagan Mobile Care",
      title,
      description,
    },
  };
}

export function generateHomeMetadata(): Metadata {
  return {
    title: "Gagan Mobile Care — Phone Repair in Lajpat Nagar, Delhi",
    description:
      "Cracked screen, dead battery, water damage? Walk in to our Lajpat Nagar shop or mail your phone from anywhere in India. Free quote, genuine parts, 6-month warranty.",
    keywords: [
      "phone repair Delhi",
      "mobile repair Lajpat Nagar",
      "iPhone repair Delhi",
      "Samsung repair Delhi",
      "screen replacement Delhi",
    ],
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: siteUrl,
      siteName: "Gagan Mobile Care",
      title: "Gagan Mobile Care — Phone Repair in Lajpat Nagar, Delhi",
      description:
        "Cracked screen, dead battery, water damage? Walk in to our Lajpat Nagar shop or mail your phone from anywhere in India. Free quote, genuine parts, 6-month warranty.",
    },
  };
}
