import { z } from "zod";
import { mediaPathSchema } from "./common";

export const brandSchema = z.object({
  brandName: z
    .string()
    .trim()
    .min(2, "Brand name must be between 2 and 100 characters")
    .max(100, "Brand name must be between 2 and 100 characters"),
  logoUrl: mediaPathSchema,
  logoPublicId: z.string().optional(),
  description: z
    .string()
    .max(500, "Description must not exceed 500 characters")
    .optional(),
  isActive: z.boolean(),
});

export type BrandFormValues = z.infer<typeof brandSchema>;
