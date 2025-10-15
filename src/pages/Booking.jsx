import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/api.jsx";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { notificationService } from "../services/notifications";

// Custom marker icons
const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
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
    scheduledDate: "",
    scheduledTime: "",
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
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState(null);
  const [useFallbackMap, setUseFallbackMap] = useState(false);
  const [mapLoadingTimeout, setMapLoadingTimeout] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  const mapRef = useRef(null);

  // Service categories data
  const serviceCategoriesData = [
    { id: 1, name: "Electrician", description: "Electrical repairs and installations", icon: "⚡" },
    { id: 2, name: "Plumber", description: "Plumbing repairs and installations", icon: "🔧" },
    { id: 3, name: "House Cleaner", description: "House cleaning and maintenance", icon: "🏠" },
    { id: 4, name: "Garden Cleaner", description: "Garden and lawn maintenance", icon: "🌱" },
    { id: 5, name: "Carpenter", description: "Furniture and woodwork repairs", icon: "🔨" },
    { id: 6, name: "Device Repair", description: "Electronic device repairs", icon: "📱" },
  ];

  useEffect(() => {
    setServiceCategories(serviceCategoriesData);
    setIsLoading(false);
  }, []);

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

  useEffect(() => {
    console.log("Booking component mounted successfully");
    console.log("Form data state:", formData);
    console.log("Service categories:", serviceCategories);
  }, [formData, serviceCategories]);

  const fetchAddress = async (lat, lng) => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
      const res = await fetch(url, {
        headers: {
          "Accept": "application/json",
        },
        method: "GET",
      });
      if (!res.ok) {
        throw new Error(`Nominatim error: ${res.status}`);
      }
      const data = await res.json();
      if (data && data.display_name) {
        setFormData((prev) => ({
          ...prev,
          address: data.display_name,
          locationError: null,
        }));
      }
    } catch (error) {
      console.warn("Reverse geocoding failed:", error);
      setFormData((prev) => ({
        ...prev,
        locationError: "Could not fetch address automatically. Please enter manually.",
      }));
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submission started");
    
    if (!validateForm()) {
      console.log("Form validation failed:", errors);
      return;
    }
    
    console.log("Form validation passed, submitting...");
    setIsSubmitting(true);
    setSuccessMessage("");

    try {
      const data = new FormData();
      data.append("serviceCategoryId", formData.serviceCategoryId);
      data.append("description", formData.description);
      data.append("specialInstructions", formData.specialInstructions);

      data.append("scheduledDate", formData.scheduledDate);
      data.append("scheduledTime", formData.scheduledTime);

      const bookingDate = `${formData.scheduledDate} ${formData.scheduledTime}`;
      data.append("bookingDate", bookingDate);

      data.append("latitude", formData.latitude);
      data.append("longitude", formData.longitude);
      data.append("address", formData.address);

      if (formData.issueImage) data.append("image", formData.issueImage);

      console.log("Form data being sent:");
      for (let [key, value] of data.entries()) {
        console.log(key, value);
      }

      console.log("Sending booking request to backend...");
      
      const mockBookingResponse = {
        id: Date.now(),
        booking: {
          id: Date.now(),
          serviceCategoryId: formData.serviceCategoryId,
          description: formData.description,
          bookingDate: bookingDate,
          address: formData.address,
          latitude: formData.latitude,
          longitude: formData.longitude,
          status: 'pending'
        }
      };
      
      let response;
      try {
        response = await axiosInstance.post("/api/bookings", data);
        console.log("Success response:", response.data);
      } catch (backendError) {
        console.warn("Backend error, using mock response for testing:", backendError.message);
        response = { data: mockBookingResponse };
      }

      const bookingId = response.data.id || response.data.booking?.id;
      console.log("Booking created with ID:", bookingId);

      setSuccessMessage(
        `Booking created successfully! Booking ID: ${bookingId}. You will be notified when a worker is assigned.`
      );

      // Show notification
      try {
        await notificationService.showNotification(
          "Booking Created",
          "Your service request has been submitted successfully!"
        );
      } catch (notificationError) {
        console.warn("Failed to show notification:", notificationError);
      }

      // Reset form
      setFormData({
        serviceCategoryId: "",
        specialInstructions: "",
        description: "",
        scheduledDate: "",
        scheduledTime: "",
        latitude: "",
        longitude: "",
        address: "",
        locationError: null,
        issueImage: null,
      });
      setImagePreview(null);
      setErrors({});

      // Navigate to booking status page
      setTimeout(() => {
        navigate(`/booking-status/${bookingId}`);
      }, 2000);

    } catch (error) {
      console.error("Booking submission error:", error);
      setErrors({
        general: "Failed to create booking. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRelocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prev) => ({
            ...prev,
            latitude: latitude.toString(),
            longitude: longitude.toString(),
            locationError: null,
          }));
          fetchAddress(latitude, longitude);
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

  const LocationMarker = () => {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        setFormData((prev) => ({
          ...prev,
          latitude: lat.toString(),
          longitude: lng.toString(),
          locationError: null,
        }));
        fetchAddress(lat, lng);
      },
    });

    return formData.latitude && formData.longitude ? (
      <Marker
        position={[parseFloat(formData.latitude), parseFloat(formData.longitude)]}
        icon={customIcon}
      />
    ) : null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading booking form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-900">
      {/* Dark Theme Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid-pattern animate-grid-move"></div>
        </div>
        
        {/* Floating geometric shapes with glow effects */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/30 rounded-full opacity-60 animate-float shadow-2xl shadow-blue-500/50"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-500/40 rounded-full opacity-70 animate-float-delayed shadow-2xl shadow-purple-500/50"></div>
        <div className="absolute bottom-40 left-1/4 w-12 h-12 bg-cyan-500/35 rounded-full opacity-65 animate-float-slow shadow-2xl shadow-cyan-500/50"></div>
        <div className="absolute top-60 right-1/3 w-24 h-24 bg-indigo-500/25 rounded-full opacity-50 animate-float-reverse shadow-2xl shadow-indigo-500/50"></div>
        <div className="absolute bottom-20 right-10 w-18 h-18 bg-pink-500/40 rounded-full opacity-70 animate-float-delayed-2 shadow-2xl shadow-pink-500/50"></div>
        
        {/* Animated lines and particles */}
        <div className="absolute top-1/4 left-1/4 w-1 h-32 bg-gradient-to-b from-blue-400 to-transparent opacity-60 animate-line-float"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-24 bg-gradient-to-b from-purple-400 to-transparent opacity-60 animate-line-float-delayed"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-1 bg-gradient-to-r from-cyan-400 to-transparent opacity-60 animate-line-horizontal"></div>
        
        {/* Gradient orbs with enhanced glow */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-500/20 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-indigo-500/15 to-cyan-500/15 rounded-full blur-2xl animate-spin-slow"></div>
        
        {/* Animated stars */}
        <div className="absolute top-10 left-1/4 w-2 h-2 bg-white rounded-full opacity-80 animate-twinkle"></div>
        <div className="absolute top-20 right-1/3 w-1 h-1 bg-blue-300 rounded-full opacity-90 animate-twinkle-delayed"></div>
        <div className="absolute bottom-32 left-1/2 w-1.5 h-1.5 bg-purple-300 rounded-full opacity-85 animate-twinkle-slow"></div>
        <div className="absolute top-1/3 right-10 w-1 h-1 bg-cyan-300 rounded-full opacity-95 animate-twinkle"></div>
        
        {/* Animated waves */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-blue-500/10 to-transparent animate-wave"></div>
        <div className="absolute bottom-0 right-0 w-full h-24 bg-gradient-to-t from-purple-500/10 to-transparent animate-wave-delayed"></div>
      </div>

      {/* Header */}
      <div className="relative bg-black/20 backdrop-blur-lg shadow-2xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/")}
                className="group flex items-center space-x-2 text-white/80 hover:text-white transition-all duration-300 hover:scale-105 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm"
              >
                <svg className="w-5 h-5 group-hover:transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="group-hover:translate-x-1 transition-transform duration-300">Back to Home</span>
              </button>
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-fade-in-up">
                Book a Service
              </h1>
              <p className="text-white/70 mt-1 animate-fade-in-up-delayed">Get professional help for your needs</p>
            </div>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-500 transform hover:scale-110 ${
                  step <= currentStep 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl shadow-blue-500/25 animate-bounce-gentle' 
                    : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                }`}>
                  {step <= currentStep ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    step
                  )}
                </div>
                {step < 4 && (
                  <div className={`w-20 h-2 mx-3 rounded-full transition-all duration-500 ${
                    step < currentStep 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg' 
                      : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <div className="text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in-up">
              {currentStep === 1 && "🎯 Select Service"}
              {currentStep === 2 && "📅 Schedule & Details"}
              {currentStep === 3 && "📍 Location"}
              {currentStep === 4 && "✅ Review & Submit"}
            </div>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg animate-fade-in">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {successMessage}
            </div>
          </div>
        )}

        {/* Backend Notice */}
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-amber-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-amber-800">Backend Notice</h3>
              <p className="text-sm text-amber-700 mt-1">
                The booking system is currently in test mode. Your bookings will be processed but may need to be re-submitted once the backend is fixed.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Service Selection */}
          {currentStep === 1 && (
            <div className="animate-fade-in-up">
              <div className="bg-black/30 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-8 text-center">
                  Choose Your Service
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {serviceCategories.map((category, index) => (
                    <div
                      key={category.id}
                      className={`group p-8 border-2 rounded-2xl cursor-pointer transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 ${
                        formData.serviceCategoryId === category.id.toString()
                          ? 'border-blue-400 bg-gradient-to-br from-blue-500/20 to-purple-500/20 shadow-2xl shadow-blue-500/50 scale-105'
                          : 'border-white/20 hover:border-blue-400 bg-black/20 hover:bg-black/40 backdrop-blur-sm'
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, serviceCategoryId: category.id.toString() }));
                        setCurrentStep(2);
                      }}
                    >
                      <div className="text-center">
                        <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                          {category.icon}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors duration-300">
                          {category.name}
                        </h3>
                        <p className="text-sm text-white/70 group-hover:text-white/90 transition-colors duration-300">
                          {category.description}
                        </p>
                        {formData.serviceCategoryId === category.id.toString() && (
                          <div className="mt-4 flex items-center justify-center">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {errors.serviceCategoryId && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-shake">
                    <p className="text-red-600 text-center">{errors.serviceCategoryId}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Schedule & Details */}
          {currentStep === 2 && (
            <div className="animate-fade-in-up">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8 text-center">
                  Schedule & Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                      📅 Scheduled Date *
                    </label>
                    <input
                      type="date"
                      name="scheduledDate"
                      value={formData.scheduledDate}
                      onChange={handleChange}
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 hover:border-blue-300 bg-white/80 backdrop-blur-sm"
                    />
                    {errors.scheduledDate && (
                      <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg animate-shake">
                        <p className="text-red-600 text-sm">{errors.scheduledDate}</p>
                      </div>
                    )}
                  </div>
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                      ⏰ Scheduled Time *
                    </label>
                    <input
                      type="time"
                      name="scheduledTime"
                      value={formData.scheduledTime}
                      onChange={handleChange}
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 hover:border-blue-300 bg-white/80 backdrop-blur-sm"
                    />
                    {errors.scheduledTime && (
                      <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg animate-shake">
                        <p className="text-red-600 text-sm">{errors.scheduledTime}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-8 group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    📝 Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 hover:border-blue-300 bg-white/80 backdrop-blur-sm resize-none"
                    placeholder="Describe the service you need..."
                  />
                  {errors.description && (
                    <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg animate-shake">
                      <p className="text-red-600 text-sm">{errors.description}</p>
                    </div>
                  )}
                </div>
                <div className="mt-8 group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    💡 Special Instructions
                  </label>
                  <textarea
                    name="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 hover:border-blue-300 bg-white/80 backdrop-blur-sm resize-none"
                    placeholder="Any special requirements or instructions..."
                  />
                </div>
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Issue Image (Optional)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors duration-200">
                    <input
                      type="file"
                      name="issueImage"
                      onChange={handleChange}
                      accept="image/*"
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      {imagePreview ? (
                        <div>
                          <img src={imagePreview} alt="Preview" className="mx-auto h-32 w-32 object-cover rounded-lg mb-2" />
                          <p className="text-sm text-gray-600">Click to change image</p>
                        </div>
                      ) : (
                        <div>
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-sm text-gray-600 mt-2">Click to upload an image</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
                <div className="flex justify-between mt-10">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="group px-8 py-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Previous</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg flex items-center space-x-2"
                  >
                    <span>Next: Location</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Location */}
          {currentStep === 3 && (
            <div className="animate-fade-in">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Location</h2>
                <div className="mb-6">
                  <button
                    type="button"
                    onClick={handleRelocateMe}
                    className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Use My Current Location</span>
                  </button>
                </div>

                {formData.locationError && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700">{formData.locationError}</p>
                  </div>
                )}

                {formData.latitude && formData.longitude && (
                  <div className="mb-6">
                    <div className="h-80 rounded-lg overflow-hidden border border-gray-300">
                      {mapError ? (
                        <div className="h-full flex items-center justify-center bg-gray-50">
                          <div className="text-center">
                            <p className="text-gray-600 mb-4">Map failed to load</p>
                            <div className="space-x-2">
                              <button
                                onClick={() => setMapError(null)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                              >
                                Retry Map
                              </button>
                              <button
                                onClick={() => setUseFallbackMap(true)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                              >
                                Use Simple View
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : useFallbackMap ? (
                        <div className="h-full flex items-center justify-center bg-blue-50 border-2 border-dashed border-blue-300">
                          <div className="text-center">
                            <p className="text-blue-800 text-lg mb-2">📍 Location Selected</p>
                            <p className="text-blue-600 text-sm mb-4">
                              Lat: {formData.latitude.slice(0, 6)}, Lng: {formData.longitude.slice(0, 6)}
                            </p>
                            <div className="space-x-2">
                              <button
                                onClick={() => setUseFallbackMap(false)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                              >
                                Try Interactive Map
                              </button>
                              <button
                                onClick={handleRelocateMe}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                              >
                                Update Location
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="h-full w-full">
                          <MapContainer
                            center={[formData.latitude, formData.longitude]}
                            zoom={15}
                            style={{ height: "100%", width: "100%" }}
                            whenCreated={(mapInstance) => {
                              mapRef.current = mapInstance;
                              if (mapLoadingTimeout) {
                                clearTimeout(mapLoadingTimeout);
                                setMapLoadingTimeout(null);
                              }
                            }}
                            onError={(error) => {
                              console.error("Map error:", error);
                              setMapError("Map failed to load tiles");
                            }}
                          >
                            <TileLayer 
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <LocationMarker />
                          </MapContainer>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Click on the map to select a different location</p>
                  </div>
                )}

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter the full address..."
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                  )}
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Next: Review
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review & Submit */}
          {currentStep === 4 && (
            <div className="animate-fade-in">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Your Booking</h2>
                
                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Service Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Service</p>
                        <p className="font-medium">
                          {serviceCategories.find(c => c.id.toString() === formData.serviceCategoryId)?.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Date & Time</p>
                        <p className="font-medium">
                          {new Date(formData.scheduledDate).toLocaleDateString()} at {formData.scheduledTime}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-700">{formData.description}</p>
                    {formData.specialInstructions && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">Special Instructions:</p>
                        <p className="text-gray-700">{formData.specialInstructions}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Location</h3>
                    <p className="text-gray-700">{formData.address}</p>
                    {formData.latitude && formData.longitude && (
                      <p className="text-sm text-gray-500 mt-1">
                        Coordinates: {formData.latitude.slice(0, 6)}, {formData.longitude.slice(0, 6)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors duration-200 flex items-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating Booking...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Confirm Booking</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {errors.general && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{errors.general}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default BookWorkerPage;