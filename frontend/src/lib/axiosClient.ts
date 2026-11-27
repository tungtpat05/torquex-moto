import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;
if (!baseURL && import.meta.env.DEV) {
  console.warn("⚠️ [Config] VITE_API_BASE_URL is missing in .env, falling back to /api/v1");
}

const AUTH_ENDPOINTS = ["/auth/me", "/auth/login", "/auth/register", "/auth/logout"];
const PROTECTED_PATH_PREFIXES = ["/admin", "/staff", "/cart", "/profile"];

export function shouldRedirectOn401(requestUrl = "", currentPath = ""): boolean {
  if (AUTH_ENDPOINTS.some((endpoint) => requestUrl.includes(endpoint))) {
    return false;
  }
  return PROTECTED_PATH_PREFIXES.some((prefix) => currentPath.startsWith(prefix));
}

export const axiosClient = axios.create({
  baseURL: baseURL || "/api/v1",
  timeout: 10000,
  withCredentials: true,
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const requestUrl = String(error.config?.url || "");
      const currentPath = window.location.pathname;
      if (shouldRedirectOn401(requestUrl, currentPath)) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
