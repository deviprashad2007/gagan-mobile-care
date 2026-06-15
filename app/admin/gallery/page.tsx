import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { GalleryManager } from "./gallery-manager";
import { PageHeader } from "@/components/admin/ui/page-header";

export const metadata = { title: "Gallery" };

export default async function GalleryPage() {
  const authClient = await createClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) redirect("/admin/login");

  const supabase = createServiceClient();
  const { data: images } = await supabase
    .from("gallery_images")
    .select("*")
    .is("deleted_at", null)
    .order("sort_order");

  return (
    <div className="px-4 md:px-8 py-6 max-w-2xl mx-auto">
      <PageHeader title="Gallery" subtitle="Photos shown on the homepage. Upload shots of your shop, team, and repairs." />
      <GalleryManager images={images ?? []} />
    </div>
  );
}
