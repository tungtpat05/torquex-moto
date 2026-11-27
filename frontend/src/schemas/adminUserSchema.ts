import { z } from "zod";

export const createStaffSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be between 2 and 100 characters")
    .max(100, "Full name must be between 2 and 100 characters"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(100, "Email must not exceed 100 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(255, "Password must not exceed 255 characters"),
  isActive: z.boolean(),
});

export type CreateStaffFormValues = z.infer<typeof createStaffSchema>;

export const editStaffSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be between 2 and 100 characters")
    .max(100, "Full name must be between 2 and 100 characters"),
  isActive: z.boolean(),
});

export type EditStaffFormValues = z.infer<typeof editStaffSchema>;

export const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(255, "Password must not exceed 255 characters"),
});

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
