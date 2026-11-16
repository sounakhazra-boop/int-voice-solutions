import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL_AGUI || "http://127.0.0.1:8000";
// The user pointed to livekit_modular which uses /api/getToken
const TOKEN_ENDPOINT = `${BACKEND_URL}/api/getToken`;
const USER_INFO_KEY = "user_info";

interface StoredUserInfo {
  user_name: string;
  user_email: string;
  user_phone: string;
  user_id: string;
}

function getOrCreateUserInfo(): StoredUserInfo {
  if (typeof window === "undefined") {
    return {
      user_name: "",
      user_email: "",
      user_phone: "",
      user_id: "",
    };
  }

  try {
    const raw = localStorage.getItem(USER_INFO_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return {
          user_name:
            typeof parsed.user_name === "string" ? parsed.user_name : "",
          user_email:
            typeof parsed.user_email === "string" ? parsed.user_email : "",
          user_phone:
            typeof parsed.user_phone === "string" ? parsed.user_phone : "",
          user_id:
            typeof parsed.user_id === "string" && parsed.user_id
              ? parsed.user_id
              : uuidv4(),
        };
      }
    }
  } catch (e) {
    console.error("Failed to parse user info from localStorage", e);
  }

  const freshUser: StoredUserInfo = {
    user_name: "",
    user_email: "",
    user_phone: "",
    user_id: uuidv4(),
  };

  try {
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(freshUser));
  } catch (e) {
    console.warn("Failed to persist user info in localStorage", e);
  }

  return freshUser;
}

export function useLiveKitConnection() {
  const [token, setToken] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const connect = useCallback(async (agentName: string = "indusnet") => {
    setIsConnecting(true);
    setError(null);
    try {
      const user = getOrCreateUserInfo();
      const params = new URLSearchParams({
        name: user.user_name,
        user_id: user.user_id,
        agent: agentName,
        email: user.user_email,
        phone: user.user_phone,
      });

      const url = `${TOKEN_ENDPOINT}?${params.toString()}`;
      const response = await fetch(url, { mode: "cors" });

      if (!response.ok) {
        throw new Error(
          `Server returned ${response.status}: ${response.statusText}`,
        );
      }

      const accessToken = await response.text();
      if (!accessToken || accessToken.trim().length === 0) {
        throw new Error("Received empty token from backend");
      }

      setToken(accessToken.trim());
    } catch (err: unknown) {
      console.error("Connection failed:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setToken("");
    setError(null);
  }, []);

  return {
    token,
    isConnecting,
    error,
    connect,
    disconnect,
  };
}
