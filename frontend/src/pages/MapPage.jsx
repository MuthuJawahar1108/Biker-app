


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




// import React, { useState, useEffect, useRef, useContext } from "react";
// import axios from "axios";
// import Select from "react-select";
// import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";
// import { MechanicContext } from "../context/MechanicContext"; // Import context

// // Custom marker icon
// const customIcon = L.icon({
//   iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
// });

// const mechanicIcon = L.icon({
//   iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png", // Different icon for mechanics
//   shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
// });

// const customStyles = {
//   control: (styles) => ({
//     ...styles,
//     backgroundColor: "#2C2F36",
//     color: "#FFF",
//     borderColor: "#555",
//     boxShadow: "none",
//     "&:hover": { borderColor: "#777" },
//   }),
//   menu: (styles) => ({
//     ...styles,
//     backgroundColor: "#2C2F36",
//   }),
//   option: (styles, { isFocused, isSelected }) => ({
//     ...styles,
//     backgroundColor: isSelected ? "#4A90E2" : isFocused ? "#3A3D42" : "#2C2F36",
//     color: isSelected ? "#FFF" : "#DDD",
//     cursor: "pointer",
//     "&:hover": { backgroundColor: "#3A3D42" },
//   }),
//   singleValue: (styles) => ({
//     ...styles,
//     color: "#FFF",
//   }),
//   input: (styles) => ({
//     ...styles,
//     color: "#FFF",
//   }),
// };

// const MapPage = () => {
//   const { bikerLocation } = useContext(MechanicContext); // Get biker's location from context
//   const [start, setStart] = useState(bikerLocation || null); // Default to biker location
//   const [end, setEnd] = useState(null);
//   const [route, setRoute] = useState([]);
//   const [searchOptions, setSearchOptions] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [mechanicLocation, setMechanicLocation] = useState(null); // For tracking mechanic
//   const [nearbyMechanics, setNearbyMechanics] = useState([]); // For nearby mechanics
//   const [selectedBookingId, setSelectedBookingId] = useState(null); // Track selected booking
//   const searchCache = useRef({});
//   const token = localStorage.getItem("token"); // JWT token for authenticated requests

//   // Fetch nearby mechanics when bikerLocation changes
//   useEffect(() => {
//     if (bikerLocation) {
//       setStart(bikerLocation); // Set biker location as start
//       axios
//         .get(`http://localhost:5000/api/mechanics/nearby?longitude=${bikerLocation[0]}&latitude=${bikerLocation[1]}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then((response) => setNearbyMechanics(response.data))
//         .catch((error) => console.error("Error fetching nearby mechanics:", error));
//     }
//   }, [bikerLocation]);

//   // Track mechanic location for selected booking
//   useEffect(() => {
//     let interval;
//     if (selectedBookingId && token) {
//       interval = setInterval(async () => {
//         try {
//           const response = await axios.get(`http://localhost:5000/api/bookings/${selectedBookingId}/location`, {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//           setMechanicLocation(response.data.location.coordinates);
//           // Fetch route between biker and mechanic
//           const routeResponse = await axios.get(
//             `http://localhost:5000/api/map/route?start=${bikerLocation[1]},${bikerLocation[0]}&end=${response.data.location.coordinates[1]},${response.data.location.coordinates[0]}`,
//             { headers: { Authorization: `Bearer ${token}` } }
//           );
//           setRoute(
//             routeResponse.data.features[0].geometry.coordinates.map((coord) => [coord[1], coord[0]])
//           );
//         } catch (error) {
//           console.error("Error tracking mechanic location:", error);
//         }
//       }, 5000); // Update every 5 seconds
//     }
//     return () => clearInterval(interval);
//   }, [selectedBookingId, bikerLocation]);

//   // Fetch route when start or end changes
//   useEffect(() => {
//     if (!start || !end) return;

