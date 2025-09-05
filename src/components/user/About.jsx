import React from "react";
import styles from "./About.module.css";

const About = () => (
  <section id="about" className={styles.aboutSection}>
    <div className={styles.container}>
      <div className={styles.row + " " + styles.alignItemsCenter}>
        {/* Left Image */}
        <div className={`${styles.colMd6} ${styles.mb4}`}>
          <img
            src="src/assets/user/about.jpg"
            alt="Fixora workforce"
            className={styles.aboutImage}
            loading="lazy"
            width={480}
            height={360}
            style={{ borderRadius: "12px", boxShadow: "0 4px 24px rgba(44,62,80,0.10)" }}
          />
        </div>
        {/* Right Content */}
        <div className={styles.colMd6}>
          <h2 className={styles.aboutTitle}>About Us</h2>
          <p className={styles.textMuted}>
            <strong>Fixora</strong> is a modern workforce connection platform built to link skilled
            workers such as electricians, plumbers, cleaners, and more with clients who need their services.
            With real-time worker availability, location-based matching, and instant notifications,
            Fixora ensures fast and reliable service for every request.
          </p>
          <p className={styles.textMuted}>
            Our mission is to make hiring simple, transparent, and trustworthy –
            empowering both workers and clients with a seamless digital experience.
          </p>
          <a href="#learn-more" className={styles.learnMoreBtn} aria-label="Learn more about Fixora">
            Learn More <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>
  </section>
);

export default About;
