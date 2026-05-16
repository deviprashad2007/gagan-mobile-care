import type { Metadata } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://gaganmobilecare.in";

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
