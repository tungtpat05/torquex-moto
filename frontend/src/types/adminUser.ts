export type AdminUserRole = "ADMIN" | "STAFF" | "CUSTOMER";

export type AdminUserGroup = "INTERNAL" | "CUSTOMER" | "ALL";

export interface AdminUser {
  id: number;
  email: string;
  fullName: string;
  role: AdminUserRole;
  isActive: boolean;
  createdAt?: string;
  authProviders: string[];
}

export interface AdminUserSummary {
  totalUsers: number;
  internalCount: number;
  staffCount: number;
  adminCount: number;
  customerCount: number;
  activeCount: number;
  lockedCount: number;
  googleCustomerCount: number;
}

export interface AdminUserPage {
  content: AdminUser[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface AdminUsersQueryParams {
  group?: AdminUserGroup;
  role?: AdminUserRole | "";
  isActive?: boolean;
  search?: string;
  page?: number;
  size?: number;
}

export interface AdminCreateStaffPayload {
  fullName: string;
  email: string;
  password: string;
  isActive: boolean;
}

export interface AdminUpdateStaffPayload {
  fullName: string;
  isActive: boolean;
}

export interface AdminUserStatusPayload {
  isActive: boolean;
}

export interface AdminResetPasswordPayload {
  newPassword: string;
}
