import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../services/api";
import styles from "./Login.module.css";

function Login({ setUser }) {
  const navigate = useNavigate();
  const emailRef = useRef(null);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (error) setError(null);
  };

  const handleRememberMeChange = (e) => setRememberMe(e.target.checked);

  // ... existing code ...
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
  
    try {
      // 1️⃣ First ensure we have a valid CSRF cookie
      await axios.get("/sanctum/csrf-cookie");
  
      // 2️⃣ Login with proper credentials
      const loginResponse = await axios.post(
        "/api/login",
        { 
          email: formData.email.trim(), 
          password: formData.password 
        }
      );
  
      console.log("Login successful:", loginResponse.data);
      
      // 3️⃣ Store the token
      const { user, token } = loginResponse.data;
      localStorage.setItem('auth_token', token);
      
      const role = user.role?.toLowerCase() || 'user';
  
      // 4️⃣ Remember Me
      if (rememberMe) {
        localStorage.setItem("email", formData.email);
      } else {
        localStorage.removeItem("email");
      }
  
      // 5️⃣ Set user in React state/context
      setUser({ role, ...user });
  
      // 6️⃣ Show success animation then redirect
      setShowSuccess(true);
      setTimeout(() => {
        if (role === "admin") navigate("/admin");
        else if (role === "worker") navigate("/worker/dashboard");
        else navigate("/");
      }, 1200);
  
    } catch (err) {
      console.error("Login error:", err);
      
      // Handle specific error cases
      if (err.response?.status === 419) {
        setError("Session expired. Please refresh the page and try again.");
      } else if (err.response?.status === 401) {
        setError("Invalid email or password. Please try again.");
      } else if (err.response?.status === 422) {
        setError("Please check your input and try again.");
      } else {
        const msg =
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Login failed. Please check your credentials.";
        setError(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
// ... existing code ...

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <div className={styles.loginContainer}>
      <div className={styles.formPanel}>
        <div className={`${styles.formContainer} ${showSuccess ? styles.successAnimation : ""}`}>
          <h2>Sign In</h2>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <div className={styles.socialButtons}>
            <button className={styles.socialBtn} type="button">
              {/* Google Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#DB4437">
                <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 18c-3.313 0-6-2.687-6-6s2.687-6 6-6c1.027 0 1.973.25 2.82.693l-1.447 1.447c-.32-.143-.68-.229-1.063-.229-1.657 0-3 1.343-3 3s1.343 3 3 3c1.284 0 2.367-.807 2.797-1.93h-2.797v-2h5c0 3.313-2.687 6-6 6z"/>
              </svg>
              Sign in with Google
            </button>
          </div>

          <div className={styles.divider}>
            <span>or use your email account</span>
          </div>

          <form onSubmit={handleSubmit} className={styles.loginForm}>
            <div className={styles.inputGroup}>
              <input
                ref={emailRef}
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder=" "
                autoComplete="email"
              />
              <label htmlFor="email">Email</label>
            </div>

            <div className={styles.inputGroup}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder=" "
                autoComplete="current-password"
              />
              <label htmlFor="password">Password</label>
              <button
                type="button"
                className={styles.togglePassword}
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <div className={styles.rememberForgot}>
              <label className={styles.rememberMe}>
                <input type="checkbox" checked={rememberMe} onChange={handleRememberMeChange} />
                <span>Remember me</span>
              </label>
              <a href="#forgot" className={styles.forgotPassword}>
                Forgot your password?
              </a>
            </div>

            <button
              type="submit"
              className={`${styles.submitBtn} ${isSubmitting ? styles.submitting : ""}`}
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? <span className={styles.spinner} role="status" aria-label="Loading"></span> : "SIGN IN"}
            </button>
          </form>
        </div>
      </div>

      <div className={styles.welcomePanel}>
        <div className={styles.welcomeContent}>
          <h1>Hello, Friend!</h1>
          <p>Enter your personal details and start your journey with us</p>
          <button className={styles.switchBtn} onClick={() => navigate("/signup")} type="button">
            SIGN UP
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
