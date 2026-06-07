"use client";

import { motion } from "motion/react";
import type { ReactNode, CSSProperties } from "react";

interface FloatCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Stagger the float cycle so stacked cards don't move in lockstep. */
  delay?: number;
}

/** Decorative card that drifts gently up and down, lifting on hover. */
export function FloatCard({ children, className, style, delay = 0 }: FloatCardProps) {
  return (
    <motion.div
      className={className}
      style={style}
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay }}
      whileHover={{ scale: 1.04, transition: { duration: 0.25 } }}
    >
      {children}
    </motion.div>
  );
}
