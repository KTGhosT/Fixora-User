// PhoneLogin.jsx
import { auth } from "./firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "./services/api";

function PhoneLogin({ setUser }) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  // Format phone number with country code
  const formatPhoneNumber = (phoneNumber) => {
    const cleaned = phoneNumber.replace(/\D/g, ''); // remove non-digits
    
    // If number starts with 0 (like 0771234567), convert to +94
    if (cleaned.startsWith("0")) {
      return `+94${cleaned.substring(1)}`;
    }
  
    // If user already typed +94, just return
    if (phoneNumber.startsWith("+94")) {
      return phoneNumber;
    }
  
    // Fallback: force +94
    return `+94${cleaned}`;
  };
  

  const sendOtp = async () => {
    if (!phone.trim()) return setError("Enter phone number");
  
    setLoading(true);
    setError("");
    setSuccess("");
  
    try {
      if (window.recaptchaVerifier) window.recaptchaVerifier.clear();

      // Use modular SDK signature: new RecaptchaVerifier(auth, containerId, params)
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        { size: "invisible" }
      );

      const formattedPhone = formatPhoneNumber(phone);
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);
      window.confirmationResult = confirmationResult;
      setOtpSent(true);
      setSuccess("OTP sent successfully! (or auto-bypassed for test number)");
    } catch (err) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };
  

  const verifyOtp = async () => {
    if (!otp.trim()) {
      setError("Please enter the OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await window.confirmationResult.confirm(otp);
      console.log("OTP verified!", result.user);

      // Get Firebase ID token
      const token = await result.user.getIdToken();
      
      // Send token to Laravel backend and persist returned API token
      const response = await axios.post("/api/firebase-login", { token });
      
      if (response.data.success) {
        if (response.data.token) {
          localStorage.setItem('auth_token', response.data.token);
        }
        setUser(response.data.user);
        setSuccess("Login successful!");
        navigate("/");
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear(); // only clear once
      }
    };
  }, []);
  

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '50px auto', 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <h2>Phone Login</h2>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          {error}
        </div>
      )}
      
      {success && (
        <div style={{ color: 'green', marginBottom: '10px' }}>
          {success}
        </div>
      )}

      <div style={{ marginBottom: '15px' }}>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter phone number (e.g., +1234567890)"
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
          disabled={otpSent}
        />
        <button
          onClick={sendOtp}
          disabled={loading || otpSent}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: otpSent ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: otpSent ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? "Sending..." : otpSent ? "OTP Sent" : "Send OTP"}
        </button>
      </div>

      {otpSent && (
        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          <button
            onClick={verifyOtp}
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: loading ? '#ccc' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </div>
      )}

      <div id="recaptcha-container"></div>
    </div>
  );
}

export default PhoneLogin;
