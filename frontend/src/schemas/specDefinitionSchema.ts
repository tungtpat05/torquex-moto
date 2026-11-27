import { z } from "zod";

export const specDefinitionSchema = z.object({
  keyCode: z
    .string()
    .trim()
    .min(1, "Key code is required")
    .max(100, "Key code must not exceed 100 characters")
    .regex(/^[a-z0-9_]+$/, "Key code must contain only lowercase letters, numbers, and underscores"),
  displayName: z
    .string()
    .trim()
    .min(1, "Display name is required")
    .max(150, "Display name must not exceed 150 characters"),
  dataType: z.enum(["text", "number", "select"]),
  unit: z.string().max(20, "Unit must not exceed 20 characters").optional(),
  displayOrder: z
    .number()
    .int("Display order must be a whole number")
    .min(0, "Display order must be >= 0"),
  isRequired: z.boolean(),
  isActive: z.boolean(),
});

export type SpecDefinitionFormValues = z.infer<typeof specDefinitionSchema>;
