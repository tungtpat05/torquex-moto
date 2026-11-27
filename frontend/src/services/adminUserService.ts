import { axiosClient } from "../lib/axiosClient";
import {
  AdminCreateStaffPayload,
  AdminResetPasswordPayload,
  AdminUpdateStaffPayload,
  AdminUser,
  AdminUserPage,
  AdminUserStatusPayload,
  AdminUserSummary,
  AdminUsersQueryParams,
} from "../types/adminUser";

export const getAdminUserSummary = async (): Promise<AdminUserSummary> => {
  const response = await axiosClient.get<AdminUserSummary>("/admin/users/summary");
  return response.data;
};

export const getAdminUsers = async (
  params: AdminUsersQueryParams = {}
): Promise<AdminUserPage> => {
  const queryParams: Record<string, string | number | boolean> = {
    group: params.group || "ALL",
    page: params.page ?? 0,
    size: params.size ?? 10,
  };

  if (params.role) {
    queryParams.role = params.role;
  }
  if (typeof params.isActive === "boolean") {
    queryParams.isActive = params.isActive;
  }
  if (params.search && params.search.trim()) {
    queryParams.search = params.search.trim();
  }

  const response = await axiosClient.get<AdminUserPage>("/admin/users", {
    params: queryParams,
  });
  return response.data;
};

export const getAdminUserById = async (id: number): Promise<AdminUser> => {
  const response = await axiosClient.get<AdminUser>(`/admin/users/${id}`);
  return response.data;
};

export const createStaffAccount = async (
  payload: AdminCreateStaffPayload
): Promise<AdminUser> => {
  const response = await axiosClient.post<AdminUser>("/admin/users", payload);
  return response.data;
};

export const updateStaffAccount = async (
  id: number,
  payload: AdminUpdateStaffPayload
): Promise<AdminUser> => {
  const response = await axiosClient.put<AdminUser>(`/admin/users/${id}`, payload);
  return response.data;
};

export const updateAdminUserStatus = async (
  id: number,
  payload: AdminUserStatusPayload
): Promise<AdminUser> => {
  const response = await axiosClient.patch<AdminUser>(
    `/admin/users/${id}/status`,
    payload
  );
  return response.data;
};

export const resetStaffPassword = async (
  id: number,
  payload: AdminResetPasswordPayload
): Promise<void> => {
  await axiosClient.post(`/admin/users/${id}/reset-password`, payload);
};
