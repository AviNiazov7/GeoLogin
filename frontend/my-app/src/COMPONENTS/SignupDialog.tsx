import React, { useState } from "react";
import axios from "axios";
import "./Signup.css";
import { useAuth } from "../Contexts/AuthContext";

interface SignupDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignupDialog: React.FC<SignupDialogProps> = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const API_URL = process.env.REACT_APP_API_URL;

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async () => {
    if (!username || !email || !password) {
      setError("All fields are required.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email format.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/auth/signup`, {
        username,
        email,
        password,
        
      });
      onClose()
 
      const token = response.data.token;
      if (token) {
        localStorage.setItem("token", token);
        login(token);
        console.log("Signup successful:", response.data); 
      }
    } catch (err) {
      setError("Signup failed. Please try again.");
      console.error("Signup error:", err);
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

        <h2 className="titel">Sign Up</h2>

        <label>Email:</label>
        <input type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>Username:</label>
        <input type="text" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />

        <label>Password:</label>
        <input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />

        {error && <p className="error-message">{error}</p>}

        <button className="closebutoon" onClick={handleSignup} disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default SignupDialog;
