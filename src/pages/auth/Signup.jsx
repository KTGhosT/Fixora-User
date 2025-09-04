import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Signup.module.css";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "" 
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsSubmitting(false);
      return;
    }
  
    try {
      const res = await fetch("http://127.0.0.1:8000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.confirmPassword,
          role: "customer",
        }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        // Store user locally
        localStorage.setItem("user", JSON.stringify(data.user));
  
        // Redirect
        if (data.user.role === "admin") navigate("/admin");
        else if (data.user.role === "worker") navigate("/worker/dashboard");
        else navigate("/"); // customer or guest
      } else {
        setError(data.errors ? Object.values(data.errors).flat().join(", ") : "Signup failed");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError(`Server error: ${err.message}`);
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className={styles.signupContainer}>
      <div className={styles.welcomePanel}>
        <div className={styles.welcomeContent}>
          <h1>Welcome Friend</h1>
          <p>To keep connected with us please login with your personal info</p>
          <button 
            className={styles.switchBtn}
            onClick={() => navigate("/login")}
          >
            SIGN IN
          </button>
        </div>
      </div>

      <div className={styles.formPanel}>
        <div className={styles.formContainer}>
          <h2>Create Account</h2>
          
          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          <div className={styles.socialButtons}>
            <button className={styles.socialBtn}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-极.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              Sign up with GitHub
            </button>
            <button className={styles.socialBtn}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 极2.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.极-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
              </svg>
              Sign up with Google
            </button>
          </div>

          <div className={styles.divider}>
            <span>or use your email for registration</span>
          </div>

          <form onSubmit={handleSubmit} className={styles.signupForm}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder=" "
              />
              <label htmlFor="name">Name</label>
            </div>

            <div className={styles.inputGroup}>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder=" "
              />
              <label htmlFor="email">Email</label>
            </div>

            <div className={styles.inputGroup}>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder=" "
              />
              <label htmlFor="password">Password</label>
            </div>

            <div className={styles.inputGroup}>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder=" "
              />
              <label htmlFor="confirmPassword">Confirm Password</label>
            </div>

            <button 
              type="submit" 
              className={`${styles.submitBtn} ${isSubmitting ? styles.submitting : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className={styles.spinner}></div>
              ) : (
                "SIGN UP"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;