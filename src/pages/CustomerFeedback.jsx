import React, { useState, useEffect, useRef } from 'react';
import styles from './CustomerFeedback.module.css';

const FeedbackCenter = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    category: 'general',
    message: ''
  });

  // Create a ref for the feedbacks section
  const feedbacksSectionRef = useRef(null);

  // Sample feedback data with images
  const runningFeedbacks = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Regular User",
      comment: "The feedback process is incredibly smooth and the team actually implements suggestions!",
      rating: 5,
      avatar: "SJ",
      color: "#667eea"
    },
    {
      id: 2,
      name: "Mike Chen",
      role: "Product Manager",
      comment: "I’m really happy with the service quality",
      rating: 4,
      avatar: "MC",
      color: "#764ba2"
    },
    {
      id: 3,
      name: "Emily Davis",
      role: "Healthcare Professional",
      comment: "Fast, friendly, and high-quality service",
      rating: 5,
      avatar: "ED",
      color: "#f093fb"
    },
    {
      id: 4,
      name: "Alex Rodriguez",
      role: "Tech Enthusiast",
      comment: "They completed the task with great attention to detail",
      rating: 5,
      avatar: "AR",
      color: "#4facfe"
    },
    {
      id: 5,
      name: "Priya Patel",
      role: "Community Leader",
      comment: "The Fixora staff were professional and reliable.!",
      rating: 4,
      avatar: "PP",
      color: "#43e97b"
    },
    {
      id: 6,
      name: "David Kim",
      role: "UX Designer",
      comment: "The work was completed on time and professionally.",
      rating: 5,
      avatar: "DK",
      color: "#fa709a"
    }
  ];

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isFormOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFormOpen]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Feedback submitted:', formData);
    setIsFormOpen(false);
    // Reset form
    setFormData({
      name: '',
      email: '',
      rating: 5,
      category: 'general',
      message: ''
    });
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsFormOpen(false);
    }
  };

  // Function to scroll to feedbacks section
  const scrollToFeedbacks = () => {
    if (feedbacksSectionRef.current) {
      feedbacksSectionRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Function to render star ratings
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`${styles.star} ${index < rating ? styles.filled : ''}`}
      >
        ★
      </span>
    ));
  };

  return (
    <div className={styles.feedbackApp}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span>✨ New Feedbacks Are Welcome</span>
          </div>
          <h1 className={styles.heroTitle}>
            “We’d love to hear what you think"
            <span className={styles.gradientText}> Share Your Experience</span>
          </h1>
          <p className={styles.heroDescription}>
             We’d love to hear from you!
Your thoughts help us grow and improve.
Take a moment to share your experience.
Together, we make things better every day..
          </p>
          <div className={styles.heroButtons}>
            <button 
              className={styles.btnPrimary}
              onClick={() => setIsFormOpen(true)}
            >
              Fill Feedback
            </button>
            <button 
              className={styles.btnSecondary}
              onClick={scrollToFeedbacks}
            >
              View previous feedback
            </button>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <div className={styles.statNumber}>10K+</div>
              <div className={styles.statLabel}>Feedbacks</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNumber}>95%</div>
              <div className={styles.statLabel}>Satisfaction</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNumber}>24h</div>
              <div className={styles.statLabel}>Response Time</div>
            </div>
          </div>
        </div>
        
        <div className={styles.heroVisual}>
          {/* Background Image */}
          <div className={styles.heroBackgroundImage}></div>
          
          {/* Floating Cards */}
          <div className={`${styles.floatingCard} ${styles.card1}`}>
            <div className={styles.cardHeader}>
              <div className={styles.avatar}>JW</div>
              <div className={styles.userInfo}>
                <div className={styles.username}>Jake Williams</div>
                <div className={styles.userTitle}>British Hero</div>
              </div>
            </div>
            <div className={styles.cardContent}>
              "Amazing service! The team really listens to feedback."
            </div>
            <div className={styles.rating}>★★★★★</div>
          </div>
          <div className={`${styles.floatingCard} ${styles.card2}`}>
            <div className={styles.cardHeader}>
              <div className={styles.avatar}>AW</div>
              <div className={styles.userInfo}>
                <div className={styles.username}>Amanda Walley</div>
                <div className={styles.userTitle}>Better Voicekeeper</div>
              </div>
            </div>
            <div className={styles.cardContent}>
              "This platform makes giving feedback so easy and meaningful."
            </div>
            <div className={styles.rating}>★★★★☆</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>What You Can Do</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📝</div>
              <h3>Submit Feedback</h3>
              <p>Share your experiences, suggestions, and insights with our team</p>
              <button 
                className={styles.featureBtn}
                onClick={() => setIsFormOpen(true)}
              >
                Start Sharing →
              </button>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🗳️</div>
              <h3>Vote on Feedback</h3>
              <p>Help prioritize improvements by voting on other submissions</p>
              <button className={styles.featureBtn}>
                View Topics →
              </button>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📊</div>
              <h3>Explore Analytics</h3>
              <p>See how your feedback contributes to meaningful changes</p>
              <button className={styles.featureBtn}>
                See Results →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Running Feedbacks Section - Add ref here */}
      <section 
        className={styles.feedbacksSection}
        ref={feedbacksSectionRef}
      >
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>What Our Community Says</h2>
            <p className={styles.sectionSubtitle}>
              Real feedback from real users. Join thousands who are making a difference.
            </p>
          </div>
          
          <div className={styles.feedbacksContainer}>
            <div className={styles.feedbacksTrack}>
              {/* First set */}
              {runningFeedbacks.map((feedback) => (
                <div key={feedback.id} className={styles.feedbackCard}>
                  <div className={styles.feedbackHeader}>
                    <div 
                      className={styles.feedbackAvatar}
                      style={{ backgroundColor: feedback.color }}
                    >
                      {feedback.avatar}
                    </div>
                    <div className={styles.feedbackUser}>
                      <div className={styles.feedbackName}>{feedback.name}</div>
                      <div className={styles.feedbackRole}>{feedback.role}</div>
                    </div>
                  </div>
                  <div className={styles.feedbackComment}>
                    "{feedback.comment}"
                  </div>
                  <div className={styles.feedbackRating}>
                    {renderStars(feedback.rating)}
                    <span className={styles.ratingText}>
                      {feedback.rating}.0/5.0
                    </span>
                  </div>
                </div>
              ))}
              
              {/* Duplicate set for seamless loop */}
              {runningFeedbacks.map((feedback) => (
                <div key={`${feedback.id}-duplicate`} className={styles.feedbackCard}>
                  <div className={styles.feedbackHeader}>
                    <div 
                      className={styles.feedbackAvatar}
                      style={{ backgroundColor: feedback.color }}
                    >
                      {feedback.avatar}
                    </div>
                    <div className={styles.feedbackUser}>
                      <div className={styles.feedbackName}>{feedback.name}</div>
                      <div className={styles.feedbackRole}>{feedback.role}</div>
                    </div>
                  </div>
                  <div className={styles.feedbackComment}>
                    "{feedback.comment}"
                  </div>
                  <div className={styles.feedbackRating}>
                    {renderStars(feedback.rating)}
                    <span className={styles.ratingText}>
                      {feedback.rating}.0/5.0
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className={styles.ctaSection}>
            <h3>Ready to Share Your Experience?</h3>
            <p>Join our community of feedback champions and help shape the future.</p>
            <button 
              className={styles.ctaButton}
              onClick={() => setIsFormOpen(true)}
            >
              Share Your Feedback Now
            </button>
          </div>
        </div>
      </section>

      {/* Feedback Form Modal */}
      {isFormOpen && (
        <div 
          className={styles.modalOverlay}
          onClick={handleBackdropClick}
        >
          <div className={styles.feedbackModal}>
            <div className={styles.modalHeader}>
              <h2>Share Your Feedback</h2>
              <button 
                className={styles.closeBtn}
                onClick={() => setIsFormOpen(false)}
                type="button"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className={styles.feedbackForm}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>How are you feeling?</label>
                <div className={styles.ratingInput}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`${styles.starBtn} ${star <= formData.rating ? styles.active : ''}`}
                      onClick={() => setFormData({...formData, rating: star})}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="general">General Feedback</option>
                  <option value="service">Service Quality</option>
                  <option value="product">Product Feedback</option>
                  <option value="support">Customer Support</option>
                  <option value="suggestion">Suggestion</option>
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="message">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us about your experience..."
                  rows="5"
                  required
                ></textarea>
              </div>
              
              <div className={styles.formActions}>
                <button 
                  type="button" 
                  className={styles.btnCancel}
                  onClick={() => setIsFormOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.btnSubmit}>
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackCenter;