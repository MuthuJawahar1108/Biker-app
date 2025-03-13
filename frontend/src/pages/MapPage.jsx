


// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import Select from "react-select";
// import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";

// // Custom marker icon
// const customIcon = L.icon({
//   iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
// });



// const customStyles = {
//   control: (styles) => ({
//     ...styles,
//     backgroundColor: "#2C2F36", // Dark background for input box
//     color: "#FFF", // White text color
//     borderColor: "#555", // Subtle border color
//     boxShadow: "none", // No extra shadow
//     "&:hover": { borderColor: "#777" }, // Border color on hover
//   }),
//   menu: (styles) => ({
//     ...styles,
//     backgroundColor: "#2C2F36", // Dark background for dropdown
//   }),
//   option: (styles, { isFocused, isSelected }) => ({
//     ...styles,
//     backgroundColor: isSelected ? "#4A90E2" : isFocused ? "#3A3D42" : "#2C2F36",
//     color: isSelected ? "#FFF" : "#DDD", // White for selected, gray for normal
//     cursor: "pointer",
//     "&:hover": { backgroundColor: "#3A3D42" }, // Hover effect
//   }),
//   singleValue: (styles) => ({
//     ...styles,
//     color: "#FFF", // Selected value text color
//   }),
//   input: (styles) => ({
//     ...styles,
//     color: "#FFF", // Input text color
//   }),
// };


// const MapPage = () => {
//   const [start, setStart] = useState(null); // No default start location
//   const [end, setEnd] = useState(null);
//   const [route, setRoute] = useState([]);
//   const [searchOptions, setSearchOptions] = useState([]);
//   const [searchQuery, setSearchQuery] = useState(""); // Store user input
//   const searchCache = useRef({}); // Cache to store previous API responses

//   // Fetch route when start or end changes
//   useEffect(() => {
//     if (!start || !end) return;

//     const fetchRoute = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:5000/api/map/route?start=${start[1]},${start[0]}&end=${end[1]},${end[0]}`
//         );

//         if (response.data && response.data.features) {
//           const coordinates = response.data.features[0].geometry.coordinates.map((coord) => [
//             coord[1], // Latitude
//             coord[0], // Longitude
//           ]);
//           setRoute(coordinates);
//         }
//       } catch (error) {
//         console.error("Error fetching route", error);
//       }
//     };

//     fetchRoute();
//   }, [start, end]);

//   // Debounce API calls: Wait for user to stop typing before fetching data
//   useEffect(() => {
//     if (!searchQuery) return;

//     const delayDebounceFn = setTimeout(async () => {
//       if (searchCache.current[searchQuery]) {
//         // Use cached results if available
//         setSearchOptions(searchCache.current[searchQuery]);
//       } else {
//         try {
//           const response = await axios.get(
//             `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`
//           );
//           const options = response.data.map((place) => ({
//             label: place.display_name,
//             value: [parseFloat(place.lat), parseFloat(place.lon)],
//           }));
//           setSearchOptions(options);
//           searchCache.current[searchQuery] = options; // Store results in cache
//         } catch (error) {
//           console.error("Error fetching locations", error);
//         }
//       }
//     }, 500); // Wait 500ms before making API call

//     return () => clearTimeout(delayDebounceFn); // Cleanup function
//   }, [searchQuery]);

//   return (
//     <div style={{ width: "100%", height: "100vh", position: "relative" }}>
//       {/* Search bars for start and end locations */}
//       <div style={{ position: "absolute", top: 10, left: "10%", width: "80%", zIndex: 1000 }}>
//         <Select
//           styles={customStyles}
//           placeholder="Search Start Location..."
//           options={searchOptions}
//           onInputChange={(query) => setSearchQuery(query)}
//           onChange={(option) => setStart(option.value)}
//         />
//         <Select
//           styles={customStyles}
//           placeholder="Search End Location..."
//           options={searchOptions}
//           onInputChange={(query) => setSearchQuery(query)}
//           onChange={(option) => setEnd(option.value)}
//         />
//       </div>

//       {/* Map Container */}
//       <MapContainer center={[20, 78]} zoom={5} style={{ width: "100%", height: "100%" }}>
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         />

//         {/* Start Marker (Biker) */}
//         {start && (
//           <Marker
//             position={start}
//             icon={customIcon}
//             draggable={true}
//             eventHandlers={{
//               dragend: (event) => {
//                 const newPos = event.target.getLatLng();
//                 setStart([newPos.lat, newPos.lng]);
//               },
//             }}
//           >
//             <Popup>Biker is here!</Popup>
//           </Marker>
//         )}

//         {/* End Marker (Mechanic) */}
//         {end && (
//           <Marker
//             position={end}
//             icon={customIcon}
//             draggable={true}
//             eventHandlers={{
//               dragend: (event) => {
//                 const newPos = event.target.getLatLng();
//                 setEnd([newPos.lat, newPos.lng]);
//               },
//             }}
//           >
//             <Popup>Mechanic is here!</Popup>
//           </Marker>
//         )}

//         {/* Route Polyline */}
//         {route.length > 0 && <Polyline positions={route} color="blue" />}
//       </MapContainer>
//     </div>
//   );
// };

// export default MapPage;



import React, { useState, useEffect, useContext } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { MechanicContext } from "../context/MechanicContext";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

// Fix Leaflet icon issue
const customIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const MapPage = () => {
  const { mechanics, setBikerLocation } = useContext(MechanicContext);
  const [userLocation, setUserLocation] = useState(null);

  // Get user's current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setBikerLocation([latitude, longitude]); // Set in context
      },
      (error) => console.error("Error getting location", error),
      { enableHighAccuracy: true }
    );
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <MapContainer center={userLocation || [12.9716, 77.5946]} zoom={12} style={{ width: "100%", height: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap contributors" />

        {/* User Location */}
        {userLocation && (
          <Marker position={userLocation} icon={customIcon}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {/* Nearby Mechanics */}
        {mechanics.map((mechanic) => (
          <Marker key={mechanic._id} position={[mechanic.location.coordinates[1], mechanic.location.coordinates[0]]} icon={customIcon}>
            <Popup>{mechanic.name} (Available: {mechanic.isAvailable ? "Yes" : "No"})</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapPage;
