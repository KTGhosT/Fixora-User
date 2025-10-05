// src/components/BookingCompletion.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../services/api";
import styles from "./BookingCompletion.module.css";

const BookingCompletion = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await axiosInstance.get(`/api/bookings/${bookingId}`);
        setBooking(response.data.booking || response.data);
      } catch (err) {
        console.error("Error fetching booking details:", err);
        setError("Failed to load booking details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  const handleViewBookings = () => {
    navigate("/bookings");
  };

  const handleBookAnother = () => {
    navigate("/book-worker");
  };

  const handleDownloadReceipt = () => {
    // In a real app, this would generate and download a PDF receipt
    console.log("Downloading receipt for booking:", bookingId);
    // Simulate download
    alert("Receipt download functionality would be implemented here!");
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <h2>Loading Booking Details...</h2>
          <p>Please wait while we fetch your booking information.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>⚠️</div>
          <h2>Unable to Load Booking</h2>
          <p>{error}</p>
          <div className={styles.buttonGroup}>
            <button 
              onClick={() => window.location.reload()} 
              className={styles.primaryButton}
            >
              Try Again
            </button>
            <button 
              onClick={() => navigate("/bookings")} 
              className={styles.secondaryButton}
            >
              View All Bookings
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.completionCard}>
        {/* Success Header */}
        <div className={styles.successHeader}>
          <div className={styles.successIcon}>
            <div className={styles.checkmark}>✓</div>
          </div>
          <h1 className={styles.title}>Booking Confirmed!</h1>
          <p className={styles.subtitle}>
            Your service has been successfully scheduled. Here are your booking details.
          </p>
        </div>

        {/* Booking Details */}
        <div className={styles.bookingDetails}>
          <div className={styles.detailSection}>
            <h3 className={styles.sectionTitle}>Service Information</h3>
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Booking ID</span>
                <span className={styles.detailValue}>#{booking?.id || bookingId}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Service Type</span>
                <span className={styles.detailValue}>
                  {booking?.service_category?.name || "General Service"}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Scheduled Date</span>
                <span className={styles.detailValue}>
                  {booking?.scheduled_date ? new Date(booking.scheduled_date).toLocaleDateString() : "Not specified"}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Scheduled Time</span>
                <span className={styles.detailValue}>
                  {booking?.scheduled_time || "Not specified"}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.detailSection}>
            <h3 className={styles.sectionTitle}>Location Details</h3>
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Address</span>
                <span className={styles.detailValue}>
                  {booking?.address || "Address not specified"}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Service Area</span>
                <span className={styles.detailValue}>
                  {booking?.city || "City not specified"}
                </span>
              </div>
            </div>
          </div>

          {booking?.description && (
            <div className={styles.detailSection}>
              <h3 className={styles.sectionTitle}>Service Description</h3>
              <p className={styles.description}>{booking.description}</p>
            </div>
          )}

          {booking?.special_instructions && (
            <div className={styles.detailSection}>
              <h3 className={styles.sectionTitle}>Special Instructions</h3>
              <p className={styles.instructions}>{booking.special_instructions}</p>
            </div>
          )}
        </div>

        {/* Next Steps */}
        <div className={styles.nextSteps}>
          <h3 className={styles.stepsTitle}>What Happens Next?</h3>
          <div className={styles.stepsList}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <strong>Confirmation</strong>
                <p>You'll receive a confirmation email and SMS with all the details.</p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <strong>Worker Assignment</strong>
                <p>A qualified worker will be assigned to your booking within 24 hours.</p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <strong>Service Day</strong>
                <p>Your worker will arrive at the scheduled time with all necessary equipment.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actionSection}>
          <div className={styles.buttonGroup}>
            <button 
              onClick={handleDownloadReceipt}
              className={styles.downloadButton}
            >
              <span className={styles.buttonIcon}>📄</span>
              Download Receipt
            </button>
            <button 
              onClick={handleViewBookings}
              className={styles.primaryButton}
            >
              <span className={styles.buttonIcon}>📋</span>
              View My Bookings
            </button>
            <button 
              onClick={handleBookAnother}
              className={styles.secondaryButton}
            >
              <span className={styles.buttonIcon}>➕</span>
              Book Another Service
            </button>
          </div>
        </div>

        {/* Support Information */}
        <div className={styles.supportSection}>
          <div className={styles.supportCard}>
            <div className={styles.supportIcon}>💬</div>
            <div className={styles.supportContent}>
              <h4>Need Help?</h4>
              <p>Our support team is available 24/7 to assist you with any questions.</p>
              <div className={styles.contactInfo}>
                <span>📞 +1 (555) 123-4567</span>
                <span>✉️ support@servicely.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCompletion;