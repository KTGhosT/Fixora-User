import React, { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, User, Phone, Mail, Eye, X, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { fetchUserBookingsApi, fetchBookingsApi, getBookingApi, updateBookingApi, deleteBookingApi } from "../../services/bookings";
import styles from "./BookingManagement.module.css";

const BookingManagement = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filter, setFilter] = useState("all"); // all, pending, confirmed, completed, cancelled

  useEffect(() => {
    if (user?.id) {
      fetchBookings();
    }
  }, [user?.id]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      if (!user?.id) {
        setError("User information not available. Please login again.");
        return;
      }
      
      try {
        // Try to fetch bookings specific to the current user
        const userBookings = await fetchUserBookingsApi(user.id);
        setBookings(userBookings);
      } catch (userApiError) {
        console.warn("User-specific bookings API not available, falling back to general API:", userApiError);
        
        // Fallback: fetch all bookings and filter on frontend
        const allBookings = await fetchBookingsApi();
        const userBookings = allBookings.filter(booking => 
          booking.user_id === user.id || 
          booking.email === user.email ||
          booking.phone === user.phone
        );
        setBookings(userBookings);
      }
    } catch (err) {
      console.error("Error fetching user bookings:", err);
      setError("Failed to load your bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (bookingId) => {
    try {
      const booking = await getBookingApi(bookingId);
      setSelectedBooking(booking);
      setShowDetails(true);
    } catch (err) {
      console.error("Error fetching booking details:", err);
      setError("Failed to load booking details.");
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await updateBookingApi(bookingId, { status: "cancelled" });
        setBookings(bookings.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: "cancelled" }
            : booking
        ));
        setShowDetails(false);
        setSelectedBooking(null);
      } catch (err) {
        console.error("Error cancelling booking:", err);
        setError("Failed to cancel booking. Please try again.");
      }
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <Clock className={styles.statusIcon} />;
      case "confirmed":
        return <CheckCircle className={styles.statusIcon} />;
      case "completed":
        return <CheckCircle className={styles.statusIcon} />;
      case "cancelled":
        return <XCircle className={styles.statusIcon} />;
      default:
        return <AlertCircle className={styles.statusIcon} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return styles.statusPending;
      case "confirmed":
        return styles.statusConfirmed;
      case "completed":
        return styles.statusCompleted;
      case "cancelled":
        return styles.statusCancelled;
      default:
        return styles.statusUnknown;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === "all") return true;
    return booking.status?.toLowerCase() === filter;
  });

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading your bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <AlertCircle className={styles.errorIcon} />
        <p>{error}</p>
        <button onClick={fetchBookings} className={styles.retryButton}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={styles.bookingManagement}>
      <div className={styles.header}>
        <h2 className={styles.title}>My Bookings</h2>
        <div className={styles.filterTabs}>
          {[
            { key: "all", label: "All" },
            { key: "pending", label: "Pending" },
            { key: "confirmed", label: "Confirmed" },
            { key: "completed", label: "Completed" },
            { key: "cancelled", label: "Cancelled" }
          ].map(tab => (
            <button
              key={tab.key}
              className={`${styles.filterTab} ${filter === tab.key ? styles.active : ""}`}
              onClick={() => setFilter(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className={styles.emptyState}>
          <Calendar className={styles.emptyIcon} />
          <h3>No bookings found</h3>
          <p>
            {filter === "all" 
              ? "You haven't made any bookings yet." 
              : `No ${filter} bookings found.`
            }
          </p>
        </div>
      ) : (
        <div className={styles.bookingsList}>
          {filteredBookings.map((booking) => (
            <div key={booking.id} className={styles.bookingCard}>
              <div className={styles.bookingHeader}>
                <div className={styles.serviceInfo}>
                  <h3 className={styles.serviceName}>
                    {booking.service_name || booking.service_type || "Service"}
                  </h3>
                  <p className={styles.bookingId}>Booking #{booking.id}</p>
                </div>
                <div className={`${styles.status} ${getStatusColor(booking.status)}`}>
                  {getStatusIcon(booking.status)}
                  <span>{booking.status || "Unknown"}</span>
                </div>
              </div>

              <div className={styles.bookingDetails}>
                <div className={styles.detailItem}>
                  <Calendar className={styles.detailIcon} />
                  <span>{formatDate(booking.booking_date || booking.created_at)}</span>
                </div>
                <div className={styles.detailItem}>
                  <Clock className={styles.detailIcon} />
                  <span>{formatTime(booking.booking_time || booking.created_at)}</span>
                </div>
                {booking.address && (
                  <div className={styles.detailItem}>
                    <MapPin className={styles.detailIcon} />
                    <span>{booking.address}</span>
                  </div>
                )}
                {booking.worker_name && (
                  <div className={styles.detailItem}>
                    <User className={styles.detailIcon} />
                    <span>{booking.worker_name}</span>
                  </div>
                )}
              </div>

              <div className={styles.bookingActions}>
                <button
                  className={styles.viewButton}
                  onClick={() => handleViewDetails(booking.id)}
                >
                  <Eye className={styles.buttonIcon} />
                  View Details
                </button>
                {booking.status?.toLowerCase() === "pending" && (
                  <button
                    className={styles.cancelButton}
                    onClick={() => handleCancelBooking(booking.id)}
                  >
                    <X className={styles.buttonIcon} />
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Details Modal */}
      {showDetails && selectedBooking && (
        <div className={styles.modalOverlay} onClick={() => setShowDetails(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Booking Details</h3>
              <button
                className={styles.closeButton}
                onClick={() => setShowDetails(false)}
              >
                <X />
              </button>
            </div>
            <div className={styles.modalContent}>
              <div className={styles.detailSection}>
                <h4>Service Information</h4>
                <div className={styles.detailGrid}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Service:</span>
                    <span>{selectedBooking.service_name || selectedBooking.service_type || "N/A"}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Booking ID:</span>
                    <span>#{selectedBooking.id}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Status:</span>
                    <span className={`${styles.status} ${getStatusColor(selectedBooking.status)}`}>
                      {getStatusIcon(selectedBooking.status)}
                      {selectedBooking.status || "Unknown"}
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Date:</span>
                    <span>{formatDate(selectedBooking.booking_date || selectedBooking.created_at)}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Time:</span>
                    <span>{formatTime(selectedBooking.booking_time || selectedBooking.created_at)}</span>
                  </div>
                  {selectedBooking.duration && (
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Duration:</span>
                      <span>{selectedBooking.duration} hours</span>
                    </div>
                  )}
                  {selectedBooking.price && (
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Price:</span>
                      <span>${selectedBooking.price}</span>
                    </div>
                  )}
                </div>
              </div>

              {selectedBooking.address && (
                <div className={styles.detailSection}>
                  <h4>Location</h4>
                  <div className={styles.detailRow}>
                    <MapPin className={styles.detailIcon} />
                    <span>{selectedBooking.address}</span>
                  </div>
                </div>
              )}

              {selectedBooking.worker_name && (
                <div className={styles.detailSection}>
                  <h4>Assigned Worker</h4>
                  <div className={styles.workerInfo}>
                    <div className={styles.workerDetails}>
                      <div className={styles.detailRow}>
                        <User className={styles.detailIcon} />
                        <span>{selectedBooking.worker_name}</span>
                      </div>
                      {selectedBooking.worker_phone && (
                        <div className={styles.detailRow}>
                          <Phone className={styles.detailIcon} />
                          <span>{selectedBooking.worker_phone}</span>
                        </div>
                      )}
                      {selectedBooking.worker_email && (
                        <div className={styles.detailRow}>
                          <Mail className={styles.detailIcon} />
                          <span>{selectedBooking.worker_email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {selectedBooking.notes && (
                <div className={styles.detailSection}>
                  <h4>Notes</h4>
                  <p className={styles.notes}>{selectedBooking.notes}</p>
                </div>
              )}

              {selectedBooking.status?.toLowerCase() === "pending" && (
                <div className={styles.modalActions}>
                  <button
                    className={styles.cancelButton}
                    onClick={() => {
                      handleCancelBooking(selectedBooking.id);
                      setShowDetails(false);
                    }}
                  >
                    Cancel Booking
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
