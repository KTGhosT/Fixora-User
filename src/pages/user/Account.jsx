// Account.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/api"; // Use your configured instance
import styles from "./account.module.css";

const Sidebar = () => (
  <div className={styles.sidebar}>
    <div className={styles.logoContainer}>
      <img
        src="https://via.placeholder.com/150"
        alt="Logo"
        className={styles.logo}
      />
    </div>
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
          >
            {item}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const ProfileForm = ({ user, setUser }) => {
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage(""); // Clear any previous messages
  };

  const handleSave = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.put("/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Update user data
      setUser(res.data.user);
      setMessage("Profile updated successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Profile update error:", err);
      
      // Better error handling
      if (err.response) {
        // Server responded with error status
        setMessage(err.response.data.message || "Failed to update profile");
      } else if (err.request) {
        // Request was made but no response received
        setMessage("Network error. Please check your connection.");
      } else {
        // Something else happened
        setMessage("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.profileCard}>
      <div className={styles.profileHeader}>
        <h2 className={styles.profileTitle}>General information</h2>
        <button 
          onClick={handleSave} 
          className={styles.saveButton}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save All"}
        </button>
      </div>

      {message && (
        <div className={`${styles.message} ${message.includes("successfully") ? styles.success : styles.error}`}>
          {message}
        </div>
      )}

      <div className={styles.formGrid}>
        {[
          { label: "First Name", name: "first_name", type: "text" },
          { label: "Last Name", name: "last_name", type: "text" },
          { label: "Birthday", name: "birthday", type: "date" },
          { label: "Gender", name: "gender", type: "select", options: ["Male", "Female", "Other"] },
          { label: "Email", name: "email", type: "email", readOnly: true },
          { label: "Phone", name: "phone", type: "text" },
          { label: "Address", name: "address", type: "text" },
          { label: "Number", name: "number", type: "text" },
          { label: "City", name: "city", type: "text" },
          { label: "State", name: "state", type: "select", options: ["California", "New York", "Texas", "Florida"] },
          { label: "ZIP", name: "zip", type: "text" },
        ].map((field) => (
          <div key={field.name} className={styles.inputGroup}>
            <label className={styles.label}>{field.label}</label>
            {field.type === "select" ? (
              <select
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                className={styles.input}
                disabled={field.readOnly}
              >
                <option value="">Select {field.label}</option>
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                placeholder={field.label}
                readOnly={field.readOnly || false}
                className={`${styles.input} ${field.readOnly ? styles.readOnly : ""}`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const ProfileCard = ({ user }) => (
  <div className={styles.profileSidebar}>
    <div className={styles.profileStatus}>
      <span className={styles.statusIndicator}>•</span>
      <img
        src="https://via.placeholder.com/30"
        alt="User"
        className={styles.userIcon}
      />
    </div>
    <img
      src="https://via.placeholder.com/150"
      alt="Profile"
      className={styles.profileImage}
    />
    <h3 className={styles.profileName}>{user?.first_name} {user?.last_name}</h3>
    <p className={styles.profileRole}>{user?.role}</p>
    <p className={styles.profileLocation}>{user?.city}, {user?.state}</p>
  </div>
);

const Account = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found");
          setIsLoading(false);
          return;
        }

        const res = await axiosInstance.get("/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        console.error("User fetch error:", err);
        
        if (err.response?.status === 401) {
          setError("Authentication failed. Please login again.");
          // Optionally redirect to login
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
  }, []);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading user data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <ProfileForm user={user} setUser={setUser} />
        <ProfileCard user={user} />
      </div>
    </div>
  );
};

export default Account;
