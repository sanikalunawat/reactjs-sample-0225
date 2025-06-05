import React, { useState } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("Please enter your email to reset password.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetMessage("Password reset email sent!");
      setError("");
    } catch (err) {
      setError(err.message);
      setResetMessage("");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Sign In</h2>
        {error && <div className="error">{error}</div>}
        {resetMessage && <div className="success">{resetMessage}</div>}
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Your email"
        />
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Your password"
        />
        <button type="submit" className="btn-primary">Sign In</button>
        <div className="forgot-reset">
          <button type="button" onClick={handleResetPassword} className="forgot-btn">
            Forgot Password?
          </button>
        </div>
        <p>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
