import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;
if (!baseURL && import.meta.env.DEV) {
  console.warn("⚠️ [Config] VITE_API_BASE_URL is missing in .env, falling back to /api/v1");
}

export const axiosClient = axios.create({
  baseURL: baseURL || "/api/v1",
  timeout: 10000,
  withCredentials: true,
});

// Handle response errors
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If unauthorized (401), redirect to login (except when already on authentication pages)
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath !== "/login" && currentPath !== "/register" && currentPath !== "/auth/success") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
