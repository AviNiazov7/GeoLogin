import React, { useState } from "react";
import axios from "axios";

const SignupDialog: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSignup = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post("http://localhost:5001/auth/signup", {
                username,
                email,
                password
            });

            console.log("Registration successful:", response.data);
            setOpen(false);
        } catch (err) {
            setError("Registration failed. Please try again.");
            console.error("Signup error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button onClick={() => setOpen(true)}>Sign Up</button>

            {open && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setOpen(false)}>&times;</span>
                        <h2>Sign Up</h2>

                        <label>Username:</label>
                        <input 
                            type="text" 
                            placeholder="Enter username" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                        />

                        <label>Email:</label>
                        <input 
                            type="email" 
                            placeholder="Enter email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                        />

                        <label>Password:</label>
                        <input 
                            type="password" 
                            placeholder="Enter password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />

                        {error && <p className="error">{error}</p>}

                        <button onClick={handleSignup} disabled={loading}>
                            {loading ? "Signing Up..." : "Sign Up"}
                        </button>
                    </div>
                </div>
            )}

            <style>
                {`
                    .modal {
                        display: flex;
                        position: fixed;
                        z-index: 1;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 100%;
                        background-color: rgba(0,0,0,0.4);
                        justify-content: center;
                        align-items: center;
                    }
                    
                    .modal-content {
                        background-color: white;
                        padding: 20px;
                        border-radius: 10px;
                        width: 300px;
                        text-align: center;
                    }
                    
                    .close {
                        float: right;
                        font-size: 28px;
                        cursor: pointer;
                    }
                    
                    input {
                        width: 100%;
                        padding: 10px;
                        margin: 10px 0;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                    }
                    
                    button {
                        background-color: #4CAF50;
                        color: white;
                        padding: 10px 15px;
                        border: none;
                        cursor: pointer;
                        border-radius: 5px;
                    }
                    
                    .error {
                        color: red;
                        font-size: 14px;
                    }
                `}
            </style>
        </>
    );
};

export default SignupDialog;
