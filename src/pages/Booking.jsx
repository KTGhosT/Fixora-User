// src/pages/BookWorkerPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/api.jsx"; // path to your instance file
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import styles from "./Booking.module.css";
import "leaflet/dist/leaflet.css";
import { notificationService } from "../services/notifications";

// Custom marker icons
const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // 📍 custom red pin
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const BookWorkerPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    serviceCategoryId: "",
    specialInstructions: "",
    description: "",
    scheduledDate: "", // Separate date field
    scheduledTime: "", // Separate time field
    latitude: "",
    longitude: "",
    address: "",
    locationError: null,
    issueImage: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [serviceCategories, setServiceCategories] = useState([]);

  // Employment type and availability state
  const employmentTypes = ["Full-time", "Part-time", "Contract", "Dayworker"];
  const [employmentType, setEmploymentType] = useState("Dayworker");
  const [availability, setAvailability] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState(null);

  // Ref for map instance
  const mapRef = useRef(null);

  // Service categories data
  const serviceCategoriesData = [
    { id: 1, name: "Electrician", description: "Electrical repairs and installations" },
    { id: 2, name: "Plumber", description: "Plumbing repairs and installations" },
    { id: 3, name: "House Cleaner", description: "House cleaning and maintenance" },
    { id: 4, name: "Garden Cleaner", description: "Garden and lawn maintenance" },
    { id: 5, name: "Carpenter", description: "Furniture and woodwork repairs" },
    { id: 6, name: "Device Repair", description: "Electronic device repairs" },
  ];

  // Load service categories on component mount
  useEffect(() => {
    setServiceCategories(serviceCategoriesData);
  }, []);

  // Initialize notification service
  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        await notificationService.initialize();
        console.log("Notification service initialized");
      } catch (error) {
        console.warn("Failed to initialize notification service:", error);
      }
    };
    initializeNotifications();
  }, []);

  // Helpers for availability generation
  const formatDateInput = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const generateSlots = (type) => {
    const slots = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = formatDateInput(date);

      if (type === "Full-time") {
        slots.push({
          id: `${type}-${dateStr}-ft`,
          type,
          date: dateStr,
          startTime: "09:00",
          endTime: "17:00",
          durationMinutes: 8 * 60,
          label: "Full-day (8h)",
        });
      } else if (type === "Part-time") {
        slots.push({
          id: `${type}-${dateStr}-am`,
          type,
          date: dateStr,
          startTime: "09:00",
          endTime: "13:00",
          durationMinutes: 4 * 60,
          label: "Morning (4h)",
        });
        slots.push({
          id: `${type}-${dateStr}-pm`,
          type,
          date: dateStr,
          startTime: "14:00",
          endTime: "18:00",
          durationMinutes: 4 * 60,
          label: "Afternoon (4h)",
        });
      } else if (type === "Dayworker") {
        const dayworkerBlocks = [
          ["09:00", "11:00"],
          ["11:00", "13:00"],
          ["13:00", "15:00"],
          ["15:00", "17:00"],
        ];
        dayworkerBlocks.forEach(([start, end], idx) => {
          slots.push({
            id: `${type}-${dateStr}-dw-${idx}`,
            type,
            date: dateStr,
            startTime: start,
            endTime: end,
            durationMinutes: 2 * 60,
            label: "Hourly (2h)",
          });
        });
      } else if (type === "Contract") {
        // Contract starts on Mondays: 3-day and 7-day options
        const day = date.getDay(); // 1 = Monday
        if (day === 1) {
          // 3-day contract
          const end3 = new Date(date);
          end3.setDate(date.getDate() + 2);
          slots.push({
            id: `${type}-${dateStr}-3d`,
            type,
            date: dateStr,
            startTime: "09:00",
            endTime: "17:00",
            durationMinutes: 3 * 8 * 60,
            durationDays: 3,
            endDate: formatDateInput(end3),
            label: "3-day contract (8h/day)",
          });
          // 7-day contract
          const end7 = new Date(date);
          end7.setDate(date.getDate() + 6);
          slots.push({
            id: `${type}-${dateStr}-7d`,
            type,
            date: dateStr,
            startTime: "09:00",
            endTime: "17:00",
            durationMinutes: 7 * 8 * 60,
            durationDays: 7,
            endDate: formatDateInput(end7),
            label: "7-day contract (8h/day)",
          });
        }
      }
    }
    return slots;
  };

  useEffect(() => {
    setAvailability(generateSlots(employmentType));
    // Reset selected slot on type change
    setSelectedSlotId(null);
  }, [employmentType]);

  const handleSelectSlot = (slot) => {
    setSelectedSlotId(slot.id);
    const durationHours = slot.durationDays
      ? `${slot.durationDays} days`
      : `${Math.round(slot.durationMinutes / 60)} hrs`;
    const tag = `Employment: ${employmentType} (${durationHours})`;
    setFormData((prev) => ({
      ...prev,
      scheduledDate: slot.date,
      scheduledTime: slot.startTime,
      specialInstructions: prev.specialInstructions
        ? `${prev.specialInstructions}\n${tag}`
        : tag,
    }));
  };

  // Reverse geocode to get address from lat/lng
  // Rewritten to avoid CORS issues by using fetch directly to Nominatim (no proxy)
  // and with fallback to not auto-fill address if CORS fails.
  const fetchAddress = async (lat, lng) => {
    try {
      // Use fetch directly to Nominatim, no proxy, and do not send credentials
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
      const res = await fetch(url, {
        headers: {
          "Accept": "application/json",
        },
        method: "GET",
        // mode: "cors" is default, do not set credentials
      });
      if (!res.ok) {
        throw new Error(`Nominatim error: ${res.status}`);
      }
      const data = await res.json();
      if (data && data.display_name) {
        setFormData((prev) => ({ ...prev, address: data.display_name }));
      }
    } catch (err) {
      // Only log a warning, do not block the user
      console.warn("Could not auto-fill address from map location. Please enter your address manually.", err);
      // Optionally, you could set a message in state to inform the user
      // setFormData((prev) => ({ ...prev, address: "" }));
    }
  };

  // Get user's current location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prev) => ({
            ...prev,
            latitude,
            longitude,
            locationError: null,
          }));
          fetchAddress(latitude, longitude);
        },
        (error) => {
          setFormData((prev) => ({
            ...prev,
            locationError:
              "Unable to retrieve your location. Please enable location services.",
          }));
          console.error("Geolocation error:", error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setFormData((prev) => ({
        ...prev,
        locationError: "Geolocation is not supported by your browser.",
      }));
    }
  }, []);

  // Track map movements instead of dragging marker
  const LocationMarker = () => {
    const map = useMapEvents({
      moveend: () => {
        const center = map.getCenter();
        setFormData((prev) => ({
          ...prev,
          latitude: center.lat,
          longitude: center.lng,
        }));
        fetchAddress(center.lat, center.lng);
      },
    });

    // Save map instance to ref for recentering
    useEffect(() => {
      if (map && !mapRef.current) {
        mapRef.current = map;
      }
    }, [map]);

    // Marker stays fixed at center
    return formData.latitude && formData.longitude ? (
      <Marker
        position={[formData.latitude, formData.longitude]}
        icon={customIcon}
      />
    ) : null;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, issueImage: file }));
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.serviceCategoryId)
      newErrors.serviceCategoryId = "Please select a service category.";
    if (!formData.description.trim())
      newErrors.description = "Description is required.";
    if (!formData.scheduledDate)
      newErrors.scheduledDate = "Scheduled date is required.";
    if (!formData.scheduledTime)
      newErrors.scheduledTime = "Scheduled time is required.";
    if (!formData.latitude || !formData.longitude)
      newErrors.location = "Location is required.";
    if (!formData.address) newErrors.address = "Address is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setSuccessMessage("");

    try {
      const data = new FormData();
      data.append("serviceCategoryId", formData.serviceCategoryId);
      data.append("description", formData.description);
      data.append("specialInstructions", formData.specialInstructions);

      // Send both separate fields AND combined bookingDate for backend compatibility
      data.append("scheduledDate", formData.scheduledDate);
      data.append("scheduledTime", formData.scheduledTime);

      // Also send the combined bookingDate that the backend expects
      const bookingDate = `${formData.scheduledDate} ${formData.scheduledTime}`;
      data.append("bookingDate", bookingDate);

      data.append("latitude", formData.latitude);
      data.append("longitude", formData.longitude);
      data.append("address", formData.address);

      if (formData.issueImage) data.append("image", formData.issueImage);

      // Debug: Log what we're sending
      console.log("Form data being sent:");
      for (let [key, value] of data.entries()) {
        console.log(key, value);
      }

      const response = await axiosInstance.post("/api/bookings", data);
      console.log("Success response:", response.data);

      const { booking, id: topLevelId, bookingId: topLevelBookingId } = response.data || {};
      const bookingId = (booking && (booking.id ?? booking.bookingId)) ?? topLevelId ?? topLevelBookingId;
      if (!bookingId) {
        throw new Error("Booking ID missing from response");
      }

      // Send push notification for successful booking
      try {
        const bookingData = {
          id: bookingId,
          serviceCategoryId: formData.serviceCategoryId,
          bookingDate: bookingDate,
          description: formData.description,
          address: formData.address
        };

        await notificationService.sendBookingConfirmation(bookingData);
        console.log("Push notification sent successfully");
      } catch (notificationError) {
        console.warn("Failed to send push notification:", notificationError);
        // Don't fail the booking if notification fails
      }

      setSuccessMessage("Worker booked successfully! Check your notifications for confirmation.");
      // After successful booking, navigate to BookingCompletion page
      navigate("/BookingCompletion");

      setFormData({
        serviceCategoryId: "",
        specialInstructions: "",
        description: "",
        scheduledDate: "",
        scheduledTime: "",
        latitude: formData.latitude,
        longitude: formData.longitude,
        address: formData.address,
        locationError: null,
        issueImage: null,
      });
      setImagePreview(null);
    } catch (err) {
      console.error("Full error:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);

      if (err.response?.data?.errors) {
        console.error("Validation errors:", JSON.stringify(err.response.data.errors, null, 2));
        setErrors(err.response.data.errors);
      } else {
        setErrors({ general: err.response?.data?.message || "Something went wrong. Please try again." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler for "Relocate Me" button
  const handleRelocateMe = () => {
    if (navigator.geolocation) {
      setFormData((prev) => ({
        ...prev,
        locationError: null,
      }));
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prev) => ({
            ...prev,
            latitude,
            longitude,
            locationError: null,
          }));
          fetchAddress(latitude, longitude);
          // Recenter map if available
          if (mapRef.current) {
            mapRef.current.setView([latitude, longitude], mapRef.current.getZoom());
          }
        },
        (error) => {
          setFormData((prev) => ({
            ...prev,
            locationError:
              "Unable to retrieve your location. Please enable location services.",
          }));
          console.error("Geolocation error:", error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setFormData((prev) => ({
        ...prev,
        locationError: "Geolocation is not supported by your browser.",
      }));
    }
  };

  return (
    <div className={styles["book-worker-container"]}>
      {/* Back button to home */}
      <button
        type="button"
        className={styles["btn-back"]}
        style={{
          marginBottom: "1rem",
          background: "#eee",
          color: "#333",
          border: "1px solid #ccc",
          borderRadius: "4px",
          padding: "0.5rem 1rem",
          cursor: "pointer",
        }}
        onClick={() => navigate("/")}
      >
        &larr; Back to Home
      </button>

      <h2>Book a Worker</h2>

      {successMessage && (
        <div className={styles["success-message"]}>{successMessage}</div>
      )}
      {formData.locationError && (
        <div className={styles["error-message"]}>
          {formData.locationError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Employment Type Selection */}
        <div className={styles["form-group"]}>
          <label>Employment Type</label>
          <div className={styles["employment-tabs"]}>
            {employmentTypes.map((type) => (
              <button
                key={type}
                type="button"
                className={`${styles["tab"]} ${employmentType === type ? styles["active"] : ""}`}
                onClick={() => setEmploymentType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Availability Slots */}
        <div className={styles["form-group"]}>
          <label>Available Slots</label>
          <div className={styles["availability-grid"]}>
            {(availability || []).map((slot) => (
              <div
                key={slot.id}
                className={`${styles["slot-card"]} ${selectedSlotId === slot.id ? styles["selected"] : ""}`}
              >
                <div className={styles["slot-date"]}>{slot.date}{slot.durationDays ? ` → ${slot.endDate}` : ""}</div>
                <div className={styles["slot-time"]}>{slot.startTime} - {slot.endTime}</div>
                <div className={styles["slot-duration"]}>
                  {slot.label}
                </div>
                <button
                  type="button"
                  className={styles["slot-select-btn"]}
                  onClick={() => handleSelectSlot(slot)}
                >
                  Select
                </button>
              </div>
            ))}
          </div>
        </div>
        {/* Service Category Selection */}
        <div className={styles["form-group"]}>
          <label>Service Category *</label>
          <select
            name="serviceCategoryId"
            value={formData.serviceCategoryId}
            onChange={handleChange}
            className={styles["form-control"]}
          >
            <option value="">Select a service category...</option>
            {serviceCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name} - {category.description}
              </option>
            ))}
          </select>
          {errors.serviceCategoryId && (
            <div className={styles["text-danger"]}>{errors.serviceCategoryId}</div>
          )}
        </div>

        {/* Description */}
        <div className={styles["form-group"]}>
          <label>Description of Work *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className={styles["form-control"]}
            placeholder="Describe the task for the worker..."
          />
          {errors.description && (
            <div className={styles["text-danger"]}>{errors.description}</div>
          )}
        </div>

        {/* Special Instructions */}
        <div className={styles["form-group"]}>
          <label>Special Instructions (Optional)</label>
          <textarea
            name="specialInstructions"
            value={formData.specialInstructions}
            onChange={handleChange}
            rows="3"
            className={styles["form-control"]}
            placeholder="Any special requirements or instructions for the worker..."
          />
        </div>

        {/* Image Upload */}
        <div className={styles["form-group"]}>
          <label>Add Image of Issue (optional)</label>
          <input
            type="file"
            name="issueImage"
            accept="image/*"
            onChange={handleChange}
            className={styles["form-control"]}
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              style={{ maxWidth: "200px", marginTop: "10px" }}
            />
          )}
        </div>

        {/* Scheduled Date & Time */}
        {/* Update your form JSX - replace the datetime-local input with separate fields */}

        {/* Scheduled Date & Time - Separate Fields */}
        <div className={styles["form-group"]}>
          <label>Schedule Date *</label>
          <input
            type="date"
            name="scheduledDate"
            value={formData.scheduledDate}
            onChange={handleChange}
            className={styles["form-control"]}
          />
          {errors.scheduledDate && (
            <div className={styles["text-danger"]}>
              {errors.scheduledDate}
            </div>
          )}
        </div>

        <div className={styles["form-group"]}>
          <label>Schedule Time *</label>
          <input
            type="time"
            name="scheduledTime"
            value={formData.scheduledTime}
            onChange={handleChange}
            className={styles["form-control"]}
          />
          {errors.scheduledTime && (
            <div className={styles["text-danger"]}>
              {errors.scheduledTime}
            </div>
          )}
        </div>

        {/* Address */}
        <div className={styles["form-group"]}>
          <label>Your Address *</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={styles["form-control"]}
          />
          {errors.address && (
            <div className={styles["text-danger"]}>{errors.address}</div>
          )}
        </div>

        {/* Map and Relocate Me Button */}
        {formData.latitude && formData.longitude && (
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ height: "300px", marginBottom: "0.5rem" }}>
              <MapContainer
                center={[formData.latitude, formData.longitude]}
                zoom={15}
                style={{ height: "100%", width: "100%" }}
                whenCreated={(mapInstance) => {
                  mapRef.current = mapInstance;
                }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationMarker />
              </MapContainer>
            </div>
            <button
              type="button"
              onClick={handleRelocateMe}
              className={styles["btn-submit"]}
              style={{ width: "auto", margin: "0 auto", display: "block", marginBottom: "1rem" }}
            >
              Relocate Me
            </button>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={styles["btn-submit"]}
        >
          {isSubmitting ? "Booking..." : "Book Worker"}
        </button>

        {errors.general && (
          <div className={styles["general-error"]}>{errors.general}</div>
        )}
      </form>
    </div>
  );
};

export default BookWorkerPage;


        
