import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import "./AcceptBookingPage.css";

const AcceptBookingPage = () => {

  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [mechanicLocation, setMechanicLocation] = useState(null);
  const [bikerLocation, setBikerLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [travelTime, setTravelTime] = useState(null);
  const [routeControl, setRouteControl] = useState(null);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    let isMounted = true;
    let timeoutId;

    const fetchBookingData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/bookings/${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (isMounted && response.data.bikerLocation) {
          setBikerLocation([
            response.data.bikerLocation.coordinates[0],
            response.data.bikerLocation.coordinates[1],
          ]);
        }
      } catch (err) {
        if (isMounted) setError("Failed to fetch booking data: " + err.message);
      }
    };

    const getMechanicLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            if (isMounted) {
              const { latitude, longitude } = position.coords;
              setMechanicLocation([latitude, longitude]);
            }
          },
          (err) => {
            if (isMounted) {
              setMechanicLocation([0, 0]); // Default if geolocation fails
              setError("Geolocation error: " + err.message);
            }
          },
          { enableHighAccuracy: true, timeout: 15000 }
        );
      } else {
        if (isMounted) setMechanicLocation([0, 0]);
      }
    };

    fetchBookingData();
    getMechanicLocation();

    // Set timeout to return to dashboard after 30 seconds
    timeoutId = setTimeout(() => {
      if (isMounted) navigate("/mechanic-dashboard");
    }, 30000);

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
      if (routeControl) routeControl.remove();
    };
  }, [bookingId, token]);

  useEffect(() => {
    if (mechanicLocation && bikerLocation && !routeControl) {
      const map = L.map("map").setView(mechanicLocation, 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      const control = L.Routing.control({
        waypoints: [L.latLng(mechanicLocation), L.latLng(bikerLocation)],
        routeWhileDragging: false,
        geodesic: true,
        lineOptions: {
          styles: [{ color: "blue", weight: 4 }],
        },
        addWaypoints: false,
      }).addTo(map);

      control.on("routesfound", (e) => {
        const routes = e.routes[0];
        const distanceInMeters = routes.summary.totalDistance;
        const timeInSeconds = routes.summary.totalTime;
        setDistance((distanceInMeters / 1000).toFixed(2));
        setTravelTime(Math.round(timeInSeconds / 60));
      });

      setRouteControl(control);

      return () => {
        if (routeControl) routeControl.remove();
      };
    }
  }, [mechanicLocation, bikerLocation, routeControl]);

  const handleAccept = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/bookings/${bookingId}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/mechanic-dashboard");
    } catch (err) {
      setError("Failed to accept booking: " + err.message);
    }
  };

  const handleDecline = () => {
    navigate("/mechanic-dashboard");
  };


  
  return (
    <div style={{ padding: "20px", backgroundColor: "#1C2526", color: "#FFF" }}>
      <h2>Accept Booking</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div id="map" style={{ height: "400px", width: "100%", marginBottom: "20px" }}></div>
      {distance && travelTime && (
        <p>
          Distance: {distance} km | Est. Travel Time: {travelTime} min
        </p>
      )}
      <button onClick={handleAccept} style={{ padding: "10px", background: "#28a745", color: "white", marginRight: "10px" }}>
        Accept
      </button>
      <button onClick={handleDecline} style={{ padding: "10px", background: "#dc3545", color: "white" }}>
        Decline
      </button>
    </div>
  );
};

export default AcceptBookingPage;