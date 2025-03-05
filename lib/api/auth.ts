import axios from "axios";

const API_BASE_URL = "http://34.93.113.87:8081";

export interface RefreshTokenResponse {
  response: { access_token: string };
}

export const login = async (email: string, password: string): Promise<any> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/token_svc/v1/stores/login`,
      {
        email,
        password,
      }
    );
    console.log("Login response:", response.data);
    return response.data;
  } catch (error) {
    console.log("Login error:", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
    throw error;
  }
};

export const refreshToken = async (
  refreshTokenValue: string
): Promise<RefreshTokenResponse> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/token_svc/v1/store_users/tokens/refresh`,
      {
        request: {
          refresh_token: refreshTokenValue,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Refresh token error:", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
    throw error;
  }
};
