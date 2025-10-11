import React, { useState, useEffect, useCallback, useRef } from "react";
import axiosInstance from "../../services/api";
import { uploadProfilePictureApi, deleteProfilePictureApi, getProfilePictureUrl } from "../../services/profilePicture";
import { Camera, X, Upload } from "lucide-react";
import styles from "./Settings.module.css";

const Settings = ({ user: propUser, setUser: setPropUser }) => {
  const [user, setUser] = useState(propUser);
  const [isLoading, setIsLoading] = useState(!propUser);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  // Settings state
  const [settings, setSettings] = useState({
    // Personal settings
    first_name: "",
    last_name: "",
    phone: "",
    address: "",
    number: "",
    city: "",
    state: "",
    zip: "",
    
    // Notification settings
    email_notifications: true,
    sms_notifications: true,
    push_notifications: true,
    booking_reminders: true,
    service_updates: true,
    promotional_emails: false,
    
    // Call service settings
    call_service_enabled: true,
    emergency_contact: "",
    preferred_contact_method: "phone", // phone, email, sms
    service_hours: "9:00 AM - 6:00 PM",
    timezone: "UTC",
  });

  useEffect(() => {
    if (propUser) {
      setUser(propUser);
      setIsLoading(false);
      // Initialize settings with user data
      setSettings(prev => ({
        ...prev,
        first_name: propUser.first_name || "",
        last_name: propUser.last_name || "",
        phone: propUser.phone || "",
        address: propUser.address || "",
        number: propUser.number || "",
        city: propUser.city || "",
        state: propUser.state || "",
        zip: propUser.zip || "",
      }));
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

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setMessage("");
  }, []);

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage("Please select a valid image file.");
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setMessage("Image size must be less than 5MB.");
        return;
      }
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleUploadPicture = useCallback(async () => {
    const file = fileInputRef.current?.files[0];
    if (!file) return;

    setIsUploadingPicture(true);
    setMessage("");

    try {
      const response = await uploadProfilePictureApi(file);
      const updatedUser = { ...user, profile_picture: response.profile_picture };
      
      setUser(updatedUser);
      if (setPropUser) {
        setPropUser(updatedUser);
      }
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setMessage("Profile picture updated successfully!");
      setPreviewImage(null);
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Profile picture upload error:", err);
      setMessage(err.response?.data?.message || "Failed to upload profile picture");
    } finally {
      setIsUploadingPicture(false);
    }
  }, [user, setPropUser]);

  const handleDeletePicture = useCallback(async () => {
    if (!window.confirm("Are you sure you want to delete your profile picture?")) {
      return;
    }

    setIsUploadingPicture(true);
    setMessage("");

    try {
      await deleteProfilePictureApi();
      const updatedUser = { ...user, profile_picture: null };
      
      setUser(updatedUser);
      if (setPropUser) {
        setPropUser(updatedUser);
      }
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setMessage("Profile picture deleted successfully!");
      setPreviewImage(null);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Profile picture delete error:", err);
      setMessage(err.response?.data?.message || "Failed to delete profile picture");
    } finally {
      setIsUploadingPicture(false);
    }
  }, [user, setPropUser]);

  const handleCancelUpload = useCallback(() => {
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    setMessage("");
    
    try {
      await axiosInstance.get("/sanctum/csrf-cookie");
      
      // Update profile information
      const profileData = {
        first_name: settings.first_name,
        last_name: settings.last_name,
        phone: settings.phone,
        address: settings.address,
        number: settings.number,
        city: settings.city,
        state: settings.state,
        zip: settings.zip,
      };
      
      await axiosInstance.put("/api/profile", profileData);
      
      // Update settings (you might need to create a separate endpoint for this)
      const settingsData = {
        email_notifications: settings.email_notifications,
        sms_notifications: settings.sms_notifications,
        push_notifications: settings.push_notifications,
        booking_reminders: settings.booking_reminders,
        service_updates: settings.service_updates,
        promotional_emails: settings.promotional_emails,
        call_service_enabled: settings.call_service_enabled,
        emergency_contact: settings.emergency_contact,
        preferred_contact_method: settings.preferred_contact_method,
        service_hours: settings.service_hours,
        timezone: settings.timezone,
      };
      
      // Update user in state
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      if (setPropUser) {
        setPropUser(updatedUser);
      }
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setMessage("Settings saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Settings update error:", err);
      setMessage(err.response?.data?.message || "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  }, [settings, user, setPropUser]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading settings...</div>
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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Account Settings</h1>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={styles.saveButton}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {message && (
        <div className={`${styles.message} ${
          message.includes("successfully") ? styles.success : styles.error
        }`}>
          {message}
        </div>
      )}

      <div className={styles.sections}>
        {/* Profile Picture */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Profile Picture</h2>
          <div className={styles.profilePictureSection}>
            <div className={styles.currentPicture}>
              <img
                key={`${user?.profile_picture || 'default'}-${Date.now()}`}
                src={previewImage || getProfilePictureUrl(user, true)}
                alt="Profile"
                className={styles.profileImage}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150/6366f1/ffffff?text=' + (user?.first_name?.[0] || 'U');
                }}
              />
              {previewImage && (
                <div className={styles.previewOverlay}>
                  <span className={styles.previewText}>Preview</span>
                </div>
              )}
            </div>
            
            <div className={styles.pictureActions}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className={styles.fileInput}
                id="profile-picture-input"
              />
              <label htmlFor="profile-picture-input" className={styles.uploadButton}>
                <Camera className={styles.buttonIcon} />
                Choose Photo
              </label>
              
              {previewImage && (
                <>
                  <button
                    onClick={handleUploadPicture}
                    disabled={isUploadingPicture}
                    className={styles.uploadConfirmButton}
                  >
                    <Upload className={styles.buttonIcon} />
                    {isUploadingPicture ? "Uploading..." : "Upload"}
                  </button>
                  <button
                    onClick={handleCancelUpload}
                    className={styles.cancelButton}
                  >
                    <X className={styles.buttonIcon} />
                    Cancel
                  </button>
                </>
              )}
              
              {user?.profile_picture && !previewImage && (
                <button
                  onClick={handleDeletePicture}
                  disabled={isUploadingPicture}
                  className={styles.deleteButton}
                >
                  <X className={styles.buttonIcon} />
                  {isUploadingPicture ? "Deleting..." : "Delete"}
                </button>
              )}
            </div>
            
            <div className={styles.pictureInfo}>
              <p>Upload a profile picture to personalize your account.</p>
              <p className={styles.fileInfo}>Supported formats: JPG, PNG, GIF. Max size: 5MB.</p>
            </div>
          </div>
        </section>

        {/* Personal Information */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Personal Information</h2>
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>First Name</label>
              <input
                type="text"
                name="first_name"
                value={settings.first_name}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Last Name</label>
              <input
                type="text"
                name="last_name"
                value={settings.last_name}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Phone</label>
              <input
                type="text"
                name="phone"
                value={settings.phone}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Address</label>
              <input
                type="text"
                name="address"
                value={settings.address}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Number</label>
              <input
                type="text"
                name="number"
                value={settings.number}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>City</label>
              <input
                type="text"
                name="city"
                value={settings.city}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>State</label>
              <input
                type="text"
                name="state"
                value={settings.state}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>ZIP Code</label>
              <input
                type="text"
                name="zip"
                value={settings.zip}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>
          </div>
        </section>

        {/* Notification Settings */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Notification Settings</h2>
          <div className={styles.toggleGrid}>
            <div className={styles.toggleItem}>
              <div className={styles.toggleInfo}>
                <h3 className={styles.toggleTitle}>Email Notifications</h3>
                <p className={styles.toggleDescription}>Receive notifications via email</p>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  name="email_notifications"
                  checked={settings.email_notifications}
                  onChange={handleInputChange}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.toggleItem}>
              <div className={styles.toggleInfo}>
                <h3 className={styles.toggleTitle}>SMS Notifications</h3>
                <p className={styles.toggleDescription}>Receive notifications via SMS</p>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  name="sms_notifications"
                  checked={settings.sms_notifications}
                  onChange={handleInputChange}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.toggleItem}>
              <div className={styles.toggleInfo}>
                <h3 className={styles.toggleTitle}>Push Notifications</h3>
                <p className={styles.toggleDescription}>Receive push notifications</p>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  name="push_notifications"
                  checked={settings.push_notifications}
                  onChange={handleInputChange}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.toggleItem}>
              <div className={styles.toggleInfo}>
                <h3 className={styles.toggleTitle}>Booking Reminders</h3>
                <p className={styles.toggleDescription}>Get reminded about upcoming bookings</p>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  name="booking_reminders"
                  checked={settings.booking_reminders}
                  onChange={handleInputChange}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.toggleItem}>
              <div className={styles.toggleInfo}>
                <h3 className={styles.toggleTitle}>Service Updates</h3>
                <p className={styles.toggleDescription}>Receive updates about your services</p>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  name="service_updates"
                  checked={settings.service_updates}
                  onChange={handleInputChange}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.toggleItem}>
              <div className={styles.toggleInfo}>
                <h3 className={styles.toggleTitle}>Promotional Emails</h3>
                <p className={styles.toggleDescription}>Receive promotional offers and updates</p>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  name="promotional_emails"
                  checked={settings.promotional_emails}
                  onChange={handleInputChange}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
          </div>
        </section>

        {/* Call Service Settings */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Call Service Settings</h2>
          
          <div className={styles.toggleItem}>
            <div className={styles.toggleInfo}>
              <h3 className={styles.toggleTitle}>Enable Call Service</h3>
              <p className={styles.toggleDescription}>Allow service providers to call you directly</p>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                name="call_service_enabled"
                checked={settings.call_service_enabled}
                onChange={handleInputChange}
              />
              <span className={styles.slider}></span>
            </label>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Emergency Contact</label>
              <input
                type="text"
                name="emergency_contact"
                value={settings.emergency_contact}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Emergency contact number"
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Preferred Contact Method</label>
              <select
                name="preferred_contact_method"
                value={settings.preferred_contact_method}
                onChange={handleInputChange}
                className={styles.input}
              >
                <option value="phone">Phone</option>
                <option value="email">Email</option>
                <option value="sms">SMS</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Service Hours</label>
              <input
                type="text"
                name="service_hours"
                value={settings.service_hours}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="e.g., 9:00 AM - 6:00 PM"
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Timezone</label>
              <select
                name="timezone"
                value={settings.timezone}
                onChange={handleInputChange}
                className={styles.input}
              >
                <option value="UTC">UTC</option>
                <option value="EST">Eastern Time</option>
                <option value="PST">Pacific Time</option>
                <option value="CST">Central Time</option>
                <option value="MST">Mountain Time</option>
              </select>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
