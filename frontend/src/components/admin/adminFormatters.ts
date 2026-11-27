import { ApiErrorResponse } from "../../types/apiError";

export function formatAdminDate(dateString?: string): string {
  if (!dateString) return "—";
  try {
    const parsed = new Date(dateString);
    if (Number.isNaN(parsed.getTime())) return dateString;
    return parsed.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

export function resolveAuthBadge(authProviders?: string[]): string {
  if (!authProviders || authProviders.length === 0) {
    return "LOCAL";
  }
  const normalized = authProviders.map((provider) => provider.trim().toUpperCase());
  if (normalized.includes("GOOGLE")) {
    return "GOOGLE";
  }
  return normalized[0] || "LOCAL";
}

export function extractApiErrorMessage(err: unknown, fallback: string): string {
  const axiosErr = err as {
    response?: { data?: ApiErrorResponse | string };
    message?: string;
  };
  const data = axiosErr?.response?.data;
  if (typeof data === "object" && data !== null && data.message) {
    return data.message;
  }
  if (typeof data === "string" && data.trim()) {
    return data;
  }
  return axiosErr?.message || fallback;
}
