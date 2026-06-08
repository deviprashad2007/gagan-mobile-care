import Nav from "@/components/marketing/nav";
import Footer from "@/components/marketing/footer";
import { BookingProvider } from "@/components/marketing/booking-provider";
import { getBrands, getIssues, getModels } from "@/lib/repairs";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [brands, issues, models] = await Promise.all([
    getBrands(),
    getIssues(),
    getModels(),
  ]);

  return (
    <BookingProvider brands={brands} issues={issues} models={models}>
      <Nav />
      {children}
      <Footer />
    </BookingProvider>
  );
}
