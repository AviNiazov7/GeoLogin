import React, { createContext, useContext, useEffect, useState } from "react";

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
    // ✅ בודק אם יש `token` ב-`localStorage` במקום לפנות לשרת
    const token = localStorage.getItem("token");
    if (token) {
      setAuthenticated(true);
      console.log("✅ User is authenticated (Token found)");
    } else {
      setAuthenticated(false);
      console.log("❌ No token found, user is not authenticated");
    }
    setLoading(false);
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token); // ✅ שומר את ה-token
    setAuthenticated(true);
    console.log("🔹 User logged in, token saved.");
  };

  const logout = () => {
    localStorage.removeItem("token"); // ❌ מוחק את ה-token
    setAuthenticated(false);
    console.log("🔹 User logged out, token removed.");
  };

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

