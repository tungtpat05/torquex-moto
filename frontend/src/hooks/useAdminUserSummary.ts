import { useCallback, useEffect, useState } from "react";
import { AdminUserSummary } from "../types/adminUser";
import { getAdminUserSummary } from "../services/adminUserService";

export const useAdminUserSummary = () => {
  const [summary, setSummary] = useState<AdminUserSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAdminUserSummary();
      setSummary(data);
    } catch {
      setError("Failed to load account telemetry summary.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchSummary();
  }, [fetchSummary]);

  return { summary, loading, error, refetch: fetchSummary };
};
