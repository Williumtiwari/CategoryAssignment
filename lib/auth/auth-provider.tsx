"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { login, refreshToken } from "@/lib/api/auth";
import { Loader2 } from "lucide-react";

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

interface User {
  uuid: string;
  name: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshTokenValue, setRefreshTokenValue] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is logged in
    const storedAccessToken = Cookies.get("accessToken");
    const storedRefreshToken = Cookies.get("refreshToken");
    const storedUser = Cookies.get("user");

    if (storedAccessToken && storedRefreshToken && storedUser) {
      try {
        setAccessToken(storedAccessToken);
        setRefreshTokenValue(storedRefreshToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        // Handle potential JSON parse errors
        console.error("Error parsing user data:", {
          message: error instanceof Error ? error.message : "Unknown error",
        });
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        Cookies.remove("user");
      }
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Redirect logic
    if (!isLoading) {
      if (!user && pathname !== "/login") {
        router.push("/login");
      } else if (user && pathname === "/login") {
        router.push("/dashboard");
      }
    }
  }, [user, pathname, isLoading, router]);

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await login(email, password);

      const userData: User = {
        uuid: response.store_details.uuid,
        name: response.store_details.name,
      };

      // Set cookies
      Cookies.set(
        "accessToken",
        response.token_response.response.access_token,
        {
          expires: 1,
        }
      ); // 1 day
      Cookies.set(
        "refreshToken",
        response.token_response.response.refresh_token,
        { expires: 30 }
      ); // 30 days
      Cookies.set("user", JSON.stringify(userData), { expires: 30 });

      setUser(userData);
      setAccessToken(response.token_response.response.access_token);
      setRefreshTokenValue(response.token_response.response.refresh_token);

      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", {
        message: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("user");
    setUser(null);
    setAccessToken(null);
    setRefreshTokenValue(null);
    router.push("/login");
  };

  // Setup token refresh
  useEffect(() => {
    if (!refreshTokenValue) return;

    const refreshAccessToken = async () => {
      try {
        const response = await refreshToken(refreshTokenValue);
        setAccessToken(response.response.access_token);
        setRefreshTokenValue(response.response.access_token);
        Cookies.set("accessToken", response.response.access_token, {
          expires: 1,
        });
        Cookies.set("refreshToken", response.response.access_token, {
          expires: 30,
        });
      } catch (error) {
        // Use a regular object for error logging instead of passing the error directly
        console.error("Token refresh failed:", {
          message: error instanceof Error ? error.message : "Unknown error",
        });
        handleLogout();
      }
    };

    // Refresh token every 4 minutes (tokens expire in 5 minutes)
    const intervalId = setInterval(refreshAccessToken, 4 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [refreshTokenValue]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken: refreshTokenValue,
        login: handleLogin,
        logout: handleLogout,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
