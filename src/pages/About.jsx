import React from 'react';

const AboutUsPage = () => {
  const styles = {
    container: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: '#333',
      lineHeight: 1.6,
      marginTop: '80px',
    },
    heroSection: {
      height: '80vh', // Much larger hero section
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2021&q=80')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      position: 'relative',
    },
    heroOverlay: {
      color: 'white',
      maxWidth: '1000px',
      padding: '0 40px',
    },
    heroTitle: {
      fontSize: '5rem',
      marginBottom: '2rem',
      fontWeight: '800',
      textShadow: '4px 4px 12px rgba(0, 0, 0, 0.8)',
      background: 'linear-gradient(45deg, #fff, #e3f2fd, #fff)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundSize: '200% 200%',
    },
    heroSubtitle: {
      fontSize: '2.2rem',
      marginBottom: '3rem',
      fontWeight: '300',
      color: '#e3f2fd',
      textShadow: '2px 2px 8px rgba(0, 0, 0, 0.6)',
      lineHeight: 1.4,
    },
    contentSection: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '6rem 2rem',
    },
    aboutUsContent: {
      padding: '5rem 3rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '30px',
      color: 'white',
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
      marginBottom: '4rem',
    },
    aboutUsTitle: {
      textAlign: 'center',
      fontSize: '3.5rem',
      marginBottom: '3rem',
      fontWeight: '800',
      textShadow: '3px 3px 8px rgba(0, 0, 0, 0.4)',
    },
    aboutUsText: {
      fontSize: '1.3rem',
      lineHeight: 1.9,
      textAlign: 'center',
      maxWidth: '1100px',
      margin: '0 auto',
      color: '#f8f9fa',
      textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)',
    },
    missionSection: {
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '4rem',
      borderRadius: '25px',
      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
      marginBottom: '4rem',
    },
    missionTitle: {
      textAlign: 'center',
      fontSize: '2.8rem',
      marginBottom: '2.5rem',
      fontWeight: '700',
      background: 'linear-gradient(45deg, #2c3e50, #4a90e2)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    missionText: {
      fontSize: '1.4rem',
      lineHeight: 1.8,
      textAlign: 'center',
      color: '#2c3e50',
      maxWidth: '900px',
      margin: '0 auto',
    },
    valuesSection: {
      marginTop: '5rem',
    },
    valuesTitle: {
      textAlign: 'center',
      fontSize: '3rem',
      marginBottom: '3rem',
      fontWeight: '700',
      color: '#2c3e50',
    },
    valuesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '3rem',
    },
    valueCard: {
      background: 'white',
      padding: '3rem 2rem',
      borderRadius: '20px',
      textAlign: 'center',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
    },
    valueIcon: {
      fontSize: '4rem',
      marginBottom: '2rem',
    },
    valueTitle: {
      fontSize: '1.8rem',
      marginBottom: '1.5rem',
      fontWeight: '600',
      color: '#2c3e50',
    },
    valueDescription: {
      fontSize: '1.1rem',
      lineHeight: 1.7,
      color: '#666',
    },
    teamSection: {
      background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
      padding: '5rem 3rem',
      borderRadius: '30px',
      color: 'white',
      marginTop: '4rem',
      textAlign: 'center',
    },
    teamTitle: {
      fontSize: '3rem',
      marginBottom: '2rem',
      fontWeight: '700',
      textShadow: '2px 2px 6px rgba(0, 0, 0, 0.3)',
    },
    teamText: {
      fontSize: '1.3rem',
      lineHeight: 1.8,
      maxWidth: '800px',
      margin: '0 auto',
      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
    },
    paragraphSpacing: {
      marginTop: '2rem',
    },
    highlightText: {
      background: 'linear-gradient(45deg, #fff, #ffeaa7)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontWeight: '600',
    }
  };

  return (
    <div style={styles.container}>
      {/* Hero Section - Much Larger */}
      <div style={styles.heroSection}>
        <div style={styles.heroOverlay}>
          <h1 style={styles.heroTitle}>About Us</h1>
          <p style={styles.heroSubtitle}>
            For explorers everywhere. Discover the world, discover yourself.
          </p>
        </div>
      </div>
      
      {/* Content Section */}
      <div style={styles.contentSection}>
        
        {/* Mission Statement */}
        <div style={styles.missionSection}>
          <h2 style={styles.missionTitle}>Our Mission</h2>
          <div style={styles.missionText}>
            <p>
              <strong style={styles.highlightText}>We believe that travel is for everyone.</strong> It's not just about visiting new places, 
              but about the profound journey of self-discovery that happens when we step outside our comfort zones. 
              Travel teaches us empathy, resilience, and the beautiful truth that we're all connected in this incredible world.
            </p>
          </div>
        </div>

        {/* Main About Us Content */}
        <div style={styles.aboutUsContent}>
          <h2 style={styles.aboutUsTitle}>Our Story</h2>
          <div style={styles.aboutUsText}>
            <p>
              Born from a shared passion for exploration and human connection, our platform emerged from the simple 
              realization that every journey changes us in ways we never expect. What started as a dream between 
              fellow travelers has grown into a global community of adventurers, storytellers, and lifelong learners.
            </p>
            
            <p style={styles.paragraphSpacing}>
              We've witnessed firsthand how travel breaks down barriers, builds bridges between cultures, and creates 
              understanding where there was once uncertainty. From the bustling markets of Southeast Asia to the serene 
              landscapes of Scandinavia, we've learned that the most valuable souvenirs aren't things, but the perspectives 
              we gain and the friendships we forge along the way.
            </p>
            
            <p style={styles.paragraphSpacing}>
              Our commitment goes beyond just sharing travel tips and beautiful destinations. We're building a space 
              where curiosity is celebrated, where questions are encouraged, and where every traveler—regardless of 
              experience or background—finds a home. We believe that when we share our stories, we don't just inspire 
              others to travel; we inspire them to see the world, and themselves, through new eyes.
            </p>
          </div>
        </div>

        {/* Our Values */}
        <div style={styles.valuesSection}>
          <h2 style={styles.valuesTitle}>Our Values</h2>
          <div style={styles.valuesGrid}>
            <div style={styles.valueCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div style={styles.valueIcon}>🌍</div>
              <h3 style={styles.valueTitle}>Global Community</h3>
              <p style={styles.valueDescription}>
                We believe in building bridges, not walls. Our community spans continents, 
                bringing together diverse perspectives and creating meaningful connections 
                that transcend geographical boundaries.
              </p>
            </div>
            
            <div style={styles.valueCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div style={styles.valueIcon}>💫</div>
              <h3 style={styles.valueTitle}>Authentic Experiences</h3>
              <p style={styles.valueDescription}>
                We champion real, meaningful travel over curated perfection. Our focus is on 
                genuine connections, local experiences, and the transformative power of 
                stepping into unfamiliar territory.
              </p>
            </div>
            
            <div style={styles.valueCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div style={styles.valueIcon}>🤝</div>
              <h3 style={styles.valueTitle}>Inclusive Exploration</h3>
              <p style={styles.valueDescription}>
                Travel should be accessible to all. We're committed to creating a space where 
                everyone feels welcome, represented, and empowered to explore the world 
                on their own terms.
              </p>
            </div>
          </div>
        </div>

        {/* Team Message */}
        <div style={styles.teamSection}>
          <h2 style={styles.teamTitle}>Join Our Journey</h2>
          <div style={styles.teamText}>
            <p>
              We're more than just a platform—we're a movement. A movement towards more conscious travel, 
              deeper connections, and a world where exploration leads to understanding. Every day, we're 
              inspired by the stories our community shares and the incredible ways travel continues to 
              transform lives.
            </p>
            <p style={styles.paragraphSpacing}>
              Whether you're planning your first trip or your hundredth, whether you prefer mountains 
              or cities, solo travel or family adventures—you have a place here. Your journey matters, 
              your stories matter, and we can't wait to see where they take you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;