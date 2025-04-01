import React, { useState } from "react";
import axios from "axios";
import "./Signup.css";
import DialogLogin from "./DialogLogin";
import Modal from "react-modal";
import { useAuth } from "../Contexts/AuthContext";

interface SignupDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignupDialog: React.FC<SignupDialogProps> = ({ isOpen, onClose }) => {
  const { login,logout } = useAuth();
  const API_URL = process.env.REACT_APP_API_URL;

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [moveLogin, setMoveLogin] = useState(false);

  const handleSignup = async () => {
    setError(null);

    if (!username.trim() || !email.trim() || !password.trim()) {
      setError("⚠️ יש למלא את כל השדות.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("⚠️ כתובת אימייל אינה תקינה.");
      return;
    }
    if (password.length < 6) {
      setError("⚠️ הסיסמה חייבת להיות לפחות 6 תווים.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/signup`, {
        username,
        email,
        password,
      });

      console.log("User signed up successfully:", response.data);
      alert("נרשמת בהצלחה!");

      const token = response.data.token;
      if (token) {
        login(token);
        onClose(); // סגירת הדיאלוג
      } else {
        setMoveLogin(true);
        // onClose();
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "שגיאה בהרשמה.");
      } else {
        setError("שגיאת חיבור, נסה שוב מאוחר יותר.");
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteUserByEmail = async (email: string): Promise<void> => {
    try {
      const response = await axios.delete(`${API_URL}/auth/delete`, {
        data: { email },
      });
      logout()
      console.log("User deleted successfully:", response.data);
      alert("המשתמש נמחק בהצלחה.");
      onClose();
    } catch (error: any) {
      console.error("שגיאה במחיקת משתמש", error);
      if (axios.isAxiosError(error) && error.response) {
        alert(error.response.data.message || "הכנס אימייל לצורך צחיקת החשבון");
      } else {
        alert("שגיאת חיבור, נסה שוב מאוחר יותר.");
      }
    }
  };

  if (!isOpen || moveLogin) return null;

  if (moveLogin) {
    return <DialogLogin isOpen={moveLogin} onClose={() => setMoveLogin(false)} />;
  }
  

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal2"
      overlayClassName="overlay2"
    >
      <button className="close-btn" onClick={onClose}>
        ✖
      </button>

      <div>
        <h3>Email</h3>
        <input
          type="email"
          placeholder="הכנס אימייל"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <h3>User name</h3>
        <input
          type="text"
          placeholder="הכנס שם משתמש"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <h3>Password</h3>
        <input
          type="password"
          placeholder="הכנס סיסמה"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="submitbutton">
        <button
          className="closebutoon1"
          onClick={handleSignup}
          disabled={loading}
        >
          {loading ? "נרשם..." : "הירשם"}
        </button>

        <button
          className="closebutoon1"
          onClick={() => {
            if (window.confirm("האם אתה בטוח שברצונך למחוק את החשבון?")) {
              deleteUserByEmail(email);
            }
          }}
        >
          מחק חשבון
        </button>
      </div>
    </Modal>
  );
};

export default SignupDialog;
