"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/utils/rate-limit";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});

export type SignInResult =
  | { success: true }
  | { success: false; error: string };

const TOO_MANY_ATTEMPTS = "Too many login attempts. Please wait a while and try again.";

export async function signIn(data: unknown): Promise<SignInResult> {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  // Rate limit by IP and by email separately: 5 attempts per 15 minutes each.
  // This blocks both a single attacker hammering many accounts and distributed
  // attempts against one admin account, without locking the account out forever.
  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() || hdrs.get("x-real-ip") || "unknown";
  const email = parsed.data.email.toLowerCase();
  const windowMs = 15 * 60 * 1000;

  if (!rateLimit(`login-ip:${ip}`, 5, windowMs) || !rateLimit(`login-email:${email}`, 5, windowMs)) {
    return { success: false, error: TOO_MANY_ATTEMPTS };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    console.error("signIn error:", error);
    if (error.code === "invalid_credentials") {
      return { success: false, error: "Incorrect email or password." };
    }
    return { success: false, error: "Failed to sign in. Please try again." };
  }

  return { success: true };
}
