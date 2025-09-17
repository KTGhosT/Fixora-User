import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../services/api";
import styles from "./account.module.css";

const Sidebar = () => (
  <aside className={styles.sidebar}>
    <div className={styles.logoContainer}>
      <img
        src="https://via.placeholder.com/150"
        alt="Logo"
        className={styles.logo}
      />
    </div>
    <nav>
      <ul className={styles.menuList}>
        {[
          "Overview",
          "Messages",
          "Transactions",
          "Calendar",
          "Map",
          "Settings",
        ].map((item) => (
          <li key={item} className={styles.menuItem}>
            <a
              href="#"
              className={`${styles.menuLink} ${
                item === "Settings" ? styles.active : ""
              }`}
              aria-current={item === "Settings" ? "page" : undefined}
            >
              {item}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  </aside>
);

const ProfileForm = ({ user, setUser, setPropUser }) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    birthday: "",
    gender: "",
    email: "",
    phone: "",
    address: "",
    number: "",
    city: "",
    state: "",
    zip: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        birthday: user.birthday || "",
        gender: user.gender || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        number: user.number || "",
        city: user.city || "",
        state: user.state || "",
        zip: user.zip || "",
      });
    }
  }, [user]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setMessage("");
  }, []);

  // Sanctum: No need to send Bearer token, just use axiosInstance (withCredentials: true)
  const handleSave = useCallback(async () => {
    setIsLoading(true);
    setMessage("");
    try {
      // Ensure CSRF cookie is set before making the request
      await axiosInstance.get("/sanctum/csrf-cookie");
      const res = await axiosInstance.put("/api/profile", formData);
      const updatedUser = res.data.user || res.data;
      setUser(updatedUser);
      if (setPropUser) {
        setPropUser(updatedUser);
      }
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Profile update error:", err);
      if (err.response) {
        setMessage(err.response.data.message || "Failed to update profile");
      } else if (err.request) {
        setMessage("Network error. Please check your connection.");
      } else {
        setMessage("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  }, [formData, setUser, setPropUser]);

  const fields = [
    { label: "First Name", name: "first_name", type: "text" },
    { label: "Last Name", name: "last_name", type: "text" },
    { label: "Birthday", name: "birthday", type: "date" },
    { label: "Gender", name: "gender", type: "select", options: ["Male", "Female", "Other"] },
    { label: "Email", name: "email", type: "email", readOnly: true },
    { label: "Phone", name: "phone", type: "text" },
    { label: "Address", name: "address", type: "text" },
    { label: "Number", name: "number", type: "text" },
    { label: "City", name: "city", type: "text" },
    {
      label: "State",
      name: "state",
      type: "select",
      options: ["California", "New York", "Texas", "Florida"],
    },
    { label: "ZIP", name: "zip", type: "text" },
  ];

  return (
    <section className={styles.profileCard} aria-label="User profile information">
      <header className={styles.profileHeader}>
        <h2 className={styles.profileTitle}>General Information</h2>
        <button
          type="button"
          onClick={handleSave}
          className={styles.saveButton}
          disabled={isLoading}
          aria-live="polite"
          aria-busy={isLoading}
        >
          {isLoading ? "Saving..." : "Save All"}
        </button>
      </header>

      {message && (
        <div
          className={`${styles.message} ${
            message.includes("successfully") ? styles.success : styles.error
          }`}
          role={message.includes("successfully") ? "status" : "alert"}
        >
          {message}
        </div>
      )}

      <form className={styles.formGrid} onSubmit={(e) => e.preventDefault()}>
        {fields.map(({ label, name, type, options, readOnly }) => (
          <div key={name} className={styles.inputGroup}>
            <label htmlFor={name} className={styles.label}>
              {label}
            </label>
            {type === "select" ? (
              <select
                id={name}
                name={name}
                value={formData[name] || ""}
                onChange={handleChange}
                className={styles.input}
                disabled={readOnly}
                aria-readonly={readOnly || undefined}
              >
                <option value="">Select {label}</option>
                {options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={name}
                type={type}
                name={name}
                value={formData[name] || ""}
                onChange={handleChange}
                placeholder={label}
                readOnly={readOnly || false}
                className={`${styles.input} ${readOnly ? styles.readOnly : ""}`}
              />
            )}
          </div>
        ))}
      </form>
    </section>
  );
};

const ProfileCard = ({ user }) => (
  <aside className={styles.profileSidebar} aria-label="User profile summary">
    <div className={styles.profileStatus}>
      <span className={styles.statusIndicator} aria-hidden="true">•</span>
      <img
        src="https://via.placeholder.com/30"
        alt="User icon"
        className={styles.userIcon}
      />
    </div>
    <img
      src="https://via.placeholder.com/150"
      alt="Profile"
      className={styles.profileImage}
    />
    <h3 className={styles.profileName}>
      {user?.first_name} {user?.last_name}
    </h3>
    <p className={styles.profileRole}>{user?.role}</p>
    <p className={styles.profileLocation}>
      {user?.city}, {user?.state}
    </p>
  </aside>
);

const Account = ({ user: propUser, setUser: setPropUser }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(propUser);
  const [isLoading, setIsLoading] = useState(!propUser);
  const [error, setError] = useState(null);

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
      <main className={styles.container}>
        <p className={styles.loading}>Loading user data...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.container}>
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
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <button
        type="button"
        onClick={() => navigate("/")}
        className={styles.backButton}
        aria-label="Back to Home"
      >
        ← Back to Home
      </button>
      <Sidebar />
      <section className={styles.content}>
        <ProfileForm user={user} setUser={setUser} setPropUser={setPropUser} />
        <ProfileCard user={user} />
      </section>
    </main>
  );
};

export default Account;
