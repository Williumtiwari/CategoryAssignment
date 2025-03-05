import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = "http://34.93.113.87:8081";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    // Use a plain object for error logging
    console.error("API request error:", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        const refreshTokenValue = Cookies.get("refreshToken");

        if (!refreshTokenValue) {
          // No refresh token, redirect to login
          window.location.href = "/login";
          return Promise.reject(error);
        }

        const response = await axios.post(
          `${API_BASE_URL}/token_svc/v1/store_users/tokens/refresh`,
          {
            request: {
              refresh_token: refreshTokenValue,
            },
          }
        );

        const newAccessToken = response.data.response.access_token;

        // Update cookies
        Cookies.set("accessToken", newAccessToken, { expires: 1 });

        // Update header and retry request
        apiClient.defaults.headers.common.Authorization = newAccessToken;
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: newAccessToken,
        };

        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh token failed, redirect to login
        // Use a plain object for error logging
        console.error("Token refresh error:", {
          message:
            refreshError instanceof Error
              ? refreshError.message
              : "Unknown error",
        });

        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        Cookies.remove("user");
        window.location.href = "/login";
        return Promise.reject({ message: "Authentication failed" });
      }
    }

    // Use a plain object for error logging
    console.error("API response error:", {
      status: error.response?.status,
      message: error.message || "Unknown error",
    });

    return Promise.reject(error);
  }
);

export default apiClient;
