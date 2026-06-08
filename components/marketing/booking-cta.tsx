"use client";

import { useOpenBooking } from "./booking-provider";

interface Props {
  className?: string;
  children: React.ReactNode;
}

export function BookingCta({ className, children }: Props) {
  const openBooking = useOpenBooking();

  return (
    <button type="button" onClick={openBooking} className={className}>
      {children}
    </button>
  );
}
