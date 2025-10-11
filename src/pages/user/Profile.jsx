import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/api";
import { getProfilePictureUrl } from "../../services/profilePicture";
import styles from "./Profile.module.css";

const Profile = ({ user: propUser, setUser: setPropUser }) => {
  const [user, setUser] = useState(propUser);
  const [isLoading, setIsLoading] = useState(!propUser);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (propUser) {
      setUser(propUser);
      setIsLoading(false);
    }
  }, [propUser]);

  useEffect(() => {
    if (!propUser) {
      const fetchUser = async () => {
        try {
          await axiosInstance.get("/sanctum/csrf-cookie");
          const res = await axiosInstance.get("/api/profile");
          const userData = res.data.user || res.data;
          setUser(userData);
          if (setPropUser) {
            setPropUser(userData);
          }
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (err) {
          console.error("User fetch error:", err);
          setError("Failed to fetch user data");
        } finally {
          setIsLoading(false);
        }
      };
      fetchUser();
    }
  }, [propUser, setPropUser]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Error: {error}</div>
      </div>
    );
  }

  const profileSections = [
    {
      title: "Personal Information",
      fields: [
        { label: "First Name", value: user?.first_name || "Not provided" },
        { label: "Last Name", value: user?.last_name || "Not provided" },
        { label: "Email", value: user?.email || "Not provided" },
        { label: "Phone", value: user?.phone || "Not provided" },
        { label: "Birthday", value: user?.birthday || "Not provided" },
        { label: "Gender", value: user?.gender || "Not provided" },
      ]
    },
    {
      title: "Address Information",
      fields: [
        { label: "Address", value: user?.address || "Not provided" },
        { label: "Number", value: user?.number || "Not provided" },
        { label: "City", value: user?.city || "Not provided" },
        { label: "State", value: user?.state || "Not provided" },
        { label: "ZIP Code", value: user?.zip || "Not provided" },
      ]
    },
    {
      title: "Account Information",
      fields: [
        { label: "Role", value: user?.role || "User" },
        { label: "Account Status", value: "Active" },
        { label: "Member Since", value: user?.created_at ? new Date(user.created_at).toLocaleDateString() : "Not available" },
      ]
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.profileImageContainer}>
          <img
            key={`${user?.profile_picture || 'default'}-${Date.now()}`}
            src={getProfilePictureUrl(user, true)}
            alt="Profile"
            className={styles.profileImage}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/150/6366f1/ffffff?text=' + (user?.first_name?.[0] || 'U');
            }}
          />
        </div>
        <div className={styles.profileInfo}>
          <h1 className={styles.profileName}>
            {user?.first_name} {user?.last_name}
          </h1>
          <p className={styles.profileRole}>{user?.role}</p>
          <p className={styles.profileLocation}>
            {user?.city}, {user?.state}
          </p>
        </div>
      </div>

      <div className={styles.sections}>
        {profileSections.map((section, index) => (
          <div key={index} className={styles.section}>
            <h2 className={styles.sectionTitle}>{section.title}</h2>
            <div className={styles.fieldsGrid}>
              {section.fields.map((field, fieldIndex) => (
                <div key={fieldIndex} className={styles.field}>
                  <label className={styles.fieldLabel}>{field.label}</label>
                  <div className={styles.fieldValue}>{field.value}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
