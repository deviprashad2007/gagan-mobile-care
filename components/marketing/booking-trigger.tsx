"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import type { Brand, Issue } from "@/lib/repairs";
import { BookingFlow } from "./booking-flow";

interface Props {
  brands: Brand[];
  issues: Issue[];
  children?: React.ReactNode;
  className?: string;
}

export function BookingTrigger({ brands, issues, children, className }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className={className}>
        {children ?? "Book a repair"}
      </button>

      <AnimatePresence>
        {open && (
          <BookingFlow
            brands={brands}
            issues={issues}
            onClose={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
