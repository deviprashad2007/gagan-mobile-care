"use client";

import { createContext, useContext, useState } from "react";
import { AnimatePresence } from "motion/react";
import type { Brand, Issue, Model } from "@/lib/repairs";
import { BookingFlow } from "./booking-flow";

const BookingContext = createContext<(() => void) | null>(null);

export function useOpenBooking() {
  const open = useContext(BookingContext);
  if (!open) throw new Error("useOpenBooking must be used within BookingProvider");
  return open;
}

interface Props {
  brands: Brand[];
  issues: Issue[];
  models: Model[];
  children: React.ReactNode;
}

export function BookingProvider({ brands, issues, models, children }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <BookingContext.Provider value={() => setOpen(true)}>
      {children}
      <AnimatePresence>
        {open && (
          <BookingFlow
            brands={brands}
            issues={issues}
            models={models}
            onClose={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </BookingContext.Provider>
  );
}
