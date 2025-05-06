


import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MechanicContext } from "../context/MechanicContext";



import io from "socket.io-client";

const socket = io("http://localhost:5000");

const NewBookingPage = () => {
  const { bikerLocation, isLoading, error, updateLocation } = useContext(MechanicContext);
  const [issue, setIssue] = useState("");
  const [localError, setLocalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const bikerId = localStorage.getItem("userId");
  const bikerName = localStorage.getItem("userName");


  useEffect(() => {
    // Join biker room (optional, for future acceptance notifications)
    socket.emit("join", `biker_${bikerId}`);

    // Listen for booking acceptance
    socket.on("bookingAccepted", (data) => {
      if (data.bookingId) {
        alert(`Your booking has been accepted by a mechanic! Track it at /tracking/${data.bookingId}`);
      }
    });

    // Clean up
    return () => {
      socket.off("bookingAccepted");
    };
  }, [bikerId]);

  useEffect(() => {
    if (!bikerLocation && !isLoading) {
      updateLocation(); // Refresh location if not available
    }
  }, [bikerLocation, isLoading, updateLocation]);


  // const handleSetLocation = () => {
  //   navigate("/set-location/biker");
  // };

const handleSubmit = async (e) => {
    e.preventDefault();
    if (!issue.trim()) {
      setLocalError("Issue description is required");
      return;
    }
    if (!bikerLocation || isLoading) {
      setLocalError("Please wait for location to update");
      return;
    }
  
    setIsSubmitting(true);
    setLocalError("");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/bookings",
        { bikerId, bikerName, bikerLocation, issue: issue.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Booking response:", response.data);
      setLocalError("Booking created successfully!");
      // setTimeout(() => navigate("/my-bookings"), 1000);
      navigate("/my-bookings");


    } catch (err) {
      console.error("Booking error:", err.response?.data || err);
      setLocalError("Failed to create booking: " + err.response?.data.message || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto", backgroundColor: "#1C2526", color: "#FFF" }}>
      <h2 style={{ marginBottom: "20px" }}>Report an Issue</h2>
      {(error) && <p style={{ color: "red", marginBottom: "10px" }}>{contextError || localError}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>Issue Description</label>
          <textarea
            value={issue}
            onChange={(e) => {
              setIssue(e.target.value);
              setLocalError(""); // Clear error on change
            }}
            placeholder="e.g., Flat tire, Chain stuck"
            style={{ width: "100%", padding: "10px", backgroundColor: "#2C2F36", color: "#FFF", border: "1px solid #555", borderRadius: "4px" }}
            required
          />
        </div>
        {/* <div style={{ marginBottom: "15px" }}>
          <label>Location</label>
          <p style={{ padding: "10px", backgroundColor: "#2C2F36", border: "1px solid #555", borderRadius: "4px" }}>
            {isLoading ? "Updating location..." : bikerLocation ? `${bikerLocation[1]}, ${bikerLocation[0]}` : "Location not available"}
          </p>
          {!bikerLocation && !isLoading && (
            <button
              type="button"
              onClick={updateLocation}
              style={{ padding: "5px 10px", background: "#007bff", color: "white", marginTop: "5px" }}
            >
              Refresh Location
            </button>
          )}
        </div> */}
        {/* <button type="button" onClick={handleSetLocation} style={{ padding: "10px", background: "#007bff", color: "white", marginBottom: "10px" }}>
          Set Location
        </button> */}
        <button
          type="submit"
          disabled={isSubmitting || isLoading || !bikerLocation}
          style={{
            padding: "10px 20px",
            background: isSubmitting || isLoading || !bikerLocation ? "#666" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isSubmitting || isLoading || !bikerLocation ? "not-allowed" : "pointer",
          }}
        >
          {isSubmitting ? "Submitting..." : "Submit Issue"}
        </button>
      </form>
    </div>
  );
};
export default NewBookingPage;