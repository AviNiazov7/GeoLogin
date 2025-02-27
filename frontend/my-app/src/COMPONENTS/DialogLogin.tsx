import React, { useState } from "react";
import axios from "axios";
import "./Signup.css";

interface DialogLoginProps {
  isOpen: boolean;
  onClose: () => void;
}

const DialogLogin: React.FC<DialogLoginProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlelogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:5001/auth/login", {
      email,
        password,
      });

      console.log("Registration successful:", response.data);
      onClose(); 
    } catch (err) {
      setError("Registration failed. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null; 

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>

        <h2 className="titel">Login</h2>
        <label>Email:</label>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) =>setEmail (e.target.value)}
        />

        <label>Password:</label>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="error-message">{error}</p>}
        <button onClick={onClose}>Close</button>

        <button className="closebutoon" onClick={handlelogin} disabled={loading}>
          {loading ? "login..." : "login"}
        </button>
      </div>
    </div>
  );
};

export default DialogLogin;
