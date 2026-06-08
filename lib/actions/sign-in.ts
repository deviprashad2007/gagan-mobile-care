"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});

export type SignInResult =
  | { success: true }
  | { success: false; error: string };

export async function signIn(data: unknown): Promise<SignInResult> {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
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
