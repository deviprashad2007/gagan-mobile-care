"use client";

import { createContext, useContext, useState } from "react";
import { AnimatePresence } from "motion/react";
import type { Brand, Category, Issue, Model, PriceEntry } from "@/lib/repairs";
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
  categories: Category[];
  prices: PriceEntry[];
  children: React.ReactNode;
}

export function BookingProvider({ brands, issues, models, categories, prices, children }: Props) {
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
            categories={categories}
            prices={prices}
            onClose={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </BookingContext.Provider>
  );
}
