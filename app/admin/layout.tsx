import type { Metadata } from "next";
import { AdminNav } from "@/components/admin/admin-nav";

export const metadata: Metadata = {
  title: { default: "Admin — Gagan Mobile Care", template: "%s — GMC Admin" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-bg-soft)]">
      <AdminNav />
      {/* Offset for desktop sidebar and mobile bottom nav */}
      <div className="md:ml-56 pb-20 md:pb-0">
        {children}
      </div>
    </div>
  );
}
