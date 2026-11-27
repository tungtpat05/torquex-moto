import { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { z } from "zod";

export const MEDIA_PATH_REGEX = /^(https?:\/\/.+|\/images\/.+)$/;
export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const mediaPathSchema = z
  .string()
  .trim()
  .min(1, "Image path or URL is required")
  .regex(
    MEDIA_PATH_REGEX,
    "Must be a valid URL starting with http://, https://, or a local path starting with /images/"
  );

export const slugSchema = z
  .string()
  .trim()
  .min(2, "Slug must be at least 2 characters")
  .max(255, "Slug must not exceed 255 characters")
  .regex(SLUG_REGEX, "Slug must contain only lowercase letters, numbers, and hyphens");

export const positiveNumberString = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .refine(
      (val) => {
        const num = Number(val);
        return Number.isFinite(num) && num > 0;
      },
      { message: `${label} must be greater than 0` }
    );

export const nonNegativeNumberString = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .refine(
      (val) => {
        const num = Number(val);
        return Number.isFinite(num) && num >= 0;
      },
      { message: `${label} must be a valid non-negative number` }
    );

export const optionalNonNegativeNumberString = (label: string) =>
  z
    .string()
    .trim()
    .refine(
      (val) => {
        if (!val) return true;
        const num = Number(val);
        return Number.isFinite(num) && num >= 0;
      },
      { message: `${label} must be greater than or equal to 0` }
    );

export const nonNegativeIntString = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .refine((val) => /^\d+$/.test(val), {
      message: `${label} must be a non-negative whole integer`,
    });

export const optionalPositiveIntString = (label: string) =>
  z
    .string()
    .trim()
    .refine(
      (val) => {
        if (!val) return true;
        return /^[1-9]\d*$/.test(val);
      },
      { message: `${label} must be a positive whole number` }
    );

export const slugifyText = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

export function applyServerValidationErrors<TFieldValues extends FieldValues>(
  details: Record<string, string> | undefined,
  setError: UseFormSetError<TFieldValues>
): void {
  if (!details) return;
  Object.entries(details).forEach(([field, message]) => {
    if (field && message) {
      setError(field as Path<TFieldValues>, { type: "server", message });
    }
  });
}
