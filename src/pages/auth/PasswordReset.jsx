import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "../../services/api";
import styles from "./Login.module.css";

function PasswordReset() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [tokenVerified, setTokenVerified] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    console.log('PasswordReset: URL params:', searchParams.toString());
    console.log('PasswordReset: Token found:', tokenParam);
    
    if (tokenParam) {
      setToken(tokenParam);
      verifyToken(tokenParam);
    } else {
      setError("No reset token provided. Please use the link from your email.");
    }
  }, [searchParams]);

  const verifyToken = async (tokenToVerify) => {
    try {
      const response = await axiosInstance.post('/api/verify-reset-token', {
        token: tokenToVerify
      });
      setTokenVerified(true);
      setMessage("Token verified successfully. You can now reset your password.");
    } catch (err) {
      setError("Invalid or expired reset token. Please request a new one.");
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
      
      setMessage("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error("Reset password error:", err);
      const errorMessage = err.response?.data?.message || "Failed to reset password. Please try again.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!tokenVerified && !error) {
    return (
      <div className={styles.forgotPasswordOverlay}>
        <div className={styles.forgotPasswordPopup}>
          <div className={styles.popupHeader}>
            <h3>Verifying Reset Token</h3>
          </div>
          <div className={styles.popupContent}>
            <div className={styles.spinner} />
            <p>Please wait while we verify your reset token...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.forgotPasswordOverlay}>
      <div className={styles.forgotPasswordPopup}>
        <div className={styles.popupHeader}>
          <h3>Set New Password</h3>
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

          {tokenVerified && (
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
          )}

          <div className={styles.popupFooter}>
            <button 
              className={styles.backToLogin}
              onClick={() => navigate('/login')}
            >
              ← Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PasswordReset;
