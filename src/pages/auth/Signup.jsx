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
        else navigate("/login"); // customer or guest
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
          <h1 style={{ textAlign: "center" }}>Welcome Friend</h1>
          <p style={{ textAlign: "center" }}>
            To keep connected with us please login with your personal info
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              className={styles.switchBtn}
              onClick={() => navigate("/login")}
            >
              SIGN IN
            </button>
          </div>
        </div>
      </div>

      <div className={styles.formPanel}>
        <div className={styles.formContainer}>
          <h2 style={{ textAlign: "center" }}>Create Account</h2>

          {error && (
            <div className={styles.errorMessage} style={{ textAlign: "center" }}>
              {error}
            </div>
          )}

          <div className={styles.socialButtons} style={{ display: "flex", justifyContent: "center" }}>
            <button className={styles.socialBtn} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 极2.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.极-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
              </svg>
              <span style={{ marginLeft: 8 }}>Sign up with Google</span>
            </button>
          </div>

          <div className={styles.divider} style={{ textAlign: "center" }}>
            <span>or use your email for registration</span>
          </div>

          <form onSubmit={handleSubmit} className={styles.signupForm} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div className={styles.inputGroup} style={{ width: "100%" }}>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder=" "
                style={{ textAlign: "left" }}
              />
              <label htmlFor="name">Name</label>
            </div>

            <div className={styles.inputGroup} style={{ width: "100%" }}>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder=" "
                style={{ textAlign: "left" }}
              />
              <label htmlFor="email">Email</label>
            </div>

            <div className={styles.inputGroup} style={{ width: "100%" }}>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder=" "
                style={{ textAlign: "left" }}
              />
              <label htmlFor="password">Password</label>
            </div>

            <div className={styles.inputGroup} style={{ width: "100%" }}>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder=" "
                style={{ textAlign: "left" }}
              />
              <label htmlFor="confirmPassword">Confirm Password</label>
            </div>

            <button
              type="submit"
              className={`${styles.submitBtn} ${isSubmitting ? styles.submitting : ''}`}
              disabled={isSubmitting}
              style={{ alignSelf: "center", width: "100%" }}
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