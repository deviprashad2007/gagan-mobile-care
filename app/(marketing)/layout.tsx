import Nav from "@/components/marketing/nav";
import Footer from "@/components/marketing/footer";
import { BookingProvider } from "@/components/marketing/booking-provider";
import { getBrands, getCategories, getIssues, getModels } from "@/lib/repairs";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [brands, issues, models, categories] = await Promise.all([
    getBrands(),
    getIssues(),
    getModels(),
    getCategories(),
  ]);

  return (
    <BookingProvider brands={brands} issues={issues} models={models} categories={categories}>
      <Nav />
      {children}
      <Footer />
    </BookingProvider>
  );
}
