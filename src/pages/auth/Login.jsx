import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

function Login({ setUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role.toLowerCase());
        setUser({ token: data.token, role: data.user.role.toLowerCase() });

        if (data.user.role.toLowerCase() === "admin") navigate("/admin");
        else if (data.user.role.toLowerCase() === "worker") navigate("/worker/dashboard");
        else navigate("/");
      } else {
        const errorMessage =
          data.message ||
          data.error ||
          (data.errors ? Object.values(data.errors).flat().join(", ") : "Login failed");
        setError(errorMessage);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(`Network error: ${err.message}. Please check if the server is running.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.formPanel}>
        <div className={styles.formContainer}>
          <h2>Sign In</h2>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <div className={styles.socialButtons}>
            <button className={styles.socialBtn}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Sign in with GitHub
            </button>
            <button className={styles.socialBtn}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
              >
                <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 18c-3.313 0-6-2.687-6-6s2.687-6 6-6c1.027 0 1.973.25 2.82.693l-1.447 1.447c-.32-.143-.68-.229-1.063-.229-1.657 0-3 1.343-3 3s1.343 3 3 3c1.284 0 2.367-.807 2.797-1.93h-2.797v-2h5c0 3.313-2.687 6-6 6z" />
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
                type={showPassword ? "text" : "password"}
                id="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder=" "
              />
              <label htmlFor="password">Password</label>
              <button
                type="button"
                className={styles.togglePassword}
                onClick={togglePasswordVisibility}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <div className={styles.rememberForgot}>
              <label className={styles.rememberMe}>
                <input type="checkbox" />
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
            >
              {isSubmitting ? <div className={styles.spinner}></div> : "SIGN IN"}
            </button>
          </form>
        </div>
      </div>

      <div className={styles.welcomePanel}>
        <div className={styles.welcomeContent}>
          <h1>Hello, Friend!</h1>
          <p>Enter your personal details and start your journey with us</p>
          <button className={styles.switchBtn} onClick={() => navigate("/signup")}>
            SIGN UP
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;