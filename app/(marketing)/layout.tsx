import Nav from "@/components/marketing/nav";
import Footer from "@/components/marketing/footer";
import { BookingProvider } from "@/components/marketing/booking-provider";
import { getAllPrices, getBrands, getCategories, getIssues, getModels } from "@/lib/repairs";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [brands, issues, models, categories, prices] = await Promise.all([
    getBrands(),
    getIssues(),
    getModels(),
    getCategories(),
    getAllPrices(),
  ]);

  return (
    <BookingProvider brands={brands} issues={issues} models={models} categories={categories} prices={prices}>
      <Nav />
      {children}
      <Footer />
    </BookingProvider>
  );
}
