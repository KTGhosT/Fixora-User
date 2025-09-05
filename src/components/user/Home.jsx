import React from 'react';
import styles from './HomeHero.module.css';

const UniqueHero = () => {
  return (
    <section className={styles.hero} id="home">
      {/* Background Elements */}
      <div className={styles.heroBackground}>
        <div className={styles.constructionGrid}></div>
        <div className={styles.blueprintOverlay}></div>
        <div className={styles.gradientOverlay}></div>
      </div>
      
      <div className={styles.container}>
        <div className={styles.heroContent}>
          {/* Badge */}
          
          
          {/* Main Title */}
          <h1 className={styles.heroTitle} data-aos="fade-up" data-aos-delay="200">
            <span className={styles.titleLine}>WELCOME TO</span>
            <span className={styles.titleHighlight}>FIXORA APP</span>
          </h1>
          
          {/* Description */}
          <p className={styles.heroDescription} data-aos="fade-up" data-aos-delay="400">
            Simplify your workforce management with Fixora. Effortlessly schedule, track, and optimize your team's productivity—all in one powerful app.
          </p>
          
          {/* Stats */}
          <div className={styles.statsContainer} data-aos="fade-up" data-aos-delay="600">
            <div className={styles.statItem}>
              <span className={styles.statNumber}>100+</span>
              <span className={styles.statLabel}>Services</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>50+</span>
              <span className={styles.statLabel}>Wrokers</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>99%</span>
              <span className={styles.statLabel}>User Satisfaction</span>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className={styles.heroButtons} data-aos="fade-up" data-aos-delay="800">
            <a href="#contact" className={`${styles.btn} ${styles.btnPrimary}`}>
              <span className={styles.btnIcon}></span>
              FIND SERVICES
            </a>
            <a href="#quote" className={`${styles.btn} ${styles.btnSecondary}`}>
              <span className={styles.btnIcon}></span>
              BECOME A WORKER
            </a>
          </div>
        </div>
        
        {/* Visual Element - Construction Tools */}
        <div className={styles.heroVisual} data-aos="zoom-in" data-aos-delay="1000">
          <div className={styles.toolsContainer}>
            <div className={`${styles.tool} ${styles.spanner}`}>🔧</div>
            <div className={`${styles.tool} ${styles.hammer}`}>🔨</div>
            <div className={`${styles.tool} ${styles.screwdriver}`}>🪛</div>
            <div className={`${styles.tool} ${styles.drill}`}>⚡</div>
            <div className={`${styles.tool} ${styles.pliers}`}>🔩</div>
            <div className={`${styles.tool} ${styles.saw}`}>🪚</div>
            <div className={`${styles.tool} ${styles.level}`}>📏</div>
            <div className={`${styles.tool} ${styles.toolbox}`}>🧰</div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className={styles.scrollIndicator}>
        <div className={styles.scrollText}>Scroll Down</div>
        <div className={styles.scrollArrow}></div>
      </div>
    </section>
  );
};

export default UniqueHero;