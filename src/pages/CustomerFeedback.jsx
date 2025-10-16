import React, { useState, useEffect, useRef } from 'react';
import styles from './CustomerFeedback.module.css';

const FeedbackCenter = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState(''); // 'text' or 'voice'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    category: 'general',
    message: ''
  });
  const [recordings, setRecordings] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Create a ref for the feedbacks section
  const feedbacksSectionRef = useRef(null);

  // Sample feedback data with audio recordings
  const runningFeedbacks = [
    // Text Feedbacks
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Regular User",
      comment: "The feedback process is incredibly smooth and the team actually implements suggestions! I've seen real changes based on user input.",
      rating: 5,
      avatar: "SJ",
      color: "#667eea",
      type: "text"
    },
    {
      id: 2,
      name: "Mike Chen",
      role: "Product Manager",
      comment: "I'm really happy with the service quality. The attention to detail and customer care is exceptional.",
      rating: 4,
      avatar: "MC",
      color: "#764ba2",
      type: "text"
    },
    {
      id: 3,
      name: "Emily Davis",
      role: "Healthcare Professional",
      comment: "Fast, friendly, and high-quality service. The response time to feedback is impressive and shows they value customer opinions.",
      rating: 5,
      avatar: "ED",
      color: "#f093fb",
      type: "text"
    },
    {
      id: 4,
      name: "David Wilson",
      role: "Software Engineer",
      comment: "Outstanding platform! The intuitive design makes it easy to share meaningful feedback. Keep up the great work!",
      rating: 5,
      avatar: "DW",
      color: "#4facfe",
      type: "text"
    },
    {
      id: 5,
      name: "Lisa Thompson",
      role: "Marketing Director",
      comment: "This feedback system has transformed how we gather customer insights. The analytics and reporting features are incredibly useful.",
      rating: 4,
      avatar: "LT",
      color: "#43e97b",
      type: "text"
    },
    {
      id: 6,
      name: "James Rodriguez",
      role: "UX Designer",
      comment: "The categorization of feedback makes it so easy to prioritize improvements. Love the star rating system!",
      rating: 5,
      avatar: "JR",
      color: "#fa709a",
      type: "text"
    },
    {
      id: 7,
      name: "Maria Garcia",
      role: "Teacher",
      comment: "As an educator, I appreciate how simple and accessible this platform is. It encourages even the least tech-savvy users to participate.",
      rating: 5,
      avatar: "MG",
      color: "#ff9a9e",
      type: "text"
    },
    {
      id: 8,
      name: "Robert Kim",
      role: "Startup Founder",
      comment: "The ability to track feedback implementation is game-changing. We've improved our product significantly based on user suggestions.",
      rating: 4,
      avatar: "RK",
      color: "#a8edea",
      type: "text"
    },
    {
      id: 9,
      name: "Jennifer Lee",
      role: "Content Creator",
      comment: "Beautiful interface and seamless experience. The feedback process feels rewarding rather than tedious.",
      rating: 5,
      avatar: "JL",
      color: "#fed6e3",
      type: "text"
    },
    {
      id: 10,
      name: "Thomas Brown",
      role: "Retail Manager",
      comment: "Our customer satisfaction has improved dramatically since implementing this feedback system. Highly recommended!",
      rating: 5,
      avatar: "TB",
      color: "#a18cd1",
      type: "text"
    },
    {
      id: 11,
      name: "Amanda White",
      role: "Customer Support",
      comment: "The feedback categories help us route issues to the right teams quickly. It's streamlined our entire support process.",
      rating: 4,
      avatar: "AW",
      color: "#fbc2eb",
      type: "text"
    },
    {
      id: 12,
      name: "Kevin Zhang",
      role: "Data Analyst",
      comment: "The data visualization of feedback trends is incredibly insightful. Helps us make data-driven decisions.",
      rating: 5,
      avatar: "KZ",
      color: "#8ec5fc",
      type: "text"
    },

    // Voice Feedbacks
    {
      id: 13,
      name: "Alex Rodriguez",
      role: "Tech Enthusiast",
      rating: 5,
      avatar: "AR",
      color: "#4facfe",
      type: "voice",
      audio: "https://example.com/audio1.mp3"
    },
    {
      id: 14,
      name: "Priya Patel",
      role: "Community Leader",
      rating: 4,
      avatar: "PP",
      color: "#43e97b",
      type: "voice",
      audio: "https://example.com/audio2.mp3"
    },
    {
      id: 15,
      name: "Daniel Smith",
      role: "Product Tester",
      rating: 5,
      avatar: "DS",
      color: "#ff9a9e",
      type: "voice",
      audio: "https://example.com/audio3.mp3"
    },
    {
      id: 16,
      name: "Sophia Martinez",
      role: "Beta User",
      rating: 5,
      avatar: "SM",
      color: "#a8edea",
      type: "voice",
      audio: "https://example.com/audio4.mp3"
    }
  ];

  // Initialize with sample recordings
  useEffect(() => {
    setRecordings(runningFeedbacks);
  }, []);

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
    
    // Add new feedback to recordings
    const newFeedback = {
      id: recordings.length + 1,
      name: formData.name || 'Anonymous',
      role: 'User',
      rating: formData.rating,
      avatar: formData.name ? formData.name.charAt(0).toUpperCase() : 'U',
      color: '#667eea',
      type: formType
    };

    // Add comment for text feedback or audio for voice feedback
    if (formType === 'text') {
      newFeedback.comment = formData.message;
    } else if (formType === 'voice') {
      newFeedback.audio = audioURL;
    }
    
    setRecordings(prev => [newFeedback, ...prev]);
    setIsFormOpen(false);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      rating: 5,
      category: 'general',
      message: ''
    });
    setAudioURL('');
    setFormType('');
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsFormOpen(false);
      setFormType('');
      setAudioURL('');
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

  // Voice Recording Functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Error accessing microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const openFormWithType = (type) => {
    setFormType(type);
    setIsFormOpen(true);
  };

  // Separate text and voice feedbacks
  const textFeedbacks = recordings.filter(feedback => feedback.type === 'text');
  const voiceFeedbacks = recordings.filter(feedback => feedback.type === 'voice');

  return (
    <div className={styles.feedbackApp}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          

        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
          <h1 className={styles.heroTitle}>
            "We'd love to hear what you think"
            <span className={styles.gradientText}> Share Your Experience</span>
          </h1>
          <p className={styles.heroDescription}>
            We'd love to hear from you! Your thoughts help us grow and improve.
            Take a moment to share your experience.
            Together, we make things better every day..
          </p>
          <div className={styles.heroButtons}>
            <button 
              className={styles.btnPrimary}
              onClick={() => openFormWithType('choice')}
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
              <div className={styles.statNumber}>{recordings.length}+</div>
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
              <div className={styles.featureIcon}>🎤</div>
              <h3>Voice Feedback</h3>
              <p>Record your feedback using your microphone</p>
              <button 
                className={styles.featureBtn}
                onClick={() => openFormWithType('voice')}
              >
                Record Now →
              </button>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📝</div>
              <h3>Text Feedback</h3>
              <p>Share your experiences and suggestions in writing</p>
              <button 
                className={styles.featureBtn}
                onClick={() => openFormWithType('text')}
              >
                Write Now →
              </button>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔊</div>
              <h3>Listen to Feedback</h3>
              <p>Hear what others have to say with voice recordings</p>
              <button 
                className={styles.featureBtn}
                onClick={scrollToFeedbacks}
              >
                Listen Now →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Running Feedbacks Section - UPDATED with divided layout */}
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
          
          {/* Divided Layout */}
          <div className={styles.feedbacksDividedLayout}>
            {/* Left Side - Text Feedbacks */}
            <div className={styles.textFeedbacksSection}>
              <div className={styles.sectionLabel}>
                <div className={styles.labelIcon}>📝</div>
                <h3>Written Feedbacks</h3>
                <span className={styles.countBadge}>{textFeedbacks.length}</span>
              </div>
              
              <div className={styles.textFeedbacksList}>
                {textFeedbacks.map((feedback) => (
                  <div key={feedback.id} className={styles.textFeedbackItem}>
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

            {/* Right Side - Voice Feedbacks */}
            <div className={styles.voiceFeedbacksSection}>
              <div className={styles.sectionLabel}>
                <div className={styles.labelIcon}>🎤</div>
                <h3>Voice Recordings</h3>
                <span className={styles.countBadge}>{voiceFeedbacks.length}</span>
              </div>
              
              <div className={styles.voiceFeedbacksList}>
                {voiceFeedbacks.map((feedback) => (
                  <div key={feedback.id} className={styles.voiceFeedbackItem}>
                    <div className={styles.voiceFeedbackHeader}>
                      <div 
                        className={styles.feedbackAvatar}
                        style={{ backgroundColor: feedback.color }}
                      >
                        {feedback.avatar}
                      </div>
                      <div className={styles.voiceUserInfo}>
                        <div className={styles.feedbackName}>{feedback.name}</div>
                        <div className={styles.feedbackRole}>{feedback.role}</div>
                        <div className={styles.voiceRating}>
                          {renderStars(feedback.rating)}
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.voicePlayer}>
                      <div className={styles.audioWrapper}>
                        <audio controls className={styles.audioPlayer}>
                          <source src={feedback.audio} type="audio/wav" />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                      <div className={styles.voiceDuration}>
                        <span className={styles.durationBadge}>🎵 2:30</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className={styles.ctaSection}>
            <h3>Ready to Share Your Experience?</h3>
            <p>Join our community of feedback champions and help shape the future.</p>
            <button 
              className={styles.ctaButton}
              onClick={() => openFormWithType('choice')}
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
              <h2>
                {formType === 'voice' ? 'Record Voice Feedback' : 
                 formType === 'text' ? 'Write Text Feedback' : 
                 'Choose Feedback Type'}
              </h2>
              <button 
                className={styles.closeBtn}
                onClick={() => {
                  setIsFormOpen(false);
                  setFormType('');
                  setAudioURL('');
                }}
                type="button"
              >
                ×
              </button>
            </div>
            
            {formType === 'choice' && (
              <div className={styles.choiceContainer}>
                <div className={styles.choiceOptions}>
                  <button 
                    className={styles.choiceCard}
                    onClick={() => setFormType('voice')}
                  >
                    <div className={styles.choiceIcon}>🎤</div>
                    <h3>Record Voice Feedback</h3>
                    <p>Speak your mind using your microphone</p>
                    <div className={styles.choiceBadge}>Quick & Easy</div>
                  </button>
                  
                  <button 
                    className={styles.choiceCard}
                    onClick={() => setFormType('text')}
                  >
                    <div className={styles.choiceIcon}>📝</div>
                    <h3>Write Text Feedback</h3>
                    <p>Share your thoughts in writing</p>
                    <div className={styles.choiceBadge}>Detailed</div>
                  </button>
                </div>
              </div>
            )}

            {(formType === 'text' || formType === 'voice') && (
              <form onSubmit={handleSubmit} className={styles.feedbackForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Your Name (Optional)</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                  />
                </div>
                
                {/* Remove email field for voice feedback */}
                {formType === 'text' && (
                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email Address (Optional)</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                    />
                  </div>
                )}
                
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
                
                {formType === 'voice' && (
                  <div className={styles.voiceRecordingSection}>
                    <label className={styles.voiceLabel}>Record Your Voice Feedback</label>
                    <div className={styles.recordingControls}>
                      {!isRecording && !audioURL && (
                        <button 
                          type="button"
                          className={styles.recordButton}
                          onClick={startRecording}
                        >
                          🎤 Start Recording
                        </button>
                      )}
                      
                      {isRecording && (
                        <button 
                          type="button"
                          className={styles.stopButton}
                          onClick={stopRecording}
                        >
                          ⏹️ Stop Recording
                        </button>
                      )}
                      
                      {audioURL && (
                        <div className={styles.audioPreview}>
                          <div className={styles.audioPreviewLabel}>Your Recording:</div>
                          <audio controls className={styles.audioPlayer}>
                            <source src={audioURL} type="audio/wav" />
                            Your browser does not support the audio element.
                          </audio>
                          <button 
                            type="button"
                            className={styles.rerecordButton}
                            onClick={() => {
                              setAudioURL('');
                              audioChunksRef.current = [];
                            }}
                          >
                            🔄 Re-record
                          </button>
                        </div>
                      )}
                      
                      {isRecording && (
                        <div className={styles.recordingIndicator}>
                          <div className={styles.recordingDot}></div>
                          Recording... Speak now!
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {formType === 'text' && (
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
                )}
                
                <div className={styles.formActions}>
                  <button 
                    type="button" 
                    className={styles.btnCancel}
                    onClick={() => {
                      setIsFormOpen(false);
                      setFormType('');
                      setAudioURL('');
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className={styles.btnSubmit}
                    disabled={formType === 'voice' && !audioURL && !formData.message}
                  >
                    {formType === 'voice' ? 'Submit Voice Feedback' : 'Submit Text Feedback'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackCenter;