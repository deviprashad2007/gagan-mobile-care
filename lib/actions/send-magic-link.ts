"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export type MagicLinkResult =
  | { success: true }
  | { success: false; error: string };

export async function sendMagicLink(data: unknown): Promise<MagicLinkResult> {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://gaganmobilecare.in";

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (error) {
    console.error("sendMagicLink error:", error);
    return { success: false, error: "Failed to send link. Please try again." };
  }

  return { success: true };
}
