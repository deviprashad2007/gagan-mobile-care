import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getBookingById } from "@/lib/admin";
import { BookingStatusForm } from "./booking-status-form";

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

type Props = { params: Promise<{ id: string }> };

export default async function BookingDetailPage({ params }: Props) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { id } = await params;
  const booking = await getBookingById(id);
  if (!booking) notFound();

  const createdAt = new Date(booking.created_at).toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  return (
    <div className="px-4 md:px-8 py-6 max-w-2xl mx-auto">
      <nav className="flex items-center gap-2 text-xs text-[var(--color-ink-3)] mb-5">
        <Link href="/admin/bookings" className="hover:text-[var(--color-ink)] transition-colors">
          Bookings
        </Link>
        <span>/</span>
        <span className="font-mono text-[var(--color-ink)]">{booking.booking_ref}</span>
      </nav>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl tracking-tight text-[var(--color-ink)]">
            {booking.customer_name}
          </h1>
          <p className="font-mono text-sm text-[var(--color-ink-3)] mt-0.5">{booking.customer_phone}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <a
            href={`tel:+91${booking.customer_phone}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium bg-[var(--color-ink)] text-white rounded-full px-4 py-2 hover:opacity-90 transition-opacity"
          >
            Call
          </a>
          <a
            href={`https://wa.me/91${booking.customer_phone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium bg-[#25D366] text-white rounded-full px-4 py-2 hover:opacity-90 transition-opacity"
          >
            WA
          </a>
        </div>
      </div>

      {/* Details card */}
      <div className="bg-white border border-[var(--color-line)] rounded-2xl p-5 space-y-4 mb-4">
        <Row label="Booking ref" value={<span className="font-mono">{booking.booking_ref}</span>} />
        <Row label="Service" value={booking.service_type === "post" ? "📦 Send by post" : "🏪 Walk-in"} />
        <Row
          label="Estimate"
          value={
            booking.estimated_price_min
              ? `${fmt(booking.estimated_price_min)} – ${fmt(booking.estimated_price_max ?? booking.estimated_price_min)}`
              : "—"
          }
        />
        {booking.confirmed_price && (
          <Row label="Confirmed price" value={fmt(booking.confirmed_price)} />
        )}
        <Row label="Booked at" value={createdAt} />
        <Row label="Source" value={booking.source} />
        {booking.notes && <Row label="Notes" value={booking.notes} />}
      </div>

      {/* Status update */}
      <BookingStatusForm booking={booking} />
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="text-[var(--color-ink-3)] shrink-0 w-32">{label}</span>
      <span className="text-[var(--color-ink)] text-right">{value}</span>
    </div>
  );
}
