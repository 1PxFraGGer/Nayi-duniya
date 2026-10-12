import { createContext, useContext, useEffect, useState } from "react";
import API from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================================
  // CHECK CUSTOMER AUTH
  // =========================================

  const checkAuth = async () => {
    try {
      setLoading(true);

      const res = await API.get("/auth/customer/me");

      if (res.data?.success && res.data?.user) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // INITIAL AUTH CHECK
  // =========================================

  useEffect(() => {
    checkAuth();
  }, []);

  // =========================================
  // LOGOUT
  // =========================================

  const logout = async () => {
    try {
      await API.post("/auth/customer/logout");
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        checkAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// =========================================
// HOOK
// =========================================

export function useAuth() {
  return useContext(AuthContext);
}
