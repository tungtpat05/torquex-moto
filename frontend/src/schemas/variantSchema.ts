import { z } from "zod";
import {
  mediaPathSchema,
  nonNegativeIntString,
  nonNegativeNumberString,
} from "./common";

export const variantSchema = z.object({
  colorId: z.string().trim().min(1, "Please select a color"),
  sku: z
    .string()
    .trim()
    .min(2, "SKU must be between 2 and 50 characters")
    .max(50, "SKU must be between 2 and 50 characters")
    .regex(/^[A-Z0-9-]+$/, "SKU must contain only uppercase letters, numbers, and hyphens"),
  additionalPrice: nonNegativeNumberString("Additional Price"),
  stockQuantity: nonNegativeIntString("Stock Quantity"),
  variantImage: mediaPathSchema,
  variantImagePublicId: z.string().optional(),
  isActive: z.boolean(),
});

export type VariantFormValues = z.infer<typeof variantSchema>;

export const quickColorSchema = z.object({
  colorName: z
    .string()
    .trim()
    .min(2, "Color name must be between 2 and 50 characters")
    .max(50, "Color name must be between 2 and 50 characters"),
  colorCode: z
    .string()
    .trim()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Color code must be a valid hex color (e.g. #FF6700)"),
});

export type QuickColorFormValues = z.infer<typeof quickColorSchema>;
