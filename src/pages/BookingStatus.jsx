import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../services/api";

function BookingStatus() {
  const { bookingId } = useParams();
  const timerRef = useRef(null);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    if (!bookingId) return;

    const fetchOnce = async () => {
      try {
        const res = await axiosInstance.get(`/api/bookings/${bookingId}`);
        setBooking(res.data.booking || res.data); // adjust as per API response
      } catch (err) {
        console.error('Error fetching booking:', err);
      }
    };

    fetchOnce();
    timerRef.current = setInterval(fetchOnce, 5000);
    return () => clearInterval(timerRef.current);
  }, [bookingId]);

  if (!booking) return <p>Loading booking...</p>;

  return (
    <div>
      <h2>Booking Status</h2>
      <p>Status: {booking.status}</p>

      {booking.worker ? (
        <div>
          <h3>Worker Assigned ✅</h3>
          <p>Name: {booking.worker.name}</p>
          <p>Phone: {booking.worker.phone}</p>
        </div>
      ) : (
        <p>Finding nearest worker... 🔍</p>
      )}
    </div>
  );
}

export default BookingStatus;
