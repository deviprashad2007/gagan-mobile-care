import { z } from "zod";

export const bookingSchema = z.object({
  brandId: z.string().uuid(),
  brandName: z.string().min(1).max(100),
  issueIds: z.array(z.string().uuid()).min(1, "Select at least one issue").max(10),
  serviceType: z.enum(["walkin", "post"]),
  customerName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  customerPhone: z
    .string()
    .regex(/^\d{10}$/, "Enter a valid 10-digit mobile number"),
  estimatedPriceMin: z.number().int().min(0),
  estimatedPriceMax: z.number().int().min(0),
});

export type BookingInput = z.infer<typeof bookingSchema>;
