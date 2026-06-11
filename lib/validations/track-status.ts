import { z } from "zod";

export const trackStatusSchema = z.object({
  query: z
    .string()
    .trim()
    .min(4, "Enter your booking code or 10-digit mobile number")
    .max(20, "That doesn't look like a valid code or number"),
  // Honeypot: a hidden field real users never fill in.
  website: z.string().max(0).optional(),
});

export type TrackStatusInput = z.infer<typeof trackStatusSchema>;
