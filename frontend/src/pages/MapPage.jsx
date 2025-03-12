import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const MapPage = () => {
  // Coordinates for start (biker) and end (mechanic)
  const [start, setStart] = useState([12.9716, 77.5946]); // Example: Bangalore
  const [end, setEnd] = useState([12.9352, 77.6245]); // Example: Another location in Bangalore
  const [route, setRoute] = useState([]);

  // Fix the marker icon issue
// Use Leaflet's hosted marker icon directly
const customIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41], // Default Leaflet icon size
    iconAnchor: [12, 41], // Positioning the icon correctly
    popupAnchor: [1, -34],
  });
  // Fetch route when start or end changes
  useEffect(() => {


    const fetchRoute = async () => {
      try {
        const response = await axios.get(
            `http://localhost:5000/api/map/route?start=${start[1]},${start[0]}&end=${end[1]},${end[0]}`
        );

        if (response.data && response.data.routes) {
          const coordinates = response.data.routes[0].geometry.coordinates.map((coord) => [
            coord[1], // Latitude
            coord[0], // Longitude
          ]);
          setRoute(coordinates);
        }
      } catch (error) {
        console.error("Error fetching route", error);
      }
    };

    fetchRoute();
  }, [start, end]);

  return (
    <div className="w-full h-screen">
      <MapContainer center={start} zoom={12} className="h-full w-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Start Marker (Biker) */}
        <Marker position={start} icon={customIcon}>
  <Popup>Biker is here!</Popup>
</Marker>

<Marker position={end} icon={customIcon}>
  <Popup>Mechanic is here!</Popup>
</Marker>
        {/* Route Polyline */}
        {route.length > 0 && <Polyline positions={route} color="blue" />}
      </MapContainer>
    </div>
  );
};

export default MapPage;
