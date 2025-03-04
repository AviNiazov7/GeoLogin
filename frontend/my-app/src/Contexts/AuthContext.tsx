import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setAuthenticated] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        // 🔹 בדיקה אם ה-Token עדיין חוקי בשרת
        await axios.post(`${process.env.REACT_APP_API_URL}/auth/validate-token`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAuthenticated(true);
      } catch (error) {
        console.log("❌ Token invalid, logging out.");
        localStorage.removeItem("token");
        setAuthenticated(false);
      }

      setLoading(false);
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setAuthenticated(true);
    console.log("🔹 User logged in, token saved.");
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.post(`${process.env.REACT_APP_API_URL}/auth/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Logout successful on server.");
    } catch (error) {
      console.error("❌ Error logging out from server:", error);
    } finally {
      localStorage.removeItem("token"); // ✅ מחיקת ה-Token מהלקוח
      setAuthenticated(false);
      console.log("🔹 User logged out, token removed.");
    }
  };

  if (isLoading) {
    return <div>🔄 טוען נתוני משתמש...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
