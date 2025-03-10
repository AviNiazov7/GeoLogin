import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  deleteUser: ()=> void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setAuthenticated] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      console.log("🔄 Checking authentication on app load...");
      
      const token = localStorage.getItem("token");
      console.log("📌 Token from localStorage:", token);
  
      if (!token) {
        console.log("❌ No token found, setting isAuthenticated = false");
        setAuthenticated(false);
        setLoading(false);
        return;
      }
  
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/auth/validate-token`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        console.log("✅ Token is valid, setting isAuthenticated = true");
        setAuthenticated(true);
      } catch (error) {
        console.error("❌ Token validation failed:", error);
        localStorage.removeItem("token");
        setAuthenticated(false);
      }
  
      setLoading(false);
    };
  
    checkAuth();
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
        headers: { Authorization: `Bearer ${token}` } 
      });

      alert("🚪 התנתקת בהצלחה!");
    } catch (error) {
      console.error("❌ שגיאה בהתנתקות:", error);
    } finally {
      localStorage.removeItem("token");
      setAuthenticated(false);
    }
  };

  const deleteUser = async () => {
    try {
      const confirmed = window.confirm("❗ האם אתה בטוח שברצונך למחוק את החשבון?");
      if (!confirmed) return;

      const token = localStorage.getItem("token");
      if (!token) {
        alert("⚠️ אין משתמש מחובר.");
        return;
      }

      // 🗑️ שליחת בקשת מחיקת המשתמש לשרת עם `DELETE`
      await axios.delete(`${process.env.REACT_APP_API_URL}/auth/delete`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });

      alert("🗑️ החשבון נמחק בהצלחה!");
      
      // 🚪 התנתקות לאחר מחיקה
      logout();
    } catch (error) {
      console.error("❌ שגיאה במחיקת המשתמש:", error);
      alert("❌ שגיאה במחיקת החשבון.");
    }
  };



  if (isLoading) {
    return <div>🔄 טוען נתוני משתמש...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login,logout,deleteUser}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

