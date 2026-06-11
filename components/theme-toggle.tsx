"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
}

/** Toggles between light and dark theme. Renders a neutral placeholder until mounted to avoid hydration mismatch. */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={
        className ??
        "flex items-center justify-center w-10 h-10 rounded-xl border border-[var(--color-line)] bg-[var(--color-bg-card)] text-[var(--color-ink)] hover:border-[var(--color-accent)] transition-colors cursor-pointer"
      }
    >
      {mounted && (isDark ? <Sun size={18} /> : <Moon size={18} />)}
    </button>
  );
}
