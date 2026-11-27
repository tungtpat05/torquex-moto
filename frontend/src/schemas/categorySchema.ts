import { z } from "zod";
import { SLUG_REGEX, mediaPathSchema } from "./common";

export const categorySchema = z.object({
  categoryName: z
    .string()
    .trim()
    .min(2, "Category name must be between 2 and 100 characters")
    .max(100, "Category name must be between 2 and 100 characters"),
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be between 2 and 100 characters")
    .max(100, "Slug must be between 2 and 100 characters")
    .regex(SLUG_REGEX, "Slug must contain only lowercase letters, numbers, and hyphens"),
  categoryImage: mediaPathSchema,
  description: z
    .string()
    .max(500, "Description must not exceed 500 characters")
    .optional(),
  isActive: z.boolean(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
