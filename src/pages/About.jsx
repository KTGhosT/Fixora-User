import React from "react";
import Footer from "../components/user/Footer";
import styles from "../components/user/About.module.css";

const About = () => {
  return (
    <>
      
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroOverlay}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>About Fixora</h1>
            <p className={styles.heroSubtitle}>
              We are a forward-thinking technology company dedicated to
              transforming home services through innovative digital solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Mission and Vision Section */}
      <section className={styles.missionVisionSection}>
        <div className={styles.container}>
          <div className={styles.cardGrid}>
            <div className={styles.missionCard}>
              <div className={styles.cardContent}>
                <h2 className={styles.cardTitle}>Our Mission</h2>
                <p className={styles.cardDescription}>
                  To deliver modern and scalable digital solutions that help homeowners grow, 
                  innovate, and succeed in the digital era. We strive to make home services 
                  accessible and beneficial for every household we work with.
                </p>
              </div>
            </div>
            
            <div className={styles.visionCard}>
              <div className={styles.cardContent}>
                <h2 className={styles.cardTitle}>Our Vision</h2>
                <p className={styles.cardDescription}>
                  To become a global leader in home service & AI-powered technologies, setting new 
                  standards for innovation and excellence in the digital solutions industry.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <div className={styles.featuresGrid}>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>✓</div>
              <h3 className={styles.featureTitle}>Verified Professionals</h3>
              <p className={styles.featureDescription}>All our service providers are thoroughly vetted and verified for your peace of mind.</p>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>🕒</div>
              <h3 className={styles.featureTitle}>24/7 Support</h3>
              <p className={styles.featureDescription}>Round-the-clock customer support to assist you whenever you need help.</p>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>⭐</div>
              <h3 className={styles.featureTitle}>Quality Guarantee</h3>
              <p className={styles.featureDescription}>We guarantee 100% satisfaction with every service booking through our platform.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default About;