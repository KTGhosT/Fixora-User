import React, { useEffect, useRef, useState } from "react";
import styles from "./About.module.css";

const About = () => {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className={`${styles.aboutSection} ${inView ? styles.inView : ""}`}
    >
      {/* Image Left */}
      <div className={`${styles.colMd6} ${styles.mb4}`}>
        <img
          src="src/assets/Home/HouseKeeping.png"
          alt="Fixora workforce"
          className={`${styles.aboutImage} ${styles.fadeUp} ${styles.stagger1}`}
          loading="lazy"
          decoding="async"
        />
      </div>
      {/* Text Right */}
      <div className={`${styles.colMd6} ${styles.aboutText}`}>
        <h2 className={styles.aboutTitle}>
          <span className={`${styles.aboutWord} ${styles.fadeUp} ${styles.stagger1}`}>About</span>{" "}
          <span className={`${styles.usWord} ${styles.fadeUp} ${styles.stagger2}`}>Us</span>
        </h2>
        <p className={`${styles.textMuted} ${styles.leadText} ${styles.fadeUp} ${styles.stagger3}`}>
          <strong className={styles.brandAccent}>Fixora</strong> is a modern workforce connection platform built to link skilled
          workers such as electricians, plumbers, cleaners, and more with clients who need their services.
          With real-time worker availability, location-based matching, and instant notifications,
          Fixora ensures fast and reliable service for every request.
        </p>
        <p className={`${styles.textMuted} ${styles.fadeUp} ${styles.stagger4}`}>
          Our mission is to make hiring simple, transparent, and trustworthy —
          empowering both workers and clients with a seamless digital experience.
        </p>
        <a href="/about" className={`${styles.learnMoreBtn} ${styles.fadeUp} ${styles.stagger4}`} aria-label="Go to the About page">
          Learn More <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
};

export default About;
