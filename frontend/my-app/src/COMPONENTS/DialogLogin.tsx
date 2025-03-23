import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../Contexts/AuthContext";
import "./Dialoglogin.css"
import Modal from "react-modal";


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
      
        onClose();
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
     <Modal isOpen={isOpen} onRequestClose={onClose} className="modal2" overlayClassName="overlay2">
            <button className="close-btn" onClick={onClose}>✖</button>

        <h1 className="titel">Login</h1>

        <h3>User name</h3>
         
        <input
          type="text"
          placeholder="Enter user name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <h3>Password</h3>

       
 <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      
       

        {error && <p className="error-message">{error}</p>}
<div className="closebutoon">
    <button className="closebutoon1" onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
</div>
      
     </Modal>
  );
};

export default DialogLogin;
