const schema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Gagan Mobile Care",
  description: "Mobile phone repair shop in Lajpat Nagar, Delhi",
  telephone: "+919811200410",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Shop 14, Lajpat Nagar Central Market",
    addressLocality: "New Delhi",
    postalCode: "110024",
    addressCountry: "IN",
  },
  openingHours: "Mo-Sa 10:00-20:00",
  priceRange: "₹499 - ₹12999",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "2143",
  },
};

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

export function HomeJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
