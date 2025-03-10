import React, { useState } from "react";
import axios from "axios";
import "./Signup.css";
import { useAuth } from "../Contexts/AuthContext";

interface DialogLoginProps {
  isOpen: boolean;
  onClose: () => void;
}

const DialogLogin: React.FC<DialogLoginProps> = ({ isOpen, onClose }) => {
  const { login } = useAuth(); // קבלת פונקציית התחברות מ-AuthContext
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
        username,
        password,
      });

      const token = response.data.token; // קבלת ה-Token מהשרת
      if (token) {
        localStorage.setItem("token", token); // שמירת ה-Token ב-LocalStorage
        login(token); // עדכון המצב הגלובלי דרך `AuthContext`
        console.log("Login successful:", response.data);
        alert("!ברוך הבא")
        onClose(); // סגירת הדיאלוג
      } else {
        setError("Login failed: No token received.");
      }
    } catch (err) {
      setError("Login failed. Please check your credentials.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null; // אם הדיאלוג לא פתוח, אל תציג אותו

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>

        <h2 className="titel">Login</h2>

        <label>User name</label>
        <input
          type="text"
          placeholder="Enter user name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label>Password:</label>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="error-message">{error}</p>}

        <button className="closebutoon" onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default DialogLogin;
