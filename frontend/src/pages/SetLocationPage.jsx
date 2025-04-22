

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import axios from "axios";
import "leaflet-control-geocoder";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";



// Add this custom CSS to change the geocoder styles
const customStyle = `
  .leaflet-control-geocoder input {
    background-color: #333; /* Dark background */
    color: #FFF; /* White text */
  }

  .leaflet-control-geocoder .leaflet-control-geocoder-form input {
    color: #FFF; /* White text in input */
  }

  .leaflet-control-geocoder .leaflet-control-geocoder-results li {
    background-color: #444; /* Dark background for suggestion list */
    color: #000; /* White text for suggestions */
  }

  .leaflet-control-geocoder .leaflet-control-geocoder-results li:hover {
    background-color: #28a745; /* Green background on hover */
    color: #000; /* White text on hover */
  }
`;


const SetLocationPage = () => {
  const { userType } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");  // To store the reverse geocoded address
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  // 📍 Function for reverse geocoding using Nominatim (OpenStreetMap)
  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
      const data = await response.json();
      if (data && data.address) {
        const address = `${data.address.road}, ${data.address.city}, ${data.address.state}, ${data.address.country}`;
        setAddress(address); // Set the geocoded address
      } else {
        setAddress("Address not found.");
      }
    } catch (err) {
      setError("Failed to fetch address.");
    }
  };

  // 📍 Adds geocoder control to the map
  const GeocoderControl = () => {
    const map = useMap();

    useEffect(() => {
      if (!map || !L.Control.Geocoder) return;

      const geocoder = L.Control.geocoder({
        position: "topleft",
        defaultMarkGeocode: false,
        placeholder: "Search for your location",
      })
        .on("markgeocode", (e) => {
          const { lat, lng } = e.geocode.center;
          const newLoc = [lat, lng];
          setLocation(newLoc);
          reverseGeocode(lat, lng);  // Reverse geocode the selected location
          map.setView(newLoc, 13);
        })
        .addTo(map);

              // Add custom style
      const styleElement = document.createElement("style");
      styleElement.innerHTML = customStyle;
      document.head.appendChild(styleElement);

      return () => map.removeControl(geocoder);
    }, [map]);

    return null;
  };

  // 📍 Handle map clicks to select location
  const LocationSelector = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setLocation([lat, lng]);
        reverseGeocode(lat, lng);  // Reverse geocode the selected location
      },
    });
    return null;
  };

  // 📍 Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation([latitude, longitude]);
          reverseGeocode(latitude, longitude); // Reverse geocode current location
        },
        (err) => {
          setError("Geolocation error: " + err.message);
          setLocation([0, 0]);
        }
      );
    } else {
      setError("Geolocation not supported");
      setLocation([0, 0]);
    }
  }, []);

  const handleRemovePin = () => {
    setLocation(null);
    setAddress(""); // Clear the address when removing the pin
  };

  const handleConfirm = async () => {
    if (!location) {
      setError("No location selected");
      return;
    }
    try {
      let endpoint = "";
      if (userType === "biker") {
        endpoint = `http://localhost:5000/api/bookings/location/${userId}`;
      } else if (userType === "mechanic") {
        endpoint = `http://localhost:5000/api/mechanics/${userId}/location`;
      } else {
        setError("Invalid user type");
        return;
      }

      console.log("Updating location:", location);
      await axios.put(
        endpoint,
        { location: { type: "Point", coordinates: location } },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate(userType === "biker" ? "/my-bookings" : "/mechanic-dashboard");
    } catch (err) {
      setError("Failed to update location: " + err.message);
    }
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#1C2526", color: "#FFF" }}>
      <h2>Set {userType === "biker" ? "Biker" : "Mechanic"} Location</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div style={{ height: "400px", width: "100%", marginBottom: "20px" }}>
        <MapContainer
          center={location || [0, 0]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />
          <GeocoderControl />
          <LocationSelector />
          {location && <Marker position={location} />}
        </MapContainer>
      </div>
      {address && location && (
        <div style={{ marginTop: "20px", color: "#FFF" }}>
            <h4>Selected Location:</h4>
            <p>Address: {address}</p>
            <p>Coordinates: Latitude: {location[0]}, Longitude: {location[1]}</p>
        </div>
    )}

      <button onClick={handleRemovePin} style={{ padding: "10px", background: "#dc3545", color: "white", marginRight: "10px" }}>
        Remove Pin
      </button>
      <button onClick={handleConfirm} style={{ padding: "10px", background: "#28a745", color: "white" }}>
        Confirm Location
      </button>
    </div>
  );
};

export default SetLocationPage;
