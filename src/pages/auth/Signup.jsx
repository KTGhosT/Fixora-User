import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Signup.module.css";

function Signup() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  
  const [useEmail, setUseEmail] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    calculatePasswordStrength(formData.password);
  }, [formData.password]);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength >= 75) return "#10b981";
    if (passwordStrength >= 50) return "#f59e0b";
    if (passwordStrength >= 25) return "#ef4444";
    return "#e5e7eb";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength >= 75) return "Strong";
    if (passwordStrength >= 50) return "Medium";
    if (passwordStrength >= 25) return "Weak";
    return "Very Weak";
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (error) setError(null);
  };

  const handleToggle = (useEmailOption) => {
    setUseEmail(useEmailOption);
    setError(null);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      return "Please enter your full name";
    }

    if (useEmail && !formData.email.trim()) {
      return "Please enter your email address";
    }

    if (!useEmail && !formData.phone.trim()) {
      return "Please enter your phone number";
    }

    if (useEmail && !/\S+@\S+\.\S+/.test(formData.email)) {
      return "Please enter a valid email address";
    }

    if (formData.password.length < 8) {
      return "Password must be at least 8 characters long";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match";
    }

    if (passwordStrength < 50) {
      return "Please choose a stronger password";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/signup", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: useEmail ? formData.email.trim().toLowerCase() : null,
          phone: !useEmail ? formData.phone.trim() : null,
          password: formData.password,
          password_confirmation: formData.confirmPassword,
          role: "customer",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage("Account created successfully! Redirecting to login...");
        
        setTimeout(() => {
          navigate("/login");
        }, 2000);

      } else {
        setError(
          data.errors 
            ? Object.values(data.errors).flat().join(", ")
            : data.message || "Signup failed. Please try again."
        );
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordsMatch = formData.password === formData.confirmPassword;
  const isFormValid = formData.name && 
                     (useEmail ? formData.email : formData.phone) && 
                     formData.password && 
                     formData.confirmPassword && 
                     passwordsMatch;

  return (
    <div className={styles.signupContainer}>
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
        {/* Welcome Section */}
        <div className={styles.welcomeSection}>
          <div className={styles.welcomeContent}>
            <div className={styles.logo}>✦</div>
            <h1>Welcome Back!</h1>
            <p>
              Already have an account? Sign in to access your personalized dashboard 
              and continue your journey with us.
            </p>
            <div className={styles.authToggle}>
              <button
                type="button"
                className={styles.toggleBtn}
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className={styles.formSection}>
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h2>Create Account</h2>
              <p>Join us today and start your journey</p>
            </div>

            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}

            {successMessage && (
              <div className={styles.successMessage}>
                ✅ {successMessage}
              </div>
            )}

            {/* Auth Type Toggle */}
            <div className={styles.authToggle}>
              <button
                type="button"
                className={`${styles.toggleBtn} ${useEmail ? styles.active : ""}`}
                onClick={() => handleToggle(true)}
              >
                Sign up with Email
              </button>
              <button
                type="button"
                className={`${styles.toggleBtn} ${!useEmail ? styles.active : ""}`}
                onClick={() => handleToggle(false)}
              >
                Sign up with Phone
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Name Input */}
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={styles.inputField}
                  placeholder=" "
                  disabled={isSubmitting}
                  autoComplete="name"
                />
                <label htmlFor="name" className={styles.inputLabel}>
                  Full Name
                </label>
              </div>

              {/* Email/Phone Input */}
              <div className={styles.inputGroup}>
                <input
                  type={useEmail ? "email" : "tel"}
                  id={useEmail ? "email" : "phone"}
                  value={useEmail ? formData.email : formData.phone}
                  onChange={handleChange}
                  className={styles.inputField}
                  placeholder=" "
                  disabled={isSubmitting}
                  autoComplete={useEmail ? "email" : "tel"}
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
                  disabled={isSubmitting}
                  autoComplete="new-password"
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
                
                </button>
                
                {/* Password Strength Meter */}
                {formData.password && (
                  <>
                    <div className={styles.passwordStrength}>
                      <div 
                        className={styles.strengthBar}
                        style={{
                          width: `${passwordStrength}%`,
                          backgroundColor: getPasswordStrengthColor()
                        }}
                      />
                    </div>
                    <div className={styles.strengthText}>
                      Strength: {getPasswordStrengthText()}
                    </div>
                  </>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className={styles.inputGroup}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={styles.inputField}
                  placeholder=" "
                  disabled={isSubmitting}
                  autoComplete="new-password"
                />
                <label htmlFor="confirmPassword" className={styles.inputLabel}>
                  Confirm Password
                </label>
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                
                </button>
                
                {/* Password Match Indicator */}
                {formData.confirmPassword && (
                  <div className={`${styles.passwordMatch} ${passwordsMatch ? styles.valid : styles.invalid}`}>
                    {passwordsMatch ? "✓ Passwords match" : "✗ Passwords don't match"}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={isSubmitting || !isFormValid}
              >
                {isSubmitting ? (
                  <div className={styles.spinner} />
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <div className={styles.loginPrompt}>
              Already have an account? 
              <a 
                href="/login" 
                className={styles.loginLink}
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/login");
                }}
              >
                Sign in
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;