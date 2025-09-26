import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../services/api";
import styles from "./Login.module.css";

function Login({ setUser }) {
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const phoneRef = useRef(null);

  const [formData, setFormData] = useState({ 
    email: "", 
    phone: "", 
    password: "" 
  });
  const [useEmail, setUseEmail] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const savedCredential = localStorage.getItem(useEmail ? "email" : "phone");
    if (savedCredential) {
      setFormData(prev => ({
        ...prev,
        [useEmail ? "email" : "phone"]: savedCredential
      }));
      setRememberMe(true);
    }

    // Focus the appropriate input
    const currentRef = useEmail ? emailRef : phoneRef;
    currentRef.current?.focus();
  }, [useEmail]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (error) setError(null);
  };

  const handleToggle = (useEmailOption) => {
    setUseEmail(useEmailOption);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validation
    if ((useEmail && !formData.email) || (!useEmail && !formData.phone)) {
      setError(`Please enter your ${useEmail ? "email address" : "phone number"}`);
      setIsSubmitting(false);
      return;
    }

    if (!formData.password) {
      setError("Please enter your password");
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.get("/sanctum/csrf-cookie");

      const payload = {
        password: formData.password,
        ...(useEmail 
          ? { email: formData.email.trim().toLowerCase() } 
          : { phone: formData.phone.trim() }
        ),
      };

      const loginResponse = await axios.post("/api/login", payload);
      const { user, token } = loginResponse.data;

      localStorage.setItem("auth_token", token);

      if (rememberMe) {
        localStorage.setItem(useEmail ? "email" : "phone", formData[useEmail ? "email" : "phone"]);
      } else {
        localStorage.removeItem("email");
        localStorage.removeItem("phone");
      }

      setShowSuccess(true);
      
      setTimeout(() => {
        const role = user.role?.toLowerCase() || "user";
        setUser({ role, ...user });
        
        switch (role) {
          case "admin":
            navigate("/admin");
            break;
          case "worker":
            navigate("/worker/dashboard");
            break;
          default:
            navigate("/");
        }
      }, 1500);

    } catch (err) {
      console.error("Login error:", err);
      
      if (err.response?.status === 419) {
        setError("Session expired. Please refresh the page and try again.");
      } else if (err.response?.status === 401) {
        setError("Invalid credentials. Please check your login details.");
      } else if (err.response?.status === 422) {
        setError("Please check your input fields and try again.");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Unable to connect to server. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      {/* Back to Home Button */}
      <div className={styles.backToHome}>
        <button 
          className={styles.homeBtn}
          onClick={() => navigate("/")}
          type="button"
        >
          ← Back to Home
        </button>
      </div>

      <div className={styles.card}>
        {/* Form Section */}
        <div className={styles.formSection}>
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h2>Welcome Back</h2>
              <p>Sign in to your account to continue</p>
            </div>

            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}

            {showSuccess && (
              <div className={styles.successMessage}>
                ✅ Login successful! Redirecting...
              </div>
            )}

            {/* Auth Type Toggle */}
            <div className={styles.authToggle}>
              <button
                type="button"
                className={`${styles.toggleBtn} ${useEmail ? styles.active : ""}`}
                onClick={() => handleToggle(true)}
              >
                Email
              </button>
              <button
                type="button"
                className={`${styles.toggleBtn} ${!useEmail ? styles.active : ""}`}
                onClick={() => handleToggle(false)}
              >
                Phone
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Email/Phone Input */}
              <div className={styles.inputGroup}>
                <input
                  ref={useEmail ? emailRef : phoneRef}
                  type={useEmail ? "email" : "tel"}
                  id={useEmail ? "email" : "phone"}
                  value={useEmail ? formData.email : formData.phone}
                  onChange={handleChange}
                  className={styles.inputField}
                  placeholder=" "
                  autoComplete={useEmail ? "email" : "tel"}
                  disabled={isSubmitting}
                />
                <label htmlFor={useEmail ? "email" : "phone"} className={styles.inputLabel}>
                  {useEmail ? "Email Address" : "Phone Number"}
                </label>
              </div>

              {/* Password Input */}
              <div className={styles.inputGroup}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={styles.inputField}
                  placeholder=" "
                  autoComplete="current-password"
                  disabled={isSubmitting}
                />
                <label htmlFor="password" className={styles.inputLabel}>
                  Password
                </label>
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className={styles.rememberForgot}>
                <label className={styles.rememberMe} onClick={() => setRememberMe(!rememberMe)}>
                  <div className={`${styles.checkbox} ${rememberMe ? styles.checked : ""}`} />
                  <span>Remember me</span>
                </label>
                <a href="#forgot" className={styles.forgotLink}>
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className={styles.spinner} />
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className={styles.signupPrompt}>
              Don't have an account? 
              <a 
                href="/signup" 
                className={styles.signupLink}
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/signup");
                }}
              >
                Sign up
              </a>
            </div>
          </div>
        </div>

        {/* Welcome Section */}
        <div className={styles.welcomeSection}>
          <div className={styles.welcomeContent}>
            <div className={styles.logo}>✦</div>
            <h1>Hello, Friend!</h1>
            <p>
              Enter your personal details and start your journey with us. 
              Discover amazing features and connect with our community.
            </p>
            <button 
              className={styles.toggleBtn}
              onClick={() => navigate("/signup")}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                marginTop: '20px'
              }}
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;