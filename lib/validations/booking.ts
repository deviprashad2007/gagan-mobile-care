import { z } from "zod";

export const bookingSchema = z.object({
  brandId: z.string().uuid(),
  brandName: z.string().min(1).max(100),
  modelId: z.string().uuid().optional(),
  modelText: z.string().min(1, "Enter your phone model").max(100),
  issueIds: z.array(z.string().uuid()).min(1, "Select at least one issue").max(10),
  serviceType: z.enum(["walkin", "post"]),
  customerName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  customerPhone: z
    .string()
    .regex(/^\d{10}$/, "Enter a valid 10-digit mobile number"),
  customerEmail: z
    .string()
    .trim()
    .max(120)
    .refine((v) => v === "" || z.string().email().safeParse(v).success, "Enter a valid email address")
    .optional(),
  estimatedPriceMin: z.number().int().min(0),
  estimatedPriceMax: z.number().int().min(0),
  // Honeypot: a hidden field real users never fill in. Bots that
  // auto-fill every field will trip this and get silently rejected.
  website: z.string().max(0).optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;
