import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../services/api";
import BookingManagement from "../../components/user/BookingManagement";
import styles from "./account.module.css";

// Enhanced SVG Icons
const DashboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
  </svg>
);

const ProfileIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);

const SecurityIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11H16V18H8V11H9.2V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.4,8.7 10.4,10V11H13.6V10C13.6,8.7 12.8,8.2 12,8.2Z"/>
  </svg>
);

const NotificationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
  </svg>
);

const BillingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.43-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
  </svg>
);

const LocationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);

const EmailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
  </svg>
);

const UserIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);

const BookingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
  </svg>
);

// Security Component
const SecurityTab = ({ user }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("New passwords don't match");
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await axiosInstance.put("/user/change-password", {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword
      });
      
      if (response.data.success) {
        setMessage("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.tabContent}>
      <div className={styles.contentHeader}>
        <h2 className={styles.pageTitle}>Security Settings</h2>
        <p className={styles.pageDescription}>Manage your password, two-factor authentication, and security preferences.</p>
      </div>

      {message && (
        <div className={`${styles.message} ${message.includes('success') ? styles.success : styles.error}`}>
          {message}
        </div>
      )}

      <div className={styles.securitySections}>
        {/* Password Change Section */}
        <div className={styles.securityCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"/>
              </svg>
            </div>
            <div>
              <h3 className={styles.cardTitle}>Change Password</h3>
              <p className={styles.cardDescription}>Update your account password</p>
            </div>
          </div>
          
          <form onSubmit={handlePasswordChange} className={styles.passwordForm}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={styles.input}
                placeholder="Enter current password"
                required
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={styles.input}
                placeholder="Enter new password"
                required
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.input}
                placeholder="Confirm new password"
                required
              />
            </div>
            
            <button 
              type="submit" 
              className={styles.saveButton}
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>

        {/* Two-Factor Authentication Section */}
        <div className={styles.securityCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z"/>
              </svg>
            </div>
            <div>
              <h3 className={styles.cardTitle}>Two-Factor Authentication</h3>
              <p className={styles.cardDescription}>Add an extra layer of security to your account</p>
            </div>
          </div>
          
          <div className={styles.toggleSection}>
            <div className={styles.toggleInfo}>
              <span className={styles.toggleLabel}>Enable 2FA</span>
              <span className={styles.toggleDescription}>
                {twoFactorEnabled ? "Two-factor authentication is enabled" : "Two-factor authentication is disabled"}
              </span>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={twoFactorEnabled}
                onChange={(e) => setTwoFactorEnabled(e.target.checked)}
              />
              <span className={styles.toggleSlider}></span>
            </label>
          </div>
        </div>

        {/* Login Alerts Section */}
        <div className={styles.securityCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
              </svg>
            </div>
            <div>
              <h3 className={styles.cardTitle}>Login Alerts</h3>
              <p className={styles.cardDescription}>Get notified of new login attempts</p>
            </div>
          </div>
          
          <div className={styles.toggleSection}>
            <div className={styles.toggleInfo}>
              <span className={styles.toggleLabel}>Email Notifications</span>
              <span className={styles.toggleDescription}>
                {loginAlerts ? "You'll receive email alerts for new logins" : "Login alerts are disabled"}
              </span>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={loginAlerts}
                onChange={(e) => setLoginAlerts(e.target.checked)}
              />
              <span className={styles.toggleSlider}></span>
            </label>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className={styles.securityCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13,3A9,9 0 0,0 4,12H1L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3Z"/>
              </svg>
            </div>
            <div>
              <h3 className={styles.cardTitle}>Recent Activity</h3>
              <p className={styles.cardDescription}>Monitor your account activity</p>
            </div>
          </div>
          
          <div className={styles.activityList}>
            <div className={styles.activityItem}>
              <div className={styles.activityIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <div className={styles.activityDetails}>
                <span className={styles.activityAction}>Successful login</span>
                <span className={styles.activityTime}>2 hours ago</span>
                <span className={styles.activityLocation}>Chrome on Windows</span>
              </div>
            </div>
            
            <div className={styles.activityItem}>
              <div className={styles.activityIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"/>
                </svg>
              </div>
              <div className={styles.activityDetails}>
                <span className={styles.activityAction}>Password changed</span>
                <span className={styles.activityTime}>1 day ago</span>
                <span className={styles.activityLocation}>Chrome on Windows</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Payment Method Modal */}
      {isEditPaymentModalOpen && (
        <EditPaymentMethodModal
          method={editingPaymentMethod}
          onClose={() => {
            setIsEditPaymentModalOpen(false);
            setEditingPaymentMethod(null);
          }}
          onSave={(updatedMethod) => {
            setPaymentMethods(prev => 
              prev.map(method => 
                method.id === updatedMethod.id ? updatedMethod : method
              )
            );
            setIsEditPaymentModalOpen(false);
            setEditingPaymentMethod(null);
          }}
        />
      )}

      {/* Add Payment Method Modal */}
      {isAddPaymentModalOpen && (
        <AddPaymentMethodModal
          onClose={() => setIsAddPaymentModalOpen(false)}
          onSave={(newMethod) => {
            const newId = Math.max(...paymentMethods.map(m => m.id)) + 1;
            setPaymentMethods(prev => [...prev, { ...newMethod, id: newId }]);
            setIsAddPaymentModalOpen(false);
          }}
        />
      )}

      {/* Edit Plan Modal */}
      {isEditPlanModalOpen && (
        <EditPlanModal
          currentPlan={currentPlan}
          onClose={() => setIsEditPlanModalOpen(false)}
          onSave={(updatedPlan) => {
            setCurrentPlan(updatedPlan);
            setIsEditPlanModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

// Notifications Component
const NotificationsTab = ({ user }) => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [message, setMessage] = useState("");

  const handleSavePreferences = async () => {
    try {
      const response = await axiosInstance.put("/user/notification-preferences", {
        email_notifications: emailNotifications,
        push_notifications: pushNotifications,
        sms_notifications: smsNotifications,
        marketing_emails: marketingEmails,
        security_alerts: securityAlerts,
        order_updates: orderUpdates
      });
      
      if (response.data.success) {
        setMessage("Notification preferences updated successfully!");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update preferences");
    }
  };

  return (
    <div className={styles.tabContent}>
      <div className={styles.contentHeader}>
        <h2 className={styles.pageTitle}>Notification Preferences</h2>
        <p className={styles.pageDescription}>Control how and when you receive notifications.</p>
      </div>

      {message && (
        <div className={`${styles.message} ${message.includes('success') ? styles.success : styles.error}`}>
          {message}
        </div>
      )}

      <div className={styles.notificationSections}>
        {/* Communication Preferences */}
        <div className={styles.notificationCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </div>
            <div>
              <h3 className={styles.cardTitle}>Communication Channels</h3>
              <p className={styles.cardDescription}>Choose how you want to receive notifications</p>
            </div>
          </div>
          
          <div className={styles.notificationOptions}>
            <div className={styles.toggleSection}>
              <div className={styles.toggleInfo}>
                <span className={styles.toggleLabel}>Email Notifications</span>
                <span className={styles.toggleDescription}>Receive notifications via email</span>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                />
                <span className={styles.toggleSlider}></span>
              </label>
            </div>
            
            <div className={styles.toggleSection}>
              <div className={styles.toggleInfo}>
                <span className={styles.toggleLabel}>Push Notifications</span>
                <span className={styles.toggleDescription}>Receive browser push notifications</span>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={pushNotifications}
                  onChange={(e) => setPushNotifications(e.target.checked)}
                />
                <span className={styles.toggleSlider}></span>
              </label>
            </div>
            
            <div className={styles.toggleSection}>
              <div className={styles.toggleInfo}>
                <span className={styles.toggleLabel}>SMS Notifications</span>
                <span className={styles.toggleDescription}>Receive text messages for important updates</span>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={smsNotifications}
                  onChange={(e) => setSmsNotifications(e.target.checked)}
                />
                <span className={styles.toggleSlider}></span>
              </label>
            </div>
          </div>
        </div>

        {/* Notification Types */}
        <div className={styles.notificationCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
              </svg>
            </div>
            <div>
              <h3 className={styles.cardTitle}>Notification Types</h3>
              <p className={styles.cardDescription}>Select which types of notifications you want to receive</p>
            </div>
          </div>
          
          <div className={styles.notificationOptions}>
            <div className={styles.toggleSection}>
              <div className={styles.toggleInfo}>
                <span className={styles.toggleLabel}>Security Alerts</span>
                <span className={styles.toggleDescription}>Important security notifications</span>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={securityAlerts}
                  onChange={(e) => setSecurityAlerts(e.target.checked)}
                />
                <span className={styles.toggleSlider}></span>
              </label>
            </div>
            
            <div className={styles.toggleSection}>
              <div className={styles.toggleInfo}>
                <span className={styles.toggleLabel}>Order Updates</span>
                <span className={styles.toggleDescription}>Updates about your service requests</span>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={orderUpdates}
                  onChange={(e) => setOrderUpdates(e.target.checked)}
                />
                <span className={styles.toggleSlider}></span>
              </label>
            </div>
            
            <div className={styles.toggleSection}>
              <div className={styles.toggleInfo}>
                <span className={styles.toggleLabel}>Marketing Emails</span>
                <span className={styles.toggleDescription}>Promotional offers and updates</span>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={marketingEmails}
                  onChange={(e) => setMarketingEmails(e.target.checked)}
                />
                <span className={styles.toggleSlider}></span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.actionButtons}>
        <button onClick={handleSavePreferences} className={styles.saveButton}>
          Save Preferences
        </button>
      </div>
    </div>
  );
};

// Edit Payment Method Modal Component
const EditPaymentMethodModal = ({ method, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    brand: method?.brand || '',
    last4: method?.last4 || '',
    expiry: method?.expiry || '',
    isDefault: method?.isDefault || false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...method, ...formData });
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>Edit Payment Method</h3>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label>Card Brand</label>
            <select 
              value={formData.brand} 
              onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
              required
            >
              <option value="">Select Brand</option>
              <option value="Visa">Visa</option>
              <option value="Mastercard">Mastercard</option>
              <option value="American Express">American Express</option>
              <option value="Discover">Discover</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Last 4 Digits</label>
            <input
              type="text"
              value={formData.last4}
              onChange={(e) => setFormData(prev => ({ ...prev, last4: e.target.value }))}
              maxLength="4"
              pattern="[0-9]{4}"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Expiry Date</label>
            <input
              type="text"
              value={formData.expiry}
              onChange={(e) => setFormData(prev => ({ ...prev, expiry: e.target.value }))}
              placeholder="MM/YY"
              pattern="[0-9]{2}/[0-9]{2}"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.isDefault}
                onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
              />
              Set as default payment method
            </label>
          </div>
          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.saveButton}>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Add Payment Method Modal Component
const AddPaymentMethodModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    type: 'card',
    brand: '',
    last4: '',
    expiry: '',
    isDefault: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>Add Payment Method</h3>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label>Card Brand</label>
            <select 
              value={formData.brand} 
              onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
              required
            >
              <option value="">Select Brand</option>
              <option value="Visa">Visa</option>
              <option value="Mastercard">Mastercard</option>
              <option value="American Express">American Express</option>
              <option value="Discover">Discover</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Card Number (Last 4 digits)</label>
            <input
              type="text"
              value={formData.last4}
              onChange={(e) => setFormData(prev => ({ ...prev, last4: e.target.value }))}
              maxLength="4"
              pattern="[0-9]{4}"
              placeholder="1234"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Expiry Date</label>
            <input
              type="text"
              value={formData.expiry}
              onChange={(e) => setFormData(prev => ({ ...prev, expiry: e.target.value }))}
              placeholder="MM/YY"
              pattern="[0-9]{2}/[0-9]{2}"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.isDefault}
                onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
              />
              Set as default payment method
            </label>
          </div>
          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.saveButton}>
              Add Payment Method
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Plan Modal Component
const EditPlanModal = ({ currentPlan, onClose, onSave }) => {
  const [selectedPlan, setSelectedPlan] = useState(currentPlan.name);
  const [billing, setBilling] = useState(currentPlan.billing);

  const plans = [
    { name: 'Basic Plan', price: 9.99, features: ['Basic support', '5 bookings/month', 'Standard features'] },
    { name: 'Premium Plan', price: 29.99, features: ['Priority support', 'Unlimited bookings', 'Premium features', 'Advanced analytics'] },
    { name: 'Enterprise Plan', price: 99.99, features: ['24/7 support', 'Unlimited everything', 'Custom features', 'Dedicated manager'] }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const plan = plans.find(p => p.name === selectedPlan);
    onSave({
      name: selectedPlan,
      price: plan.price,
      billing: billing,
      status: 'Active'
    });
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>Change Subscription Plan</h3>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.planOptions}>
            {plans.map((plan) => (
              <div 
                key={plan.name} 
                className={`${styles.planOption} ${selectedPlan === plan.name ? styles.selected : ''}`}
                onClick={() => setSelectedPlan(plan.name)}
              >
                <div className={styles.planHeader}>
                  <input
                    type="radio"
                    name="plan"
                    value={plan.name}
                    checked={selectedPlan === plan.name}
                    onChange={() => setSelectedPlan(plan.name)}
                  />
                  <div>
                    <h4>{plan.name}</h4>
                    <p className={styles.planPrice}>${plan.price}/{billing}</p>
                  </div>
                </div>
                <ul className={styles.planFeatures}>
                  {plan.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className={styles.formGroup}>
            <label>Billing Cycle</label>
            <select 
              value={billing} 
              onChange={(e) => setBilling(e.target.value)}
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly (Save 20%)</option>
            </select>
          </div>
          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.saveButton}>
              Update Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Billing Component
const BillingTab = ({ user }) => {
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: 'card',
      last4: '4242',
      brand: 'Visa',
      expiry: '12/25',
      isDefault: true
    }
  ]);
  const [billingHistory, setBillingHistory] = useState([
    {
      id: 1,
      date: '2024-01-15',
      amount: 29.99,
      status: 'paid',
      description: 'Monthly Subscription'
    },
    {
      id: 2,
      date: '2023-12-15',
      amount: 29.99,
      status: 'paid',
      description: 'Monthly Subscription'
    }
  ]);

  // Modal states
  const [isEditPaymentModalOpen, setIsEditPaymentModalOpen] = useState(false);
  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
  const [isEditPlanModalOpen, setIsEditPlanModalOpen] = useState(false);
  const [editingPaymentMethod, setEditingPaymentMethod] = useState(null);
  const [currentPlan, setCurrentPlan] = useState({
    name: 'Premium Plan',
    price: 29.99,
    billing: 'monthly',
    status: 'Active'
  });

  // Handle edit payment method
  const handleEditPaymentMethod = (method) => {
    setEditingPaymentMethod(method);
    setIsEditPaymentModalOpen(true);
  };

  // Handle remove payment method
  const handleRemovePaymentMethod = (methodId) => {
    if (window.confirm('Are you sure you want to remove this payment method?')) {
      setPaymentMethods(prev => prev.filter(method => method.id !== methodId));
    }
  };

  // Handle plan upgrade/downgrade
  const handleEditPlan = () => {
    setIsEditPlanModalOpen(true);
  };

  // Handle cancel subscription
  const handleCancelSubscription = () => {
    if (window.confirm('Are you sure you want to cancel your subscription? This action cannot be undone.')) {
      setCurrentPlan(prev => ({ ...prev, status: 'Cancelled' }));
    }
  };

  // Handle download invoice
  const handleDownloadInvoice = (invoice) => {
    // Create a simple invoice download simulation
    const invoiceData = `
Invoice #${invoice.id}
Date: ${new Date(invoice.date).toLocaleDateString()}
Description: ${invoice.description}
Amount: $${invoice.amount}
Status: ${invoice.status}
    `;
    
    const blob = new Blob([invoiceData], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${invoice.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Handle set default payment method
  const handleSetDefaultPaymentMethod = (methodId) => {
    setPaymentMethods(prev => prev.map(method => ({
      ...method,
      isDefault: method.id === methodId
    })));
  };

  // Handle save payment method
  const handleSavePaymentMethod = (paymentData) => {
    if (editingPaymentMethod) {
      // Update existing payment method
      setPaymentMethods(prev => prev.map(method => 
        method.id === editingPaymentMethod.id 
          ? { ...method, ...paymentData }
          : method
      ));
    } else {
      // Add new payment method
      const newMethod = {
        id: Date.now(),
        ...paymentData
      };
      setPaymentMethods(prev => [...prev, newMethod]);
    }
    setIsEditPaymentModalOpen(false);
    setIsAddPaymentModalOpen(false);
    setEditingPaymentMethod(null);
  };

  // Handle save plan changes
  const handleSavePlan = (planData) => {
    setCurrentPlan(prev => ({ ...prev, ...planData }));
    setIsEditPlanModalOpen(false);
  };

  return (
    <div className={styles.tabContent}>
      <div className={styles.contentHeader}>
        <h2 className={styles.pageTitle}>Billing & Subscription</h2>
        <p className={styles.pageDescription}>Manage your subscription, payment methods, and billing history.</p>
      </div>

      <div className={styles.billingSections}>
        {/* Current Plan */}
        <div className={styles.billingCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <div>
              <h3 className={styles.cardTitle}>Current Plan</h3>
              <p className={styles.cardDescription}>Your active subscription</p>
            </div>
          </div>
          
          <div className={styles.planDetails}>
            <div className={styles.planInfo}>
              <span className={styles.planName}>{currentPlan.name}</span>
              <span className={styles.planPrice}>${currentPlan.price}/{currentPlan.billing}</span>
              <span className={styles.planStatus}>{currentPlan.status}</span>
            </div>
            <div className={styles.planActions}>
              <button className={styles.upgradeButton} onClick={handleEditPlan}>
                {currentPlan.name === 'Premium Plan' ? 'Change Plan' : 'Upgrade Plan'}
              </button>
              <button className={styles.cancelButton} onClick={handleCancelSubscription}>
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className={styles.billingCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
              </svg>
            </div>
            <div>
              <h3 className={styles.cardTitle}>Payment Methods</h3>
              <p className={styles.cardDescription}>Manage your payment methods</p>
            </div>
          </div>
          
          <div className={styles.paymentMethods}>
            {paymentMethods.map((method) => (
              <div key={method.id} className={styles.paymentMethod}>
                <div className={styles.methodInfo}>
                  <div className={styles.methodIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                    </svg>
                  </div>
                  <div className={styles.methodDetails}>
                    <span className={styles.methodBrand}>{method.brand}</span>
                    <span className={styles.methodNumber}>•••• •••• •••• {method.last4}</span>
                    <span className={styles.methodExpiry}>Expires {method.expiry}</span>
                  </div>
                </div>
                <div className={styles.methodActions}>
                  {method.isDefault ? (
                    <span className={styles.defaultBadge}>Default</span>
                  ) : (
                    <button 
                      className={styles.defaultButton} 
                      onClick={() => handleSetDefaultPaymentMethod(method.id)}
                    >
                      Set Default
                    </button>
                  )}
                  <button className={styles.editButton} onClick={() => handleEditPaymentMethod(method)}>
                    Edit
                  </button>
                  <button className={styles.removeButton} onClick={() => handleRemovePaymentMethod(method.id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
            
            <button className={styles.addPaymentButton} onClick={() => setIsAddPaymentModalOpen(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              Add Payment Method
            </button>
          </div>
        </div>

        {/* Billing History */}
        <div className={styles.billingCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
            </div>
            <div>
              <h3 className={styles.cardTitle}>Billing History</h3>
              <p className={styles.cardDescription}>Your payment history and invoices</p>
            </div>
          </div>
          
          <div className={styles.billingHistory}>
            {billingHistory.map((invoice) => (
              <div key={invoice.id} className={styles.invoiceItem}>
                <div className={styles.invoiceInfo}>
                  <span className={styles.invoiceDate}>{new Date(invoice.date).toLocaleDateString()}</span>
                  <span className={styles.invoiceDescription}>{invoice.description}</span>
                </div>
                <div className={styles.invoiceDetails}>
                  <span className={styles.invoiceAmount}>${invoice.amount}</span>
                  <span className={`${styles.invoiceStatus} ${styles[invoice.status]}`}>
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </span>
                  <button 
                    className={styles.downloadButton}
                    onClick={() => handleDownloadInvoice(invoice)}
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {isEditPaymentModalOpen && (
        <EditPaymentMethodModal
          method={editingPaymentMethod}
          onClose={() => setIsEditPaymentModalOpen(false)}
          onSave={handleSavePaymentMethod}
        />
      )}

      {isAddPaymentModalOpen && (
        <AddPaymentMethodModal
          onClose={() => setIsAddPaymentModalOpen(false)}
          onSave={handleSavePaymentMethod}
        />
      )}

      {isEditPlanModalOpen && (
        <EditPlanModal
          currentPlan={currentPlan}
          onClose={() => setIsEditPlanModalOpen(false)}
          onSave={handleSavePlan}
        />
      )}
    </div>
  );
};

// Settings Component
const SettingsTab = ({ user }) => {
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('UTC');
  const [theme, setTheme] = useState('light');
  const [autoSave, setAutoSave] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);
  const [message, setMessage] = useState("");

  const handleSaveSettings = async () => {
    try {
      const response = await axiosInstance.put("/user/settings", {
        language,
        timezone,
        theme,
        auto_save: autoSave,
        data_sharing: dataSharing
      });
      
      if (response.data.success) {
        setMessage("Settings updated successfully!");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update settings");
    }
  };

  return (
    <div className={styles.tabContent}>
      <div className={styles.contentHeader}>
        <h2 className={styles.pageTitle}>General Settings</h2>
        <p className={styles.pageDescription}>Configure your account preferences and application settings.</p>
      </div>

      {message && (
        <div className={`${styles.message} ${message.includes('success') ? styles.success : styles.error}`}>
          {message}
        </div>
      )}

      <div className={styles.settingsSections}>
        {/* Appearance Settings */}
        <div className={styles.settingsCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 18.5A6.5 6.5 0 0 1 5.5 12A6.5 6.5 0 0 1 12 5.5a6.5 6.5 0 0 1 6.5 6.5a6.5 6.5 0 0 1-6.5 6.5M12 2a10 10 0 0 0-10 10a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2Z"/>
              </svg>
            </div>
            <div>
              <h3 className={styles.cardTitle}>Appearance</h3>
              <p className={styles.cardDescription}>Customize the look and feel</p>
            </div>
          </div>
          
          <div className={styles.settingOptions}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Theme</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className={styles.select}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>
          </div>
        </div>

        {/* Localization Settings */}
        <div className={styles.settingsCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.87,15.07L10.33,12.56L10.36,12.53C12.1,10.59 13.34,8.36 14.07,6H17V4H10V2H8V4H1V6H12.17C11.5,7.92 10.44,9.75 9,11.35C8.07,10.32 7.3,9.19 6.69,8H4.69C5.42,9.63 6.42,11.17 7.67,12.56L2.58,17.58L4,19L9,14L12.11,17.11L12.87,15.07Z"/>
              </svg>
            </div>
            <div>
              <h3 className={styles.cardTitle}>Localization</h3>
              <p className={styles.cardDescription}>Language and regional settings</p>
            </div>
          </div>
          
          <div className={styles.settingOptions}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={styles.select}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>Timezone</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className={styles.select}
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
              </select>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className={styles.settingsCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z"/>
              </svg>
            </div>
            <div>
              <h3 className={styles.cardTitle}>Privacy</h3>
              <p className={styles.cardDescription}>Control your data and privacy</p>
            </div>
          </div>
          
          <div className={styles.settingOptions}>
            <div className={styles.toggleSection}>
              <div className={styles.toggleInfo}>
                <span className={styles.toggleLabel}>Auto-save</span>
                <span className={styles.toggleDescription}>Automatically save your changes</span>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={autoSave}
                  onChange={(e) => setAutoSave(e.target.checked)}
                />
                <span className={styles.toggleSlider}></span>
              </label>
            </div>
            
            <div className={styles.toggleSection}>
              <div className={styles.toggleInfo}>
                <span className={styles.toggleLabel}>Data Sharing</span>
                <span className={styles.toggleDescription}>Share anonymous usage data to improve our service</span>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={dataSharing}
                  onChange={(e) => setDataSharing(e.target.checked)}
                />
                <span className={styles.toggleSlider}></span>
              </label>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className={`${styles.settingsCard} ${styles.dangerZone}`}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
              </svg>
            </div>
            <div>
              <h3 className={styles.cardTitle}>Danger Zone</h3>
              <p className={styles.cardDescription}>Irreversible and destructive actions</p>
            </div>
          </div>
          
          <div className={styles.dangerActions}>
            <button className={styles.dangerButton}>
              Delete Account
            </button>
            <p className={styles.dangerWarning}>
              Once you delete your account, there is no going back. Please be certain.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.actionButtons}>
        <button onClick={handleSaveSettings} className={styles.saveButton}>
          Save Settings
        </button>
      </div>
    </div>
  );
};
const Sidebar = ({ activeTab, setActiveTab, user, previewUser, onNameClick }) => {
  const menuItems = [
    { id: "dashboard", name: "Dashboard", icon: <DashboardIcon /> },
    { id: "profile", name: "Profile", icon: <ProfileIcon /> },
    { id: "bookings", name: "My Bookings", icon: <BookingIcon /> },
    { id: "security", name: "Security", icon: <SecurityIcon /> },
    { id: "notifications", name: "Notifications", icon: <NotificationIcon /> },
    { id: "billing", name: "Billing", icon: <BillingIcon /> },
    { id: "settings", name: "Settings", icon: <SettingsIcon /> },
  ];

  // Use preview data if available, otherwise use regular user data
  const displayUser = previewUser || user;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <div className={styles.logoPlaceholder}>
          {displayUser?.profile_image ? (
            <img 
              src={displayUser.profile_image} 
              alt={`${displayUser.first_name || 'User'}'s profile`}
              className={styles.profileImage}
              style={{
                transition: 'all 0.3s ease',
                transform: previewUser ? 'scale(1.05)' : 'scale(1)',
                boxShadow: previewUser ? '0 0 20px rgba(102, 126, 234, 0.4)' : 'none'
              }}
            />
          ) : (
            <UserIcon />
          )}
        </div>
        <p 
          className={styles.logoSubtext} 
          onClick={onNameClick}
          style={{
            transition: 'all 0.3s ease',
            color: previewUser ? '#667eea' : 'inherit',
            fontWeight: previewUser ? '700' : '600',
            cursor: onNameClick ? 'pointer' : 'default'
          }}
          title={onNameClick ? 'Click to view profile details' : ''}
        >
          {displayUser?.first_name && displayUser?.last_name 
            ? `${displayUser.first_name} ${displayUser.last_name}` 
            : displayUser?.first_name || displayUser?.last_name || 'User'}
        </p>
      </div>
      <nav>
        <ul className={styles.menuList}>
          {menuItems.map((item) => (
            <li key={item.id} className={styles.menuItem}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`${styles.menuLink} ${
                  activeTab === item.id ? styles.active : ""
                }`}
                aria-current={activeTab === item.id ? "page" : undefined}
              >
                <span className={styles.menuIcon}>{item.icon}</span>
                <span className={styles.menuText}>{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

// Profile Form Component
const ProfileForm = ({ user, setUser, setPropUser, onPreviewUpdate }) => {
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
    country: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [previewData, setPreviewData] = useState(null); // For real-time preview

  useEffect(() => {
    console.log("User data received:", user);
    if (user) {
      console.log("Setting form data with user:", user);
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
        country: user.country || "",
      });
      console.log("Form data set to:", {
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
        country: user.country || "",
      });
      // Set profile image preview if user has one
      if (user.profile_image) {
        setImagePreview(user.profile_image);
      }
    } else {
      console.log("No user data available");
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Field changed: ${name} = ${value}`);
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
    
    // Update real-time preview
    const previewUser = { ...user, ...updatedData };
    if (imagePreview) {
      previewUser.profile_image = imagePreview;
    }
    setPreviewData(previewUser);
    
    // Notify parent component of preview update
    if (onPreviewUpdate) {
      onPreviewUpdate(previewUser);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setMessage("Please select a valid image file (JPEG, PNG, or GIF)");
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage("Image size should be less than 5MB");
        return;
      }

      setProfileImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = e.target.result;
        setImagePreview(preview);
        
        // Update real-time preview with new image
        const previewUser = { ...user, ...formData, profile_image: preview };
        setPreviewData(previewUser);
        
        // Notify parent component of preview update
        if (onPreviewUpdate) {
          onPreviewUpdate(previewUser);
        }
      };
      reader.readAsDataURL(file);
      setMessage(""); // Clear any previous messages
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setMessage(""); // Clear messages when entering edit mode
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Validate email format (only if provided)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address (e.g., user@example.com)';
    }
    
    // Validate phone number format (only if provided)
    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      errors.phone = 'Please enter a valid phone number (e.g., +94771234567 or 0771234567)';
    }
    
    // Validate zip code format (basic validation)
    if (formData.zip && !/^[\d\-\s]{3,10}$/.test(formData.zip)) {
      errors.zip = 'Please enter a valid zip code';
    }
    
    return errors;
  };

  const handleSave = async () => {
    console.log("Save button clicked!");
    console.log("Current form data:", formData);
    console.log("Profile image:", profileImage);
    console.log("Is editing:", isEditing);
    
    setIsLoading(true);
    setMessage("");
    
    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      const errorMessage = Object.values(validationErrors).join(', ');
      setMessage(errorMessage);
      setIsLoading(false);
      return;
    }
    
    try {
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Add all form fields (including empty strings for proper validation)
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          submitData.append(key, formData[key]);
        }
      });
      
      // Add profile image if selected
      if (profileImage) {
        submitData.append('profile_image', profileImage);
      }

      console.log("Sending API request to /api/profile");
      console.log("Submit data:", submitData);
      console.log("Request headers:", {
        'Content-Type': 'multipart/form-data',
      });

      const response = await axiosInstance.put("/api/profile", submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log("API Response:", response);
      console.log("Response data:", response.data);
      
      if (response.data.success) {
        // Enhanced success feedback with emoji and celebration
        setMessage("🎉 Profile updated successfully!");
        
        // Update the user data with the form data immediately for better UX
        const updatedUser = { ...user, ...formData };
        
        // If we have an image preview, use it temporarily
        if (imagePreview) {
          updatedUser.profile_image = imagePreview;
        }
        
        setUser(updatedUser);
        
        // Also update the prop user if available
        if (setPropUser) setPropUser(updatedUser);
        
        // If the API returns updated user data, use that instead
        if (response.data.user) {
          setUser(response.data.user);
          if (setPropUser) setPropUser(response.data.user);
        }
        
        // Reset states
        setProfileImage(null);
        setImagePreview(null);
        setPreviewData(null);
        setIsEditing(false);
        
        // Clear preview in parent component
        if (onPreviewUpdate) {
          onPreviewUpdate(null);
        }
        
        // Enhanced visual feedback animations
        const profileCard = document.querySelector(`.${styles.profileSidebar}`);
        const messageElement = document.querySelector(`.${styles.message}`);
        
        // Success pulse animation for profile card
        if (profileCard) {
          profileCard.style.transform = 'scale(1.05)';
          profileCard.style.boxShadow = '0 0 20px rgba(34, 197, 94, 0.3)';
          profileCard.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
          setTimeout(() => {
            profileCard.style.transform = 'scale(1)';
            profileCard.style.boxShadow = '';
          }, 400);
        }
        
        // Success message animation
        if (messageElement) {
          messageElement.style.transform = 'translateY(-10px)';
          messageElement.style.opacity = '0';
          messageElement.style.transition = 'all 0.3s ease';
          setTimeout(() => {
            messageElement.style.transform = 'translateY(0)';
            messageElement.style.opacity = '1';
          }, 100);
        }
        
        // Auto-hide success message after 5 seconds with fade out
        setTimeout(() => {
          if (messageElement) {
            messageElement.style.opacity = '0';
            messageElement.style.transform = 'translateY(-10px)';
            setTimeout(() => {
              setMessage("");
            }, 300);
          } else {
            setMessage("");
          }
        }, 5000);
      }
    } catch (error) {
      console.log("Profile update error:", error);
      console.log("Error response:", error.response);
      console.log("Error response data:", error.response?.data);
      console.log("Validation errors:", error.response?.data?.errors);
      console.log("Error message:", error.response?.data?.message);
      
      let errorMessage = "Failed to update profile";
      
      if (error.response?.data?.errors) {
        // Handle validation errors from Laravel
        const validationErrors = error.response.data.errors;
        console.log("Detailed validation errors:", validationErrors);
        const errorMessages = Object.values(validationErrors).flat();
        errorMessage = `❌ ${errorMessages.join(', ')}`;
      } else if (error.response?.data?.message) {
        errorMessage = `❌ ${error.response.data.message}`;
      } else {
        errorMessage = "❌ Failed to update profile";
      }
      
      setMessage(errorMessage);
      
      // Auto-hide error message after 5 seconds
      setTimeout(() => {
        setMessage("");
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const personalFields = [
    { name: "first_name", label: "First Name", type: "text", placeholder: "Enter your first name", icon: <UserIcon /> },
    { name: "last_name", label: "Last Name", type: "text", placeholder: "Enter your last name", icon: <UserIcon /> },
    { name: "birthday", label: "Birthday", type: "date", icon: <CalendarIcon /> },
    { name: "gender", label: "Gender", type: "select", options: ["Male", "Female", "Other"], icon: <UserIcon /> },
  ];

  const contactFields = [
    { name: "email", label: "Email", type: "email", placeholder: "e.g., user@example.com", readOnly: true, icon: <EmailIcon /> },
    { name: "phone", label: "Phone", type: "tel", placeholder: "e.g., +94771234567 or 0771234567", icon: <PhoneIcon /> },
  ];

  const addressFields = [
    { name: "address", label: "Street Address", type: "text", placeholder: "Enter your street address", icon: <LocationIcon /> },
    { name: "number", label: "House Number", type: "text", placeholder: "House/Apt number", icon: <LocationIcon /> },
    { name: "city", label: "City", type: "text", placeholder: "Enter your city", icon: <LocationIcon /> },
    { name: "state", label: "State", type: "text", placeholder: "Enter your state", icon: <LocationIcon /> },
    { name: "zip", label: "ZIP Code", type: "text", placeholder: "Enter ZIP code", icon: <LocationIcon /> },
    { name: "country", label: "Country", type: "text", placeholder: "Enter your country", icon: <LocationIcon /> },
  ];

  const renderFieldGroup = (title, fields, groupIcon, readOnly = false) => (
    <div className={styles.fieldGroup}>
      <div className={styles.fieldGroupHeader}>
        <span className={styles.fieldGroupIcon}>{groupIcon}</span>
        <h3 className={styles.fieldGroupTitle}>{title}</h3>
      </div>
      <div className={styles.formGrid}>
        {fields.map(({ name, label, type, options, placeholder, readOnly: fieldReadOnly, icon }) => (
          <div key={name} className={styles.inputGroup}>
            <label htmlFor={name} className={styles.label}>
              <span className={styles.labelIcon}>{icon}</span>
              {label}
            </label>
            {type === "select" ? (
              <select
                id={name}
                name={name}
                value={formData[name] || ""}
                onChange={handleChange}
                className={styles.input}
                disabled={readOnly || fieldReadOnly}
              >
                <option value="">Select {label}</option>
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : type === "textarea" ? (
              <textarea
                id={name}
                name={name}
                value={formData[name] || ""}
                onChange={handleChange}
                placeholder={placeholder || label}
                className={`${styles.input} ${styles.textarea}`}
                rows="3"
                readOnly={readOnly || fieldReadOnly}
              />
            ) : (
              <input
                id={name}
                type={type}
                name={name}
                value={formData[name] || ""}
                onChange={handleChange}
                placeholder={placeholder || label}
                readOnly={readOnly || fieldReadOnly}
                className={`${styles.input} ${(readOnly || fieldReadOnly) ? styles.readOnly : ""}`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section className={styles.profileCard} aria-label="User profile information">
      <header className={styles.profileHeader}>
        <div className={styles.headerContent}>
          <h2 className={styles.profileTitle}>
            <EditIcon />
            Profile Settings
          </h2>
          <p className={styles.profileSubtitle}>Manage your personal information and account details</p>
        </div>
        <div className={styles.headerActions}>
          <button
            type="button"
            onClick={handleEditToggle}
            className={`${styles.editButton} ${isEditing ? styles.active : ""}`}
            aria-label={isEditing ? "Cancel editing" : "Edit profile"}
          >
            {isEditing ? (
              <>
                <span>✕</span>
                Cancel
              </>
            ) : (
              <>
                <EditIcon />
                Edit Profile
              </>
            )}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={handleSave}
              className={`${styles.saveButton} ${isLoading ? styles.loading : ""}`}
              disabled={isLoading}
              aria-live="polite"
              aria-busy={isLoading}
            >
              {isLoading ? (
                <>
                  <span className={styles.spinner}></span>
                  Saving...
                </>
              ) : (
                <>
                  <span>✓</span>
                  Save Changes
                </>
              )}
            </button>
          )}
        </div>
      </header>

      {message && (
        <div
          className={`${styles.message} ${
            message.includes("successfully") ? styles.success : styles.error
          }`}
          role={message.includes("successfully") ? "status" : "alert"}
        >
          <span className={styles.messageIcon}>
            {message.includes("successfully") ? "✓" : "⚠"}
          </span>
          {message}
        </div>
      )}

      <form className={styles.formContainer} onSubmit={(e) => e.preventDefault()}>
        {/* Profile Picture Section */}
        <div className={styles.profileImageSection}>
          <div className={styles.imageContainer}>
            <div className={styles.profileImageWrapper}>
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Profile" 
                  className={styles.profileImage}
                />
              ) : (
                <div className={styles.profileImagePlaceholder}>
                  <UserIcon />
                  <span>No Image</span>
                </div>
              )}
              {isEditing && (
                <div className={styles.imageOverlay}>
                  <label htmlFor="profileImageInput" className={styles.imageUploadLabel}>
                    <span className={styles.uploadIcon}>📷</span>
                    <span>Change Photo</span>
                  </label>
                  <input
                    id="profileImageInput"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={styles.imageInput}
                    style={{ display: 'none' }}
                  />
                </div>
              )}
            </div>
          </div>
          <div className={styles.imageInfo}>
            <h3>Profile Picture</h3>
            <p>Upload a photo to personalize your profile</p>
            {isEditing && (
              <small className={styles.imageHint}>
                Supported formats: JPEG, PNG, GIF (Max 5MB)
              </small>
            )}
          </div>
        </div>

        {renderFieldGroup("Personal Information", personalFields, <UserIcon />, !isEditing)}
        {renderFieldGroup("Contact Information", contactFields, <EmailIcon />, !isEditing)}
        {renderFieldGroup("Address Information", addressFields, <LocationIcon />, !isEditing)}
      </form>
    </section>
  );
};

// Profile Details Modal Component
const ProfileDetailsModal = ({ user, isOpen, onClose, onEditProfile }) => {
  if (!isOpen) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "Not provided";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getProfileCompletionPercentage = () => {
    const fields = [
      user?.first_name, user?.last_name, user?.email, user?.phone,
      user?.birthday, user?.gender, user?.address, user?.city,
      user?.state, user?.zip, user?.country
    ];
    const filledFields = fields.filter(field => field && field.trim() !== '').length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const handleEditProfile = () => {
    onClose(); // Close the modal first
    if (onEditProfile) {
      onEditProfile(); // Switch to profile tab
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.profileModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Profile Details</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <div className={styles.modalContent}>
          {/* Profile Header Section */}
          <div className={styles.modalProfileHeader}>
            <div className={styles.modalProfileImage}>
              <div className={styles.profileImagePlaceholder}>
                {user?.profile_image ? (
                  <img 
                    src={user.profile_image} 
                    alt="Profile" 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }} 
                  />
                ) : (
                  <UserIcon />
                )}
              </div>
              <div className={styles.profileStatus}>
                <span className={styles.statusIndicator}></span>
                <span className={styles.statusText}>Online</span>
              </div>
            </div>
            <div className={styles.modalProfileInfo}>
              <h3 className={styles.modalProfileName}>
                {user?.first_name || "First"} {user?.last_name || "Last"}
              </h3>
              <p className={styles.modalProfileRole}>{user?.role || "User"}</p>
              <div className={styles.profileCompletion}>
                <span className={styles.completionLabel}>Profile Completion</span>
                <div className={styles.completionBar}>
                  <div 
                    className={styles.completionFill} 
                    style={{ width: `${getProfileCompletionPercentage()}%` }}
                  ></div>
                </div>
                <span className={styles.completionPercentage}>{getProfileCompletionPercentage()}%</span>
              </div>
            </div>
          </div>

          {/* Profile Details Sections */}
          <div className={styles.modalDetailsGrid}>
            {/* Personal Information */}
            <div className={styles.detailsSection}>
              <h4 className={styles.sectionTitle}>
                <UserIcon />
                Personal Information
              </h4>
              <div className={styles.detailsList}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Full Name</span>
                  <span className={styles.detailValue}>
                    {user?.first_name || user?.last_name 
                      ? `${user?.first_name || ''} ${user?.last_name || ''}`.trim()
                      : "Not provided"
                    }
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Birthday</span>
                  <span className={styles.detailValue}>{formatDate(user?.birthday)}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Gender</span>
                  <span className={styles.detailValue}>{user?.gender || "Not specified"}</span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className={styles.detailsSection}>
              <h4 className={styles.sectionTitle}>
                <EmailIcon />
                Contact Information
              </h4>
              <div className={styles.detailsList}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Email</span>
                  <span className={styles.detailValue}>{user?.email || "Not provided"}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Phone</span>
                  <span className={styles.detailValue}>{user?.phone || "Not provided"}</span>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className={styles.detailsSection}>
              <h4 className={styles.sectionTitle}>
                <LocationIcon />
                Address Information
              </h4>
              <div className={styles.detailsList}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Street Address</span>
                  <span className={styles.detailValue}>
                    {user?.address && user?.number 
                      ? `${user.address}, ${user.number}`
                      : user?.address || user?.number || "Not provided"
                    }
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>City</span>
                  <span className={styles.detailValue}>{user?.city || "Not provided"}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>State</span>
                  <span className={styles.detailValue}>{user?.state || "Not provided"}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>ZIP Code</span>
                  <span className={styles.detailValue}>{user?.zip || "Not provided"}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Country</span>
                  <span className={styles.detailValue}>{user?.country || "Not provided"}</span>
                </div>
              </div>
            </div>

            {/* Account Statistics */}
            <div className={styles.detailsSection}>
              <h4 className={styles.sectionTitle}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16,11V3H8V9H2V21H22V11H16M10,5H14V9H10V5M4,11H10V19H4V11M12,11H20V19H12V11Z"/>
                </svg>
                Service Statistics
              </h4>
              <div className={styles.statsList}>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>24</span>
                  <span className={styles.statLabel}>Total Bookings</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>4.8</span>
                  <span className={styles.statLabel}>Average Rating</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>3</span>
                  <span className={styles.statLabel}>Active Services</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>$2,450</span>
                  <span className={styles.statLabel}>Total Spent</span>
                </div>
              </div>
            </div>

            {/* Property & Preferences */}
            {(user?.property_type || user?.preferred_services) && (
              <div className={styles.detailsSection}>
                <h4 className={styles.sectionTitle}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z"/>
                  </svg>
                  Property & Preferences
                </h4>
                <div className={styles.detailsList}>
                  {user?.property_type && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Property Type</span>
                      <span className={styles.detailValue}>{user.property_type}</span>
                    </div>
                  )}
                  {user?.property_size && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Property Size</span>
                      <span className={styles.detailValue}>{user.property_size}</span>
                    </div>
                  )}
                  {user?.preferred_time && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Preferred Time</span>
                      <span className={styles.detailValue}>{user.preferred_time}</span>
                    </div>
                  )}
                  {user?.budget_range && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Budget Range</span>
                      <span className={styles.detailValue}>{user.budget_range}</span>
                    </div>
                  )}
                  {user?.preferred_services && user.preferred_services.length > 0 && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Preferred Services</span>
                      <span className={styles.detailValue}>
                        {user.preferred_services.join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Modal Actions */}
          <div className={styles.modalActions}>
            <button className={styles.editProfileButton} onClick={handleEditProfile}>
              <EditIcon />
              Edit Profile
            </button>
            <button className={styles.closeModalButton} onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Profile Card Component
const ProfileCard = ({ user, onProfileImageClick }) => (
  <aside className={styles.profileSidebar} aria-label="User profile summary">
    <div className={styles.profileCardHeader}>
      <div className={styles.profileStatus}>
        <span className={styles.statusIndicator} aria-hidden="true"></span>
        <span className={styles.statusText}>Online</span>
      </div>
    </div>
    
    <div className={styles.profileImageContainer}>
      <div 
        className={styles.profileImagePlaceholder}
        onClick={onProfileImageClick}
        style={{ cursor: 'pointer' }}
        title="Click to view profile details"
      >
        {user?.profile_image ? (
          <img 
            src={user.profile_image} 
            alt="Profile" 
            style={{ 
              width: '100%', 
              height: '100%', 
              borderRadius: '50%',
              objectFit: 'cover'
            }} 
          />
        ) : (
          <UserIcon />
        )}
      </div>
      <button className={styles.changePhotoButton} aria-label="Change profile photo">
        <EditIcon />
      </button>
    </div>
    
    <div className={styles.profileInfo}>
      <h3 className={styles.profileName}>
        {user?.first_name || "First"} {user?.last_name || "Last"}
      </h3>
      <p className={styles.profileRole}>Household Service Customer</p>
      
      {(user?.city || user?.state) && (
        <div className={styles.profileLocation}>
          <LocationIcon />
          <span>{user?.city}{user?.city && user?.state ? ", " : ""}{user?.state}</span>
        </div>
      )}

      {user?.property_type && (
        <div className={styles.profileProperty}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z"/>
          </svg>
          <span>{user?.property_type} - {user?.property_size || "Medium"}</span>
        </div>
      )}
      
      <div className={styles.profileStats}>
        <div className={styles.statItem}>
          <span className={styles.statValue}>24</span>
          <span className={styles.statLabel}>Bookings</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>4.8</span>
          <span className={styles.statLabel}>Rating</span>
        </div>
      </div>

      {user?.preferred_services && user.preferred_services.length > 0 && (
        <div className={styles.preferredServices}>
          <h4 className={styles.servicesTitle}>Preferred Services</h4>
          <div className={styles.servicesTags}>
            {user.preferred_services.slice(0, 3).map((service, index) => (
              <span key={index} className={styles.serviceTag}>
                {service}
              </span>
            ))}
            {user.preferred_services.length > 3 && (
              <span className={styles.serviceTag}>+{user.preferred_services.length - 3} more</span>
            )}
          </div>
        </div>
      )}

      <div className={styles.quickActions}>
        <button className={styles.actionButton}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
          </svg>
          Book Service
        </button>
        <button className={styles.actionButton}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"/>
          </svg>
          View Bookings
        </button>
      </div>
    </div>
  </aside>
);

// Dashboard Tab Component
const DashboardTab = ({ user }) => (
  <div className={styles.dashboardContainer}>
    <div className={styles.welcomeSection}>
      <h2 className={styles.welcomeTitle}>Welcome back, {user?.first_name || "User"}!</h2>
      <p className={styles.welcomeSubtitle}>Here's your household service booking overview.</p>
    </div>
    
    <div className={styles.statsGrid}>
      <div className={styles.statCard}>
        <div className={styles.statIcon}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7V10C2 16 6 20.9 12 22C18 20.9 22 16 22 10V7L12 2Z"/>
          </svg>
        </div>
        <div className={styles.statContent}>
          <h3 className={styles.statTitle}>Total Bookings</h3>
          <p className={styles.statValue}>24</p>
          <p className={styles.statDescription}>Services booked this year</p>
        </div>
      </div>
      
      <div className={styles.statCard}>
        <div className={styles.statIcon}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"/>
          </svg>
        </div>
        <div className={styles.statContent}>
          <h3 className={styles.statTitle}>Active Services</h3>
          <p className={styles.statValue}>3</p>
          <p className={styles.statDescription}>Currently in progress</p>
        </div>
      </div>
      
      <div className={styles.statCard}>
        <div className={styles.statIcon}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"/>
          </svg>
        </div>
        <div className={styles.statContent}>
          <h3 className={styles.statTitle}>Average Rating</h3>
          <p className={styles.statValue}>4.8</p>
          <p className={styles.statDescription}>From service providers</p>
        </div>
      </div>

      <div className={styles.statCard}>
        <div className={styles.statIcon}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.8 10.9C9.53 10.31 8.8 9.7 8.8 8.75C8.8 7.66 9.81 6.9 11.5 6.9C13.28 6.9 13.94 7.75 14 9H16.21C16.14 7.28 15.09 5.7 13 5.19V3H10V5.16C8.06 5.58 6.5 6.84 6.5 8.77C6.5 11.08 8.41 12.23 11.2 12.9C13.7 13.5 14.2 14.38 14.2 15.31C14.2 16 13.71 17.1 11.5 17.1C9.44 17.1 8.63 16.18 8.5 15H6.32C6.44 17.19 8.08 18.42 10 18.83V21H13V18.85C14.95 18.5 16.5 17.35 16.5 15.3C16.5 12.46 14.07 11.5 11.8 10.9Z"/>
          </svg>
        </div>
        <div className={styles.statContent}>
          <h3 className={styles.statTitle}>Total Spent</h3>
          <p className={styles.statValue}>$2,450</p>
          <p className={styles.statDescription}>On household services</p>
        </div>
      </div>
    </div>

    <div className={styles.recentActivity}>
      <h3 className={styles.sectionTitle}>Recent Service Bookings</h3>
      <div className={styles.activityList}>
        <div className={styles.activityItem}>
          <div className={styles.activityIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7V10C2 16 6 20.9 12 22C18 20.9 22 16 22 10V7L12 2Z"/>
            </svg>
          </div>
          <div className={styles.activityContent}>
            <p className={styles.activityTitle}>House Cleaning - Completed</p>
            <p className={styles.activityTime}>2 days ago</p>
            <p className={styles.activityDescription}>3-bedroom house deep cleaning</p>
          </div>
          <div className={styles.activityStatus}>
            <span className={styles.statusCompleted}>Completed</span>
          </div>
        </div>
        
        <div className={styles.activityItem}>
          <div className={styles.activityIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"/>
            </svg>
          </div>
          <div className={styles.activityContent}>
            <p className={styles.activityTitle}>Plumbing Repair - In Progress</p>
            <p className={styles.activityTime}>Today at 2:00 PM</p>
            <p className={styles.activityDescription}>Kitchen sink leak repair</p>
          </div>
          <div className={styles.activityStatus}>
            <span className={styles.statusInProgress}>In Progress</span>
          </div>
        </div>
        
        <div className={styles.activityItem}>
          <div className={styles.activityIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19ZM7 10H17V12H7V10ZM7 14H14V16H7V14Z"/>
            </svg>
          </div>
          <div className={styles.activityContent}>
            <p className={styles.activityTitle}>Gardening Service - Scheduled</p>
            <p className={styles.activityTime}>Tomorrow at 9:00 AM</p>
            <p className={styles.activityDescription}>Lawn mowing and hedge trimming</p>
          </div>
          <div className={styles.activityStatus}>
            <span className={styles.statusScheduled}>Scheduled</span>
          </div>
        </div>
      </div>
    </div>

    <div className={styles.quickActions}>
      <h3 className={styles.sectionTitle}>Quick Actions</h3>
      <div className={styles.actionGrid}>
        <button className={styles.quickActionButton}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
          </svg>
          Book New Service
        </button>
        <button className={styles.quickActionButton}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"/>
          </svg>
          View All Bookings
        </button>
        <button className={styles.quickActionButton}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"/>
          </svg>
          Rate Services
        </button>
        <button className={styles.quickActionButton}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"/>
          </svg>
          Contact Support
        </button>
      </div>
    </div>
  </div>
);

// Bookings Tab Component
const BookingsTab = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  // Mock booking data - replace with actual API call
  useEffect(() => {
    const mockBookings = [
      {
        id: 1,
        service: "House Cleaning",
        provider: "Sarah Johnson",
        date: "2024-01-15",
        time: "10:00 AM",
        status: "completed",
        amount: 120,
        rating: 5,
        address: "123 Main St, City",
        description: "Deep cleaning of 3-bedroom house"
      },
      {
        id: 2,
        service: "Plumbing",
        provider: "Mike Wilson",
        date: "2024-01-20",
        time: "2:00 PM",
        status: "scheduled",
        amount: 85,
        rating: null,
        address: "456 Oak Ave, City",
        description: "Fix kitchen sink leak"
      },
      {
        id: 3,
        service: "Electrical",
        provider: "David Brown",
        date: "2024-01-18",
        time: "9:00 AM",
        status: "in_progress",
        amount: 150,
        rating: null,
        address: "789 Pine St, City",
        description: "Install ceiling fan in living room"
      },
      {
        id: 4,
        service: "Gardening",
        provider: "Lisa Green",
        date: "2024-01-12",
        time: "8:00 AM",
        status: "completed",
        amount: 75,
        rating: 4,
        address: "321 Elm St, City",
        description: "Lawn mowing and hedge trimming"
      },
      {
        id: 5,
        service: "Painting",
        provider: "Tom Anderson",
        date: "2024-01-25",
        time: "11:00 AM",
        status: "cancelled",
        amount: 200,
        rating: null,
        address: "654 Maple Dr, City",
        description: "Paint bedroom walls"
      }
    ];
    
    setTimeout(() => {
      setBookings(mockBookings);
      setFilteredBookings(mockBookings);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter bookings based on search and filters
  useEffect(() => {
    let filtered = bookings;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      const bookingDate = new Date(booking.date);
      
      switch (dateFilter) {
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(booking => new Date(booking.date) >= weekAgo);
          break;
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(booking => new Date(booking.date) >= monthAgo);
          break;
        case "year":
          const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(booking => new Date(booking.date) >= yearAgo);
          break;
      }
    }

    setFilteredBookings(filtered);
  }, [bookings, searchTerm, statusFilter, dateFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "#10b981";
      case "scheduled": return "#3b82f6";
      case "in_progress": return "#f59e0b";
      case "cancelled": return "#ef4444";
      default: return "#6b7280";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>;
      case "scheduled":
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>;
      case "in_progress":
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>;
      case "cancelled":
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className={styles.tabContent}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.tabContent}>
      <div className={styles.contentHeader}>
        <h2 className={styles.pageTitle}>My Service Bookings</h2>
        <p className={styles.pageDescription}>Manage and track all your household service bookings.</p>
      </div>

      {/* Filters and Search */}
      <div className={styles.bookingFilters}>
        <div className={styles.searchContainer}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className={styles.searchIcon}>
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        
        <div className={styles.filterGroup}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Time</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      {/* Bookings List */}
      <div className={styles.bookingsList}>
        {filteredBookings.length === 0 ? (
          <div className={styles.emptyState}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" className={styles.emptyIcon}>
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
            </svg>
            <h3>No bookings found</h3>
            <p>You haven't made any service bookings yet or no bookings match your filters.</p>
            <button className={styles.primaryButton}>Book Your First Service</button>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div key={booking.id} className={styles.bookingCard}>
              <div className={styles.bookingHeader}>
                <div className={styles.serviceInfo}>
                  <h3 className={styles.serviceName}>{booking.service}</h3>
                  <p className={styles.providerName}>by {booking.provider}</p>
                </div>
                <div className={styles.bookingStatus} style={{ color: getStatusColor(booking.status) }}>
                  {getStatusIcon(booking.status)}
                  <span>{booking.status.replace('_', ' ').toUpperCase()}</span>
                </div>
              </div>
              
              <div className={styles.bookingDetails}>
                <div className={styles.detailItem}>
                  <CalendarIcon />
                  <span>{new Date(booking.date).toLocaleDateString()} at {booking.time}</span>
                </div>
                <div className={styles.detailItem}>
                  <LocationIcon />
                  <span>{booking.address}</span>
                </div>
                <div className={styles.detailItem}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <span>{booking.description}</span>
                </div>
              </div>
              
              <div className={styles.bookingFooter}>
                <div className={styles.bookingAmount}>
                  <span className={styles.amount}>${booking.amount}</span>
                  {booking.rating && (
                    <div className={styles.rating}>
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i < booking.rating ? "#fbbf24" : "#e5e7eb"}>
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                        </svg>
                      ))}
                      <span className={styles.ratingText}>({booking.rating})</span>
                    </div>
                  )}
                </div>
                
                <div className={styles.bookingActions}>
                  {booking.status === "scheduled" && (
                    <>
                      <button className={styles.secondaryButton}>Reschedule</button>
                      <button className={styles.dangerButton}>Cancel</button>
                    </>
                  )}
                  {booking.status === "completed" && !booking.rating && (
                    <button className={styles.primaryButton}>Rate Service</button>
                  )}
                  {booking.status === "in_progress" && (
                    <button className={styles.primaryButton}>Contact Provider</button>
                  )}
                  <button className={styles.secondaryButton}>View Details</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Main Account Component
const Account = ({ user: propUser, setUser: setPropUser }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(propUser);
  const [isLoading, setIsLoading] = useState(!propUser);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [previewUser, setPreviewUser] = useState(null); // For real-time preview

  // Handle preview updates from ProfileForm
  const handlePreviewUpdate = (previewData) => {
    setPreviewUser(previewData);
  };

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
          setIsLoading(true);
          const response = await axiosInstance.get("/user/profile");
          if (response.data.success) {
            setUser(response.data.user);
            if (setPropUser) setPropUser(response.data.user);
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          setError(error.response?.data?.message || "Failed to load user data");
        } finally {
          setIsLoading(false);
        }
      };

      fetchUser();
    }
  }, [propUser, setPropUser]);

  const handleProfileImageClick = () => {
    setIsProfileModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsProfileModalOpen(false);
  };

  if (isLoading) {
    return (
      <main className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p className={styles.loadingText}>Loading your account...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.container}>
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>⚠</div>
          <h2 className={styles.errorTitle}>Unable to Load Account</h2>
          <p className={styles.errorMessage} role="alert">{error}</p>
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

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardTab user={user} />;
      case "profile":
        return <ProfileForm user={user} setUser={setUser} setPropUser={setPropUser} onPreviewUpdate={handlePreviewUpdate} />;
      case "bookings":
        return <BookingsTab user={user} />;
      case "security":
        return <SecurityTab user={user} />;
      case "notifications":
        return <NotificationsTab user={user} />;
      case "billing":
        return <BillingTab user={user} />;
      case "settings":
        return <SettingsTab user={user} />;
      default:
        return <ProfileForm user={user} setUser={setUser} setPropUser={setPropUser} onPreviewUpdate={handlePreviewUpdate} />;
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.mainContent}>
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          user={user} 
          previewUser={previewUser} 
          onNameClick={handleProfileImageClick}
        />
        <section className={styles.content}>
          {renderTabContent()}
        </section>
      </div>
      <ProfileDetailsModal 
        user={user}
        isOpen={isProfileModalOpen}
        onClose={handleCloseModal}
        onEditProfile={() => setActiveTab("profile")}
      />
    </main>
  );
};

export default Account;
