import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type SignInFormValues = z.infer<typeof signInSchema>;

export const signUpSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be between 2 and 100 characters")
    .max(100, "Full name must be between 2 and 100 characters"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address (e.g. user@example.com)"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(255, "Password must not exceed 255 characters"),
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;
