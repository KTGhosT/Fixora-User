import React from "react";
import styles from "../components/user/About.module.css";

const BreadcrumbPath = () => (
  <nav className={styles.breadcrumbNav} aria-label="Breadcrumb">
    <ol className={styles.breadcrumbList}>
      <li className={styles.breadcrumbItem}>
        <a href="/" className={styles.breadcrumbLink}>Home</a>
      </li>
      <li className={styles.breadcrumbSeparator} aria-hidden="true">/</li>
      <li className={styles.breadcrumbItem}>
        <span className={styles.breadcrumbCurrent} aria-current="page">About Us</span>
      </li>
    </ol>
  </nav>
);

const About = () => {
  return (
    <div>
      <section id="about" className={styles.aboutSection}>
        <BreadcrumbPath />
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.colMd6}>
              <img
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Professional home service team"
                className={styles.aboutImage}
              />
            </div>
            <div className={styles.colMd6}>
              <h2 className={styles.aboutTitle}>About Us</h2>
              <p className={styles.aboutDescription}>
                At Fixora, we're dedicated to connecting homeowners with skilled professionals who deliver exceptional service. 
                Our platform brings together experienced plumbers, electricians, carpenters, and cleaning specialists to handle 
                all your home maintenance needs with precision and care.
              </p>
              <p className={styles.aboutDescription}>
                Founded with a mission to make home services accessible and reliable, we've built a community of trusted 
                professionals who are committed to quality workmanship and customer satisfaction. Whether you need emergency 
                repairs or routine maintenance, our network of verified experts is ready to help.
              </p>
              <a href="#learn-more" className={styles.learnMoreBtn} aria-label="Learn more about Fixora">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;