import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../services/api";
import UserLayout from "../../layouts/user/UserLayout";
import Profile from "./Profile";
import Settings from "./Settings";
import BookingManagement from "../../components/user/BookingManagement";
import styles from "./account.module.css";


const Account = ({ user: propUser, setUser: setPropUser }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(propUser);
  const [isLoading, setIsLoading] = useState(!propUser);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");

  // Update local user state when prop changes
  useEffect(() => {
    if (propUser) {
      setUser(propUser);
      setIsLoading(false);
    }
  }, [propUser]);

  useEffect(() => {
    // Only fetch if we don't have user data
    if (!propUser) {
      const fetchUser = async () => {
        try {
          // Ensure CSRF cookie is set before making the request
          await axiosInstance.get("/sanctum/csrf-cookie");
          // No need for Bearer token, Sanctum uses session/cookie
          const res = await axiosInstance.get("/api/profile");
          const userData = res.data.user || res.data; // Handle different response formats
          setUser(userData);
          if (setPropUser) {
            setPropUser(userData);
          }
          // Update localStorage with fresh user data
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (err) {
          console.error("User fetch error:", err);
          if (err.response?.status === 401) {
            setError("Authentication failed. Please login again.");
            // Redirect to login after a short delay
            setTimeout(() => navigate("/login"), 2000);
          } else if (err.response) {
            setError(err.response.data.message || "Failed to fetch user data");
          } else {
            setError("Network error. Please check your connection.");
          }
        } finally {
          setIsLoading(false);
        }
      };

      fetchUser();
    }
  }, [propUser, setPropUser, navigate]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <p className={styles.loading}>Loading user data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h2>Unable to Load Account</h2>
          <p className={styles.error} role="alert">{error}</p>
          <div className={styles.errorActions}>
            <button 
              onClick={() => window.location.reload()} 
              className={styles.retryButton}
            >
              Try Again
            </button>
            <button 
              onClick={() => navigate("/login")} 
              className={styles.loginButton}
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <Profile user={user} setUser={setUser} setPropUser={setPropUser} />;
      case "bookings":
        return <BookingManagement user={user} />;
      case "messages":
        return (
          <div className={styles.placeholderContent}>
            <h2>Messages</h2>
            <p>Your messages will appear here.</p>
          </div>
        );
      case "transactions":
        return (
          <div className={styles.placeholderContent}>
            <h2>Transactions</h2>
            <p>Your transaction history will appear here.</p>
          </div>
        );
      case "settings":
        return <Settings user={user} setUser={setUser} setPropUser={setPropUser} />;
      default:
        return <Profile user={user} setUser={setUser} setPropUser={setPropUser} />;
    }
  };

  return (
    <UserLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </UserLayout>
  );
};

export default Account;