//     const fetchRoute = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:5000/api/map/route?start=${start[1]},${start[0]}&end=${end[1]},${end[0]}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         if (response.data && response.data.features) {
//           const coordinates = response.data.features[0].geometry.coordinates.map((coord) => [
//             coord[1],
//             coord[0],
//           ]);
//           setRoute(coordinates);
//         }
//       } catch (error) {
//         console.error("Error fetching route", error);
//       }
//     };

//     fetchRoute();
//   }, [start, end]);

//   // Debounce search API calls
//   useEffect(() => {
//     if (!searchQuery) return;

//     const delayDebounceFn = setTimeout(async () => {
//       if (searchCache.current[searchQuery]) {
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
//           searchCache.current[searchQuery] = options;
//         } catch (error) {
//           console.error("Error fetching locations", error);
//         }
//       }
//     }, 500);

//     return () => clearTimeout(delayDebounceFn);
//   }, [searchQuery]);

//   return (
//     <div style={{ width: "100%", height: "100vh", position: "relative" }}>
//       <div style={{ position: "absolute", top: 10, left: "10%", width: "80%", zIndex: 1000 }}>
//         <Select
//           styles={customStyles}
//           placeholder="Search Start Location..."
//           options={searchOptions}
//           onInputChange={(query) => setSearchQuery(query)}
//           onChange={(option) => setStart(option.value)}
//           value={start ? { label: "Biker Location", value: start } : null}
//         />
//         <Select
//           styles={customStyles}
//           placeholder="Search End Location..."
//           options={searchOptions}
//           onInputChange={(query) => setSearchQuery(query)}
//           onChange={(option) => setEnd(option.value)}
//         />
//         <button
//           onClick={() => setSelectedBookingId("your-booking-id-here")} // Replace with dynamic booking ID
//           style={{ padding: "10px", background: "#007bff", color: "white", marginTop: "10px" }}
//         >
//           Track Assigned Mechanic
//         </button>
//       </div>

//       <MapContainer center={start || [20, 78]} zoom={13} style={{ width: "100%", height: "100%" }}>
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         />

//         {/* Biker Marker */}
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
//             <Popup>Biker Location</Popup>
//           </Marker>
//         )}

//         {/* Mechanic Marker (for tracking) */}
//         {mechanicLocation && (
//           <Marker position={mechanicLocation} icon={mechanicIcon}>
//             <Popup>Assigned Mechanic</Popup>
//           </Marker>
//         )}

//         {/* Nearby Mechanics Markers */}
//         {nearbyMechanics.map((mechanic) => (
//           <Marker
//             key={mechanic._id}
//             position={mechanic.location.coordinates}
//             icon={mechanicIcon}
//           >
//             <Popup>
//               {mechanic.name} <br /> Rating: {mechanic.rating || "N/A"}
//             </Popup>
//           </Marker>
//         ))}

//         {/* Route Polyline */}
//         {route.length > 0 && <Polyline positions={route} color="blue" />}
//       </MapContainer>
//     </div>
//   );
// };

// export default MapPage;




import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import Select from "react-select";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { useSearchParams } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MechanicContext } from "../context/MechanicContext";

const customIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const mechanicIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const customStyles = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "#2C2F36",
    color: "#FFF",
    borderColor: "#555",
    boxShadow: "none",
    "&:hover": { borderColor: "#777" },
  }),
  menu: (styles) => ({
    ...styles,
    backgroundColor: "#2C2F36",
  }),
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isSelected ? "#4A90E2" : isFocused ? "#3A3D42" : "#2C2F36",
    color: isSelected ? "#FFF" : "#DDD",
    cursor: "pointer",
    "&:hover": { backgroundColor: "#3A3D42" },
  }),
  singleValue: (styles) => ({
    ...styles,
    color: "#FFF",
  }),
  input: (styles) => ({
    ...styles,
    color: "#FFF",
  }),
};

