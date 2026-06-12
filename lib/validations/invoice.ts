import { z } from "zod";

export const invoiceItemSchema = z.object({
  description: z.string().trim().min(1, "Required").max(120),
  qty: z.number().int().min(1).max(99),
  price: z.number().int().min(0),
});

export const createInvoiceSchema = z.object({
  repairId: z.string().uuid().optional(),
  customerName: z.string().trim().min(1, "Customer name is required").max(80),
  customerPhone: z.string().trim().min(10).max(15),
  modelText: z.string().trim().max(120).optional(),
  items: z.array(invoiceItemSchema).min(1, "Add at least one item").max(20),
  discount: z.number().int().min(0).default(0),
  paymentMethod: z.enum(["cash", "upi", "card", "other"]).default("cash"),
  notes: z.string().trim().max(500).optional(),
});

export type InvoiceItem = z.infer<typeof invoiceItemSchema>;
export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
