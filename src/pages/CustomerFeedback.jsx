import React, { useState, useEffect } from "react";
import styles from "./CustomerFeedback.module.css";
import UniqueHeader from "../components/user/Header";
import Footer from "../components/user/Footer";

const CustomerFeedback = () => {
  const [user, setUser] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [currentWorkerSlide, setCurrentWorkerSlide] = useState(0);
  const [showWorkerForm, setShowWorkerForm] = useState(false);
  const [workerRating, setWorkerRating] = useState(0);

  // Images for customer feedback
  const feedbackImages = [
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
    "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
    "https://images.unsplash.com/photo-1590086782792-42dd2350140d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
  ];

  // Images for workers feedback
  const workerImages = [
    "https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
    "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
    "https://images.unsplash.com/photo-1607746882042-944635dfe10e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ix",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
    "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600"
  ];

  // Auto-slide for customer feedback
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % feedbackImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [feedbackImages.length]);

  // Auto-slide for workers feedback
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWorkerSlide((prev) => (prev + 1) % workerImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [workerImages.length]);

  const handleSubmit = (e, isWorkerForm = false) => {
    e.preventDefault();
    alert(`Thank you for your ${isWorkerForm ? 'worker ' : ''}feedback!`);
    if (isWorkerForm) {
      setShowWorkerForm(false);
      setWorkerRating(0);
    } else {
      setShowForm(false);
      setRating(0);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header Component */}
      <UniqueHeader user={user} setUser={setUser} />

      {/* Customer Feedback Section */}
      <div className={styles.mainSection}>
        {/* Text Left */}
        <div className={styles.textContent}>
          <h2>
            Customer <br />
            <span>Feedback for the Application</span>
          </h2>
          <p>
            ✨ We value your thoughts! Share your experience and help us serve you better.  
            📝 Every feedback counts, your voice makes a difference.  
            💡 Let us know what you loved and what we can improve!
          </p>
          <button className={styles.readMore} onClick={() => setShowForm(true)}>
            Submit your Feedback
          </button>
        </div>

        {/* Slider Right */}
        <div className={styles.sliderContainer}>
          <div className={styles.slider}>
            {feedbackImages.map((image, index) => (
              <div
                key={index}
                className={`${styles.slide} ${index === currentSlide ? styles.active : ""}`}
                style={{ backgroundImage: `url(${image})` }}
              >
                <div className={styles.slideContent}>
                  <div className={styles.rating}>{"★".repeat(5)}</div>
                  <p className={styles.feedbackText}>"Excellent service and support!"</p>
                  <p className={styles.customerName}>- Sarah Johnson</p>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.sliderDots}>
            {feedbackImages.map((_, index) => (
              <button
                key={index}
                className={`${styles.dot} ${index === currentSlide ? styles.active : ""}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Prompt */}
      <div className={styles.scrollPrompt}>
        <span>👇👇 Scroll down to see our workers' feedback 👇👇</span>
      </div>

      {/* Workers Feedback Section */}
      <div className={styles.workersSection}>
        {/* Text Left */}
        <div className={styles.workersTextContent}>
          <h2>
            Our <br />
            <span>Workers' Effcient Feedback</span>
          </h2>
          <p>
            🚀 Share your experience as a worker and let others know your journey.  
            🛠️ Every insight matters – help us showcase your skills and dedication.  
            🌟 Tell us what went well and what could make your work even better!
          </p>
          <button className={styles.readMore} onClick={() => setShowWorkerForm(true)}>
            Submit your Feedback
          </button>
        </div>

        {/* Slider Right */}
        <div className={styles.workersSliderContainer}>
          <div className={styles.slider}>
            {workerImages.map((image, index) => (
              <div
                key={index}
                className={`${styles.slide} ${index === currentWorkerSlide ? styles.active : ""}`}
                style={{ backgroundImage: `url(${image})` }}
              >
                <div className={styles.slideContent}>
                  <div className={styles.rating}>{"★".repeat(5)}</div>
                  <p className={styles.feedbackText}>"Highly skilled and professional!"</p>
                  <p className={styles.customerName}>- John Doe</p>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.sliderDots}>
            {workerImages.map((_, index) => (
              <button
                key={index}
                className={`${styles.dot} ${index === currentWorkerSlide ? styles.active : ""}`}
                onClick={() => setCurrentWorkerSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Customer Feedback Modal */}
      {showForm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button className={styles.closeBtn} onClick={() => setShowForm(false)}>✕</button>
            <h3>Share Your Feedback</h3>
            <form className={styles.feedbackForm} onSubmit={(e) => handleSubmit(e, false)}>
              <input type="text" placeholder="Your Name" required />
              <input type="email" placeholder="Your Email" required />
              <textarea placeholder="Your Feedback about this Application" rows="4" required></textarea>
              <textarea placeholder="What can we improve?" rows="3"></textarea>
              <span className={styles.rateText}>Give your stars</span>
              <div className={styles.ratingStars}>
                {[1,2,3,4,5].map((star) => (
                  <span
                    key={star}
                    className={`${styles.star} ${rating >= star ? styles.active : ""}`}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
              <button type="submit" className={styles.submitBtn}>Submit</button>
            </form>
          </div>
        </div>
      )}

      {/* Workers Feedback Modal */}
      {showWorkerForm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button className={styles.closeBtn} onClick={() => setShowWorkerForm(false)}>✕</button>
            <h3>Share Worker Feedback</h3>
            <form className={styles.feedbackForm} onSubmit={(e) => handleSubmit(e, true)}>
              <input type="text" placeholder="Worker Name" required />
              <input type="email" placeholder="Your Email" required />
              <textarea placeholder="Feedback about the worker" rows="4" required></textarea>
              <textarea placeholder="What can the worker improve?" rows="3"></textarea>
              <span className={styles.rateText}>Give your stars</span>
              <div className={styles.ratingStars}>
                {[1,2,3,4,5].map((star) => (
                  <span
                    key={star}
                    className={`${styles.star} ${workerRating >= star ? styles.active : ""}`}
                    onClick={() => setWorkerRating(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
              <button type="submit" className={styles.submitBtn}>Submit</button>
            </form>
          </div>
        </div>
      )}

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default CustomerFeedback;