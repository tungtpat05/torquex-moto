import { useCallback, useEffect, useRef, useState } from "react";
import { AdminUserPage, AdminUsersQueryParams } from "../types/adminUser";
import { getAdminUsers } from "../services/adminUserService";

export const useAdminUsers = (params: AdminUsersQueryParams) => {
  const [pageData, setPageData] = useState<AdminUserPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const { group, role, isActive, search, page, size } = params;

  const fetchUsers = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    try {
      setLoading(true);
      setError(null);
      const data = await getAdminUsers({
        group,
        role,
        isActive,
        search,
        page,
        size,
      });
      if (requestId === requestIdRef.current) {
        setPageData(data);
      }
    } catch {
      if (requestId === requestIdRef.current) {
        setError("Failed to load user accounts.");
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [group, role, isActive, search, page, size]);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  return {
    pageData,
    users: pageData?.content ?? [],
    totalElements: pageData?.totalElements ?? 0,
    totalPages: pageData?.totalPages ?? 0,
    loading,
    error,
    refetch: fetchUsers,
  };
};
