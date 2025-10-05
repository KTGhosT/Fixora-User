import React, { useState, useEffect } from "react";
import axiosInstance from "../../services/api";
import styles from "./Login.module.css";

function ForgotPassword({ onClose }) {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState("email"); // email, token, reset
  const [tokenVerified, setTokenVerified] = useState(false);

  // Check if token exists in URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
      setStep("token");
      verifyToken(tokenParam);
    }
  }, []);

  const verifyToken = async (tokenToVerify) => {
    try {
      const response = await axiosInstance.post('/api/verify-reset-token', {
        token: tokenToVerify
      });
      setTokenVerified(true);
      setStep("reset");
      setMessage("Token verified successfully. You can now reset your password.");
    } catch (err) {
      setError("Invalid or expired reset token. Please request a new one.");
      setStep("email");
    }
  };

  const handleSendResetLink = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setMessage("");

    if (!email) {
      setError("Please enter your email address");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axiosInstance.post('/api/forgot-password', {
        email: email.trim().toLowerCase()
      });
      
      setMessage("Password reset link has been sent to your email! Please check your inbox and spam folder.");
      setEmail("");
    } catch (err) {
      console.error("Forgot password error:", err);
      const errorMessage = err.response?.data?.message || "Failed to send reset link. Please try again.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyToken = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setMessage("");

    if (!token) {
      setError("Please enter the reset token");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axiosInstance.post('/api/verify-reset-token', {
        token: token.trim()
      });
      
      setTokenVerified(true);
      setStep("reset");
      setMessage("Token verified successfully. You can now reset your password.");
    } catch (err) {
      console.error("Token verification error:", err);
      const errorMessage = err.response?.data?.message || "Invalid or expired reset token. Please request a new one.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setMessage("");

    if (!newPassword || !confirmPassword) {
      setError("Please fill in all password fields");
      setIsSubmitting(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axiosInstance.post('/api/reset-password', {
        token: token,
        password: newPassword,
        password_confirmation: confirmPassword
      });
      
      setMessage("Password reset successfully! You can now login with your new password.");
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Reset password error:", err);
      const errorMessage = err.response?.data?.message || "Failed to reset password. Please try again.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderEmailStep = () => (
    <>
      <p>Enter your email address and we'll send you a link to reset your password.</p>
      
      <form onSubmit={handleSendResetLink} className={styles.forgotForm}>
        <div className={styles.inputGroup}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.inputField}
            placeholder=" "
            disabled={isSubmitting}
          />
          <label className={styles.inputLabel}>
            Email Address
          </label>
          <span className={styles.inputIcon}>📧</span>
        </div>

        <button
          type="submit"
          className={`${styles.submitBtn} ${isSubmitting ? styles.loading : ""}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className={styles.spinner} />
              Sending Reset Link...
            </>
          ) : (
            "Send Reset Link"
          )}
        </button>
      </form>
    </>
  );

  const renderTokenStep = () => (
    <>
      <p>Enter the reset token that was sent to your email address.</p>
      
      <form onSubmit={handleVerifyToken} className={styles.forgotForm}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className={styles.inputField}
            placeholder=" "
            disabled={isSubmitting}
          />
          <label className={styles.inputLabel}>
            Reset Token
          </label>
          <span className={styles.inputIcon}>🔑</span>
        </div>

        <button
          type="submit"
          className={`${styles.submitBtn} ${isSubmitting ? styles.loading : ""}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className={styles.spinner} />
              Verifying Token...
            </>
          ) : (
            "Verify Token"
          )}
        </button>
      </form>
    </>
  );

  const renderResetStep = () => (
    <>
      <p>Enter your new password below.</p>
      
      <form onSubmit={handleResetPassword} className={styles.forgotForm}>
        <div className={styles.inputGroup}>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={styles.inputField}
            placeholder=" "
            disabled={isSubmitting}
          />
          <label className={styles.inputLabel}>
            New Password
          </label>
          <span className={styles.inputIcon}>🔒</span>
        </div>

        <div className={styles.inputGroup}>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={styles.inputField}
            placeholder=" "
            disabled={isSubmitting}
          />
          <label className={styles.inputLabel}>
            Confirm Password
          </label>
          <span className={styles.inputIcon}>🔒</span>
        </div>

        <button
          type="submit"
          className={`${styles.submitBtn} ${isSubmitting ? styles.loading : ""}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className={styles.spinner} />
              Resetting Password...
            </>
          ) : (
            "Reset Password"
          )}
        </button>
      </form>
    </>
  );

  const getStepTitle = () => {
    switch (step) {
      case "email":
        return "Reset Your Password";
      case "token":
        return "Verify Reset Token";
      case "reset":
        return "Set New Password";
      default:
        return "Reset Your Password";
    }
  };

  return (
    <div className={styles.forgotPasswordOverlay}>
      <div className={styles.forgotPasswordPopup} onClick={(e) => e.stopPropagation()}>
        <div className={styles.popupHeader}>
          <h3>{getStepTitle()}</h3>
          <button 
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className={styles.popupContent}>
          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          {message && (
            <div className={styles.successMessage}>
              {message}
            </div>
          )}

          {step === "email" && renderEmailStep()}
          {step === "token" && renderTokenStep()}
          {step === "reset" && renderResetStep()}

          <div className={styles.popupFooter}>
            {step === "email" && (
              <button 
                className={styles.backToLogin}
                onClick={onClose}
              >
                ← Back to Login
              </button>
            )}
            {step === "token" && (
              <button 
                className={styles.backToLogin}
                onClick={() => setStep("email")}
              >
                ← Back to Email
              </button>
            )}
            {step === "reset" && (
              <button 
                className={styles.backToLogin}
                onClick={() => setStep("email")}
              >
                ← Start Over
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;