import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import io from "socket.io-client";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import { useParams } from "react-router-dom";

const socket = io("http://localhost:5000");

// Custom icon for markers
const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const BikerTrackingPage = () => {
  const { bookingId } = useParams();
  const [mechanicPosition, setMechanicPosition] = useState(null);
  const [bikerPosition, setBikerPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Join biker-specific room
    socket.emit("join", `biker_${bookingId}`);

    // Fetch initial biker location from booking
    const fetchInitialLocation = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/bookings/${bookingId}/location`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBikerPosition(response.data.location.coordinates);
      } catch (err) {
        setError("Error fetching initial location: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialLocation();

    // Listen for mechanic location updates
    socket.on("mechanicLocationUpdate", (data) => {
      if (data.mechanicId) {
        setMechanicPosition([data.latitude, data.longitude]);
      }
    });

    // Clean up
    return () => {
      socket.emit("leave", `biker_${bookingId}`);
      socket.off("mechanicLocationUpdate");
    };
  }, [bookingId, token]);

  const defaultPosition = bikerPosition || [51.505, -0.09]; // Default to London

  if (loading) return <div>Loading map...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "100%", margin: "auto", backgroundColor: "#1C2526", color: "#FFF" }}>
      <h2 style={{ marginBottom: "20px" }}>Track Mechanic</h2>
      <MapContainer center={defaultPosition} zoom={13} style={{ height: "400px", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {bikerPosition && <Marker position={bikerPosition} icon={customIcon} />}
        {mechanicPosition && <Marker position={mechanicPosition} icon={customIcon} />}
      </MapContainer>
      {mechanicPosition && (
        <p style={{ marginTop: "10px" }}>
          Mechanic Location: {mechanicPosition[1].toFixed(4)}, {mechanicPosition[0].toFixed(4)}
        </p>
      )}
    </div>
  );
};

export default BikerTrackingPage;