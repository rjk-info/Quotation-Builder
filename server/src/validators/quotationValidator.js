import { z } from "zod";

const looseObject = z.record(z.any());

export const quotationPayloadSchema = z.object({
  quotationNumber: z.string().trim().optional(),
  templateType: z.string().trim().min(1),
  status: z.enum(["draft", "sent", "accepted", "rejected", "archived"]).optional(),
  logo: looseObject.optional(),
  heading: looseObject,
  companyDetails: z.array(looseObject).default([]),
  clientDetails: z.array(looseObject).default([]),
  pricing: looseObject,
  overview: z.string().default(""),
  sections: z.array(looseObject).default([]),
  footer: looseObject.optional(),
  watermark: looseObject.optional(),
  display: looseObject.optional()
});

export const templatePayloadSchema = z.object({
  key: z.string().trim().min(2),
  name: z.string().trim().min(2),
  description: z.string().optional(),
  quotation: quotationPayloadSchema,
  isDefault: z.boolean().optional()
});
