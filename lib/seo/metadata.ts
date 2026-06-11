import type { Metadata } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://gaganmobilecare.com";

export function generateRepairsMetadata(): Metadata {
  return {
    title: "Phone Repair Prices in Patiala — All Brands | Gagan Mobile Hospital",
    description:
      "Transparent repair prices for iPhone, Samsung, OnePlus, Pixel and 12 more brands. Screen, battery, charging port, camera and more. Walk in or send by post.",
    alternates: { canonical: `${siteUrl}/repairs` },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: `${siteUrl}/repairs`,
      siteName: "Gagan Mobile Hospital",
      title: "Phone Repair Prices in Patiala — All Brands | Gagan Mobile Hospital",
      description:
        "Transparent repair prices for iPhone, Samsung, OnePlus, Pixel and 12 more brands.",
    },
  };
}

export function generateBrandRepairsMetadata(
  brandName: string,
  brandSlug: string
): Metadata {
  const title = `${brandName} Repair in Patiala — Screen, Battery & More | Gagan Mobile Hospital`;
  const description = `${brandName} repair prices in Patiala, Punjab. Screen replacement, battery swap, charging port, camera and more. Genuine parts, 6-month warranty.`;
  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}/repairs/${brandSlug}` },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: `${siteUrl}/repairs/${brandSlug}`,
      siteName: "Gagan Mobile Hospital",
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
  const title = `${brandName} ${issueName} in Patiala — from ₹${priceFrom.toLocaleString("en-IN")} | Gagan Mobile Hospital`;
  const description = `${brandName} ${issueName.toLowerCase()} in Patiala, Punjab. Genuine parts, 6-month warranty. Walk in or mail your phone from anywhere in India.`;
  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}/repairs/${brandSlug}/${issueSlug}` },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: `${siteUrl}/repairs/${brandSlug}/${issueSlug}`,
      siteName: "Gagan Mobile Hospital",
      title,
      description,
    },
  };
}

export function generateHomeMetadata(): Metadata {
  return {
    title: "Gagan Mobile Hospital — Phone Repair in Patiala, Punjab",
    description:
      "Cracked screen, dead battery, water damage? Walk in to our Patiala shop or mail your phone from anywhere in India. Free quote, genuine parts, 6-month warranty.",
    keywords: [
      "phone repair Patiala",
      "mobile repair Patiala",
      "iPhone repair Patiala",
      "Samsung repair Patiala",
      "screen replacement Patiala",
    ],
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: siteUrl,
      siteName: "Gagan Mobile Hospital",
      title: "Gagan Mobile Hospital — Phone Repair in Patiala, Punjab",
      description:
        "Cracked screen, dead battery, water damage? Walk in to our Patiala shop or mail your phone from anywhere in India. Free quote, genuine parts, 6-month warranty.",
    },
  };
}
