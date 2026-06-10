const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gaganmobilehospital.com";

const schema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${siteUrl}/#business`,
  name: "Gagan Mobile Hospital",
  description: "Mobile phone repair shop in Patiala, Punjab",
  url: siteUrl,
  image: `${siteUrl}/opengraph-image`,
  telephone: "+919814036114",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Village Baran, Sirhand Road, Near Reliance Pump",
    addressLocality: "Patiala",
    addressRegion: "Punjab",
    postalCode: "147004",
    addressCountry: "IN",
  },
  areaServed: [
    { "@type": "City", name: "Patiala" },
    { "@type": "Country", name: "India" },
  ],
  openingHours: ["Mo-Sa 10:00-21:00", "Su 11:00-19:00"],
  priceRange: "₹499 - ₹12999",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "2100",
  },
};

export function ServiceJsonLd({
  brandName,
  issueName,
  description,
  url,
  priceMin,
  priceMax,
}: {
  brandName: string;
  issueName: string;
  description?: string | null;
  url: string;
  priceMin: number;
  priceMax: number;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: `${brandName} ${issueName}`,
    name: `${brandName} ${issueName} Repair`,
    description:
      description ??
      `${brandName} ${issueName.toLowerCase()} repair in Patiala, Punjab. Genuine parts, 6-month warranty.`,
    url,
    provider: { "@id": `${siteUrl}/#business` },
    areaServed: [
      { "@type": "City", name: "Patiala" },
      { "@type": "Country", name: "India" },
    ],
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: priceMin,
      highPrice: Math.max(priceMin, priceMax),
      availability: "https://schema.org/InStock",
      url,
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

type BreadcrumbItem = { name: string; url: string };

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How long does a walk-in phone repair take in Patiala?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most repairs (screen, battery, charging port) are done in 90 minutes while you wait at our Patiala shop. Water damage and complex repairs may take 1–2 days.",
      },
    },
    {
      "@type": "Question",
      name: "Can I send my phone for repair from another city?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Speed Post your phone to Gagan Mobile Hospital in Patiala from anywhere in India. We repair it and return it cash on delivery in 4–6 days. No upfront payment required.",
      },
    },
    {
      "@type": "Question",
      name: "Does Gagan Mobile Hospital use genuine parts?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We use OEM-grade parts for all repairs. For Apple, Samsung, and OnePlus screens we offer two grades at different price points — both carry a 6-month warranty.",
      },
    },
    {
      "@type": "Question",
      name: "What is Gagan Mobile Hospital's no-fix no-fee policy?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "If we cannot repair your device, we return it free of charge along with a full diagnostic report. You pay nothing.",
      },
    },
    {
      "@type": "Question",
      name: "Where is Gagan Mobile Hospital located?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Gagan Mobile Hospital is located at Village Baran, Sirhand Road, Patiala, Punjab – 147004, near Reliance Pump, opposite Sonu Sweets, Leela Bhawan. Contact: +91 98140 36114.",
      },
    },
    {
      "@type": "Question",
      name: "What are the opening hours of Gagan Mobile Hospital?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Monday to Saturday: 10:00 AM – 9:00 PM. Sunday: 11:00 AM – 7:00 PM.",
      },
    },
    {
      "@type": "Question",
      name: "Which phone brands does Gagan Mobile Hospital repair?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We repair all major brands including Apple iPhone, Samsung, OnePlus, Google Pixel, Xiaomi, Redmi, Realme, OPPO, Vivo, Motorola, Nokia, Nothing, Poco, iQOO, and Tecno.",
      },
    },
  ],
};

export function HomeJsonLd() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
