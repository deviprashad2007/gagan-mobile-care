import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { GalleryManager } from "./gallery-manager";

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
      <h1 className="font-serif text-2xl md:text-3xl tracking-tight text-[var(--color-ink)] mb-1">
        Gallery
      </h1>
      <p className="text-sm text-[var(--color-ink-3)] mb-6">
        Photos shown on the homepage. Upload shots of your shop, team, and repairs.
      </p>
      <GalleryManager images={images ?? []} />
    </div>
  );
}