const MapPage = () => {
  const { bikerLocation } = useContext(MechanicContext);
  const [searchParams] = useSearchParams();
  const [start, setStart] = useState(bikerLocation || null);
  const [end, setEnd] = useState(null);
  const [route, setRoute] = useState([]);
  const [searchOptions, setSearchOptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [mechanicLocation, setMechanicLocation] = useState(null);
  const [nearbyMechanics, setNearbyMechanics] = useState([]);
  const searchCache = useRef({});
  const token = localStorage.getItem("token");
  const selectedBookingId = searchParams.get("bookingId"); // Get bookingId from URL

  useEffect(() => {
    if (bikerLocation) {
      setStart(bikerLocation);
      axios
        .get(`http://localhost:5000/api/mechanics/nearby?longitude=${bikerLocation[0]}&latitude=${bikerLocation[1]}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setNearbyMechanics(response.data))
        .catch((error) => console.error("Error fetching nearby mechanics:", error));
    }
  }, [bikerLocation]);

  useEffect(() => {
    let interval;
    if (selectedBookingId && token) {
      interval = setInterval(async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/bookings/${selectedBookingId}/location`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setMechanicLocation(response.data.location.coordinates);
          const routeResponse = await axios.get(
            `http://localhost:5000/api/map/route?start=${bikerLocation[1]},${bikerLocation[0]}&end=${response.data.location.coordinates[1]},${response.data.location.coordinates[0]}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setRoute(
            routeResponse.data.features[0].geometry.coordinates.map((coord) => [coord[1], coord[0]])
          );
        } catch (error) {
          console.error("Error tracking mechanic location:", error);
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [selectedBookingId, bikerLocation]);

  useEffect(() => {
    if (!start || !end) return;

    const fetchRoute = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/map/route?start=${start[1]},${start[0]}&end=${end[1]},${end[0]}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data && response.data.features) {
          const coordinates = response.data.features[0].geometry.coordinates.map((coord) => [
            coord[1],
            coord[0],
          ]);
          setRoute(coordinates);
        }
      } catch (error) {
        console.error("Error fetching route", error);
      }
    };

    fetchRoute();
  }, [start, end]);

  useEffect(() => {
    if (!searchQuery) return;

    const delayDebounceFn = setTimeout(async () => {
      if (searchCache.current[searchQuery]) {
        setSearchOptions(searchCache.current[searchQuery]);
      } else {
        try {
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`
          );
          const options = response.data.map((place) => ({
            label: place.display_name,
            value: [parseFloat(place.lat), parseFloat(place.lon)],
          }));
          setSearchOptions(options);
          searchCache.current[searchQuery] = options;
        } catch (error) {
          console.error("Error fetching locations", error);
        }
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <div style={{ position: "absolute", top: 10, left: "10%", width: "80%", zIndex: 1000 }}>
        <Select
          styles={customStyles}
          placeholder="Search Start Location..."
          options={searchOptions}
          onInputChange={(query) => setSearchQuery(query)}
          onChange={(option) => setStart(option.value)}
          value={start ? { label: "Biker Location", value: start } : null}
        />
        <Select
          styles={customStyles}
          placeholder="Search End Location..."
          options={searchOptions}
          onInputChange={(query) => setSearchQuery(query)}
          onChange={(option) => setEnd(option.value)}
        />
      </div>

      <MapContainer center={start || [20, 78]} zoom={13} style={{ width: "100%", height: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {start && (
          <Marker
            position={start}
            icon={customIcon}
            draggable={true}
            eventHandlers={{
              dragend: (event) => {
                const newPos = event.target.getLatLng();
                setStart([newPos.lat, newPos.lng]);
              },
            }}
          >
            <Popup>Biker Location</Popup>
          </Marker>
        )}

        {mechanicLocation && (
          <Marker position={mechanicLocation} icon={mechanicIcon}>
            <Popup>Assigned Mechanic</Popup>
          </Marker>
        )}

        {nearbyMechanics.map((mechanic) => (
          <Marker
            key={mechanic._id}
            position={mechanic.location.coordinates}
            icon={mechanicIcon}
          >
            <Popup>
              {mechanic.name} <br /> Rating: {mechanic.rating || "N/A"}
            </Popup>
          </Marker>
        ))}

        {route.length > 0 && <Polyline positions={route} color="blue" />}
      </MapContainer>
    </div>
  );
};

export default MapPage;