import React, { useState } from "react";
import axios from "axios";
import "./Signup.css";
import DialogLogin from "./DialogLogin";
import Modal from "react-modal";
import { useAuth } from "../Contexts/AuthContext"; // ✅ ייבוא `AuthContext`

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
  const [moveLogin, setMoveLogin] = useState(false);

  const handleSignup = async () => {
    setError(null);

    // ✅ בדיקות תקינות לטופס לפני שליחה
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

      console.log(" User signed up successfully:", response.data);
      alert(" נרשמת בהצלחה!");

      const token = response.data.token; // ✅ מקבל את ה-token מהשרת
      if (token) {
        login(token); // ✅ מחבר את המשתמש ע"י `AuthContext`
        onClose(); // ✅ סוגר את דיאלוג ההרשמה לאחר הצלחה
      } else {
        setMoveLogin(true); // ✅ אם אין טוקן, עובר לדיאלוג התחברות
      }

    } catch (err: any) {
      console.error(" Signup error:", err);
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || " שגיאה בהרשמה.");
      } else {
        setError(" שגיאת חיבור, נסה שוב מאוחר יותר.");
      }
    } finally {
      setLoading(false);
    }
  };

 



  if (!isOpen) return null;
  if (moveLogin) return <DialogLogin isOpen={moveLogin} onClose={() => setMoveLogin(false)} />; // ✅ מציג דיאלוג התחברות אם ההרשמה הצליחה ללא טוקן

  return (
  
      
 <Modal isOpen={isOpen} onRequestClose={onClose} className="modal2" overlayClassName="overlay2">
        <div>

       <h3>אימייל</h3>

       
 <input type="email" placeholder="הכנס אימייל" value={email} onChange={(e) => setEmail(e.target.value)} />

       <h3>שם משתמש</h3>
        <input type="text" placeholder="הכנס שם משתמש" value={username} onChange={(e) => setUsername(e.target.value)} />
<h3>סיסמה</h3>
        <input type="password" placeholder="הכנס סיסמה" value={password} onChange={(e) => setPassword(e.target.value)} />

       </div>
       
        {error && <p className="error-message">{error}</p>}
<div className="submitbutton">
  
        <button className="closebutoon1" onClick={handleSignup} disabled={loading}>
          {loading ? " נרשם..." : " הירשם"}
        </button>
        <button className="closebutoon1" onClick={onClose}> ביטול</button>
</div>
      
        
        </Modal>
         
    

   
  );
};

export default SignupDialog;
