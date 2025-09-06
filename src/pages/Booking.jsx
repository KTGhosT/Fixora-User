import React, { useState, useEffect } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import { motion } from "framer-motion"; // install with: npm install framer-motion
import "bootstrap/dist/css/bootstrap.min.css";

const Booking = () => {
  const [location, setLocation] = useState("Fetching location...");
  const [description, setDescription] = useState("");
  const [datetime, setDatetime] = useState("");

  // Fetch location automatically
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          // Reverse geocode using OpenStreetMap (no API key needed)
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await res.json();
            setLocation(data.display_name || `${latitude}, ${longitude}`);
          } catch {
            setLocation(`${latitude}, ${longitude}`);
          }
        },
        () => setLocation("Unable to fetch location")
      );
    } else {
      setLocation("Geolocation not supported");
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`✅ Booking Submitted!\n📍 Location: ${location}\n📝 Issue: ${description}\n📅 Date/Time: ${datetime}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{ minHeight: "100vh", background: "linear-gradient(135deg,#00b4d8,#0077b6)", display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ width: "100%", maxWidth: "500px" }}
      >
        <Card className="shadow-lg rounded-4">
          <Card.Body>
            <h2 className="text-center mb-4 fw-bold">Book Your Service</h2>
            <Form onSubmit={handleSubmit}>
              {/* Location */}
              <Form.Group className="mb-3">
                <Form.Label>📍 Your Location</Form.Label>
                <Form.Control type="text" value={location} readOnly />
              </Form.Group>

              {/* Issue */}
              <Form.Group className="mb-3">
                <Form.Label>📝 Describe Your Issue</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Eg: Kitchen sink leaking..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </Form.Group>

              {/* Date & Time */}
              <Form.Group className="mb-3">
                <Form.Label>📅 Schedule Time</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={datetime}
                  onChange={(e) => setDatetime(e.target.value)}
                  required
                />
              </Form.Group>

              <div className="d-grid">
                <Button type="submit" variant="primary" size="lg" className="rounded-pill shadow">
                  Confirm Booking
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Booking;
