import React, { createContext, useContext, useEffect, useState } from "react";
// import axios from "axios";

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
      console.log("🔄 Checking authentication on app load...");
      
      const token = localStorage.getItem("token");
      console.log("📌 Token from localStorage:", token);
  
      // מתחילים את מצב הטעינה
      setLoading(true);
  
      if (!token) {
        console.log("❌ No token found, setting isAuthenticated = false");
        setAuthenticated(false);  // אם אין טוקן, המשתמש לא מחובר
        setLoading(false);
        return;
      }
   setAuthenticated(true);  
      try {
      
      } catch (error) {
        console.error("❌ Token validation failed:", error);
       
      }
  
      setLoading(false);  // מסיימים את מצב הטעינה
    };
  
    checkAuth();  // קריאה לפונקציה שבודקת את האימות
  }, []);
  
  

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setAuthenticated(true);
    console.log("🔹 User logged in, token saved.");
  };

  
  const logout = () => {
    localStorage.removeItem("token"); // הסרת הטוקן
    setAuthenticated(false); // עדכון מצב התחברות
    console.log("🔹 User logged out.");
    alert("התנתקת בהצלחה")
  };

  if (isLoading) {
    return <div>🔄 טוען נתוני משתמש...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login,logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

