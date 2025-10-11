import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../services/api";
import styles from "./Login.module.css";
import ForgotPassword from "./New ForgotPassword";

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
  const [showForgotPassword, setShowForgotPassword] = useState(false);

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
      // Store user data in localStorage for persistence
      localStorage.setItem("user", JSON.stringify({ role: user.role?.toLowerCase() || "user", ...user }));

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
      {/* Forgot Password Popup */}
      {showForgotPassword && (
        <ForgotPassword onClose={() => setShowForgotPassword(false)} />
      )}

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
        {/* Left Side - Image Section */}
        <div className={styles.imageSection}>
          <div className={styles.imageOverlay}></div>
          <div className={styles.imageContent}>
            <div className={styles.logo}>✦ Fixora</div>
            <h1>Welcome Back!</h1>
            <p>
              Join thousands of professionals who trust Fixora for their service needs. 
              Your journey to better home services starts here.
            </p>
            <div className={styles.features}>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>🔧</span>
                <span>Skilled Professionals</span>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>⚡</span>
                <span>Quick Response</span>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>🛡️</span>
                <span>Verified Workers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form Section */}
        <div className={styles.formSection}>
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h2>Sign In to Fixora</h2>
              <p>Enter your credentials to access your account</p>
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
                <span className={styles.toggleIcon}>📧</span>
                Email
              </button>
              <button
                type="button"
                className={`${styles.toggleBtn} ${!useEmail ? styles.active : ""}`}
                onClick={() => handleToggle(false)}
              >
                <span className={styles.toggleIcon}>📱</span>
                Phone
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
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
                <span className={styles.inputIcon}>
                  {useEmail ? "📧" : "📱"}
                </span>
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
                <span className={styles.inputIcon}>🔒</span>
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
                  <div className={`${styles.checkbox} ${rememberMe ? styles.checked : ""}`}>
                    {rememberMe && <span>✓</span>}
                  </div>
                  <span>Remember me</span>
                </label>
                <button 
                  type="button"
                  className={styles.forgotLink}
                  onClick={() => setShowForgotPassword(true)}
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`${styles.submitBtn} ${isSubmitting ? styles.loading : ""}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className={styles.spinner} />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className={styles.divider}>
              <span>or</span>
            </div>

            <div className={styles.socialLogin}>
              <button type="button" className={styles.socialBtn}>
                <span className={styles.socialIcon}>🔵</span>
                Continue with Facebook
              </button>
              <button type="button" className={styles.socialBtn}>
                <span className={styles.socialIcon}>🔴</span>
                Continue with Google
              </button>
            </div>

            <div className={styles.signupPrompt}>
              Don't have an account? 
              <button 
                className={styles.signupLink}
                onClick={() => navigate("/signup")}
              >
                Sign up now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;