// src/pages/BookWorkerPage.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import styles from "./Booking.module.css";

import "leaflet/dist/leaflet.css";

// Custom marker icons
const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // 📍 custom red pin
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const BookWorkerPage = () => {
  const [formData, setFormData] = useState({
    description: "",
    scheduledDateTime: "",
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

  // Ref for map instance
  const mapRef = useRef(null);

  // Reverse geocode to get address from lat/lng
  const fetchAddress = async (lat, lng) => {
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      if (res.data && res.data.display_name) {
        setFormData((prev) => ({ ...prev, address: res.data.display_name }));
      }
    } catch (err) {
      console.error("Error fetching address:", err);
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
    if (!formData.description.trim())
      newErrors.description = "Description is required.";
    if (!formData.scheduledDateTime)
      newErrors.scheduledDateTime = "Scheduled date and time is required.";
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
      const token = localStorage.getItem("auth_token");
      const data = new FormData();
      data.append("description", formData.description);
      data.append("scheduled_at", formData.scheduledDateTime);
      data.append("latitude", formData.latitude);
      data.append("longitude", formData.longitude);
      data.append("address", formData.address);
      if (formData.issueImage) data.append("issue_image", formData.issueImage);

      await axios.post("/api/bookings", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccessMessage("Worker booked successfully!");
      setFormData({
        description: "",
        scheduledDateTime: "",
        latitude: formData.latitude,
        longitude: formData.longitude,
        address: formData.address,
        locationError: null,
        issueImage: null,
      });
      setImagePreview(null);
    } catch (error) {
      console.error("Booking error:", error);
      setErrors({ general: "Something went wrong. Please try again." });
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
        {/* Description */}
        <div className={styles["form-group"]}>
          <label>Description of Work</label>
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
        <div className={styles["form-group"]}>
          <label>Schedule Date & Time</label>
          <input
            type="datetime-local"
            name="scheduledDateTime"
            value={formData.scheduledDateTime}
            onChange={handleChange}
            className={styles["form-control"]}
          />
          {errors.scheduledDateTime && (
            <div className={styles["text-danger"]}>
              {errors.scheduledDateTime}
            </div>
          )}
        </div>

        {/* Address */}
        <div className={styles["form-group"]}>
          <label>Your Address</label>
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
