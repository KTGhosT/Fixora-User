import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./UserLayout.module.css";

const UserLayout = ({ children, activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const menuItems = [
    { key: "profile", label: "Profile", icon: "👤" },
    { key: "bookings", label: "My Bookings", icon: "📅" },
    { key: "messages", label: "Messages", icon: "💬" },
    { key: "transactions", label: "Transactions", icon: "💰" },
    { key: "settings", label: "Settings", icon: "⚙️" },
  ];

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
            {menuItems.map((item) => (
              <li key={item.key} className={styles.menuItem}>
                <button
                  onClick={() => setActiveTab(item.key)}
                  className={`${styles.menuLink} ${
                    activeTab === item.key ? styles.active : ""
                  }`}
                  aria-current={activeTab === item.key ? "page" : undefined}
                >
                  <span className={styles.menuIcon}>{item.icon}</span>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      
      <section className={styles.content}>
        {children}
      </section>
    </main>
  );
};

export default UserLayout;
