import { z } from "zod";
import { SpecDefinition } from "@/types/specDefinition";
import {
  mediaPathSchema,
  optionalNonNegativeNumberString,
  optionalPositiveIntString,
  positiveNumberString,
  slugSchema,
} from "./common";

export const specValueEntrySchema = z.object({
  value: z.string(),
  valueNumber: z.string(),
  optionId: z.string(),
  specId: z.number().optional(),
});

export const baseProductSchema = z.object({
  productName: z
    .string()
    .trim()
    .min(2, "Product name must be between 2 and 255 characters")
    .max(255, "Product name must be between 2 and 255 characters"),
  slug: slugSchema,
  brandId: z.string().trim().min(1, "Brand is required"),
  categoryId: z.string().trim().min(1, "Category is required"),
  summary: z
    .string()
    .trim()
    .min(10, "Summary must be between 10 and 500 characters")
    .max(500, "Summary must be between 10 and 500 characters"),
  description: z
    .string()
    .trim()
    .min(20, "Description must be between 20 and 2000 characters")
    .max(2000, "Description must be between 20 and 2000 characters"),
  basePrice: positiveNumberString("Base Price"),
  discountPrice: optionalNonNegativeNumberString("Discount Price"),
  thumbnail: mediaPathSchema,
  thumbnailPublicId: z.string().optional(),
  weightGram: optionalPositiveIntString("Weight"),
  lengthCm: optionalPositiveIntString("Length"),
  widthCm: optionalPositiveIntString("Width"),
  heightCm: optionalPositiveIntString("Height"),
  isFeatured: z.boolean(),
  isActive: z.boolean(),
  specs: z.record(z.string(), specValueEntrySchema),
});

export type ProductFormValues = z.infer<typeof baseProductSchema>;

export const createProductSchema = (specDefs: SpecDefinition[] = []) =>
  baseProductSchema.superRefine((data, ctx) => {
    const baseNum = Number(data.basePrice);
    if (data.discountPrice.trim()) {
      const discountNum = Number(data.discountPrice);
      if (Number.isFinite(baseNum) && Number.isFinite(discountNum) && discountNum > baseNum) {
        ctx.addIssue({
          code: "custom",
          path: ["discountPrice"],
          message: "Discount price must not exceed base price",
        });
      }
    }

    specDefs.forEach((def) => {
      const entry = data.specs?.[String(def.id)];
      if (def.dataType === "number" && entry?.valueNumber?.trim()) {
        if (!Number.isFinite(Number(entry.valueNumber))) {
          ctx.addIssue({
            code: "custom",
            path: ["specs", String(def.id)],
            message: `${def.displayName} must be a valid number`,
          });
          return;
        }
      }

      if (def.isRequired) {
        const hasValue =
          def.dataType === "select"
            ? Boolean(entry?.optionId?.trim())
            : def.dataType === "number"
            ? Boolean(entry?.valueNumber?.trim())
            : Boolean(entry?.value?.trim());

        if (!hasValue) {
          ctx.addIssue({
            code: "custom",
            path: ["specs", String(def.id)],
            message: `${def.displayName} is required`,
          });
        }
      }
    });
  });
