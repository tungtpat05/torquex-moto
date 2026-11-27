export function normalizeRole(role?: string): string {
  if (!role) return "";
  return role.trim().toUpperCase().replace(/^ROLE_/, "");
}

export function hasAnyRole(role: string | undefined, allowedRoles: string[]): boolean {
  const normalized = normalizeRole(role);
  if (!normalized) return false;
  return allowedRoles.some((allowed) => normalizeRole(allowed) === normalized);
}

export function isStaffRole(role?: string): boolean {
  return normalizeRole(role) === "STAFF";
}

export function getDefaultLandingPath(role?: string, fallbackPath = "/"): string {
  if (isStaffRole(role)) {
    return "/staff/dashboard";
  }
  return fallbackPath;
}
