// import React, { useState } from "react";
// import axios from "axios";

// const MechanicLogin = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [location, setLocation] = useState(null);
//   const [available, setAvailable] = useState(false);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     // Implement login logic here
//     console.log("Logging in with:", username, password);
//   };

//   const getLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setLocation({
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           });
//         },
//         (error) => console.error("Error fetching location:", error)
//       );
//     } else {
//       alert("Geolocation is not supported by this browser.");
//     }
//   };

//   const updateAvailability = async () => {
//     if (!location) {
//       alert("Please fetch location first.");
//       return;
//     }

//     try {
//       const response = await axios.post("http://localhost:5000/api/mechanic/status", {
//         username,
//         location,
//         available,
//       });
//       console.log("Status updated:", response.data);
//     } catch (error) {
//       console.error("Error updating status:", error);
//     }
//   };

//   return (
//     <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
//       <h2>Mechanic Login</h2>
//       <form onSubmit={handleLogin}>
//         <input
//           type="text"
//           placeholder="Username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <button type="submit">Login</button>
//       </form>
//       <br />
//       <button onClick={getLocation}>Get Location</button>
//       {location && <p>Lat: {location.lat}, Lng: {location.lng}</p>}
//       <br />
//       <label>
//         <input
//           type="checkbox"
//           checked={available}
//           onChange={() => setAvailable(!available)}
//         />
//         Available for Service
//       </label>
//       <br />
//       <button onClick={updateAvailability}>Update Status</button>
//     </div>
//   );
// };

// export default MechanicLogin;

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const MechanicDashboard = () => {
//   const [mechanic, setMechanic] = useState(null);
//   const [isAvailable, setIsAvailable] = useState(true);
//   const [bookings, setBookings] = useState([]);
//   const mechanicId = "12345"; // Replace with actual mechanic ID



//   // // Fetch unassigned bookings
//   // useEffect(() => {
//   //   const fetchBookings = async () => {
//   //     try {
//   //       const response = await axios.get("http://localhost:5000/api/bookings/unassigned");
//   //       setBookings(response.data);
//   //     } catch (error) {
//   //       console.error("Error fetching unassigned bookings:", error);
//   //     }
//   //   };

//   //   fetchBookings();
//   // }, []);
//   // Fetch pending bookings
//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/api/bookings/pending");
//         setBookings(response.data);
//       } catch (error) {
//         console.error("Error fetching bookings", error);
//       }
//     };

//     fetchBookings();
//   }, []);


//   // Accept booking
//   const handleAccept = async (bookingId) => {
//     try {
//       await axios.post(`http://localhost:5000/api/bookings/${bookingId}/accept`, { mechanicId });
//       setBookings((prev) => prev.filter((booking) => booking._id !== bookingId));
//     } catch (error) {
//       console.error("Error accepting booking", error);
//     }
//   };

//   // Reject booking
//   const handleReject = async (bookingId) => {
//     try {
//       await axios.post(`http://localhost:5000/api/bookings/${bookingId}/reject`);
//       setBookings((prev) => prev.filter((booking) => booking._id !== bookingId));
//     } catch (error) {
//       console.error("Error rejecting booking", error);
//     }
//   };


//   const registerMechanic = async () => {
//     navigator.geolocation.getCurrentPosition(async (position) => {
//       const { latitude, longitude } = position.coords;
//       try {
//         const response = await axios.post("http://localhost:5000/api/mechanics/register", {
//           name: "John Mechanic",
//           phone: "9876543210",
//           longitude,
//           latitude,
//         });
//         setMechanic(response.data.mechanic);
//       } catch (error) {
//         console.error("Error registering", error);
//       }
//     });
//   };

//   const updateAvailability = async () => {
//     if (!mechanic) return;
//     try {
//       const response = await axios.put(`http://localhost:5000/api/mechanics/update-availability/${mechanic._id}`, {
//         isAvailable: !isAvailable,
//       });
//       setIsAvailable(response.data.mechanic.isAvailable);
//     } catch (error) {
//       console.error("Error updating availability", error);
//     }
//   };

//   return (
//     <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
//       <h1 style={{ fontSize: "20px", fontWeight: "bold" }}>Mechanic Dashboard</h1>
//       <button 
//         onClick={registerMechanic} 
//         style={{
//           padding: "10px",
//           backgroundColor: "#007bff",
//           color: "white",
//           border: "none",
//           borderRadius: "5px",
//           cursor: "pointer",
//           marginTop: "10px"
//         }}
//       >
//         Register Location
//       </button>
//       {mechanic && (
//         <button 
//           onClick={updateAvailability} 
//           style={{
//             padding: "10px",
//             backgroundColor: isAvailable ? "#28a745" : "#dc3545",
//             color: "white",
//             border: "none",
//             borderRadius: "5px",
//             cursor: "pointer",
//             marginLeft: "10px",
//             marginTop: "10px"
//           }}
//         >
//           Set {isAvailable ? "Busy" : "Available"}
//         </button>
//       )}

//     {/* <h2>Available Booking Requests</h2>
//       <ul>
//         {bookings.map((booking) => (
//           <li key={booking._id}>
//             <p>Biker Location: {booking.bikerLocation}</p>
//             <p>Issue: {booking.issueDescription}</p>
//             <button>Accept</button>
//             <button>Reject</button>
//           </li>
//         ))}
//       </ul> */}
//       <h2>Pending Bookings</h2>
//       {bookings.length === 0 ? (
//         <p>No pending bookings</p>
//       ) : (
//         bookings.map((booking) => (
//           <div key={booking._id} style={{ border: "1px solid #ddd", padding: "10px", margin: "10px 0" }}>
//             <p><strong>Biker Location:</strong> {booking.bikerLocation}</p>
//             <p><strong>Issue:</strong> {booking.issue}</p>
//             <button onClick={() => handleAccept(booking._id)} style={{ marginRight: "10px", padding: "5px 10px", background: "green", color: "white", border: "none" }}>
//               Accept
//             </button>
//             <button onClick={() => handleReject(booking._id)} style={{ padding: "5px 10px", background: "red", color: "white", border: "none" }}>
//               Reject
//             </button>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default MechanicDashboard;



//-----------------------------------------------------------



// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
// import L from "leaflet";

// // Fix the marker icon issue
// const customIcon = L.icon({
//   iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
//   iconSize: [25, 41], 
//   iconAnchor: [12, 41], 
//   popupAnchor: [1, -34],
// });

// const MechanicDashboard = () => {
//   const [pendingBookings, setPendingBookings] = useState([]);
//   const [acceptedBookings, setAcceptedBookings] = useState([]);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [route, setRoute] = useState([]);
//   const mechanicId = "12345"; // Replace with actual mechanic ID

//   // Fetch pending & accepted bookings
//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         const pendingResponse = await axios.get("http://localhost:5000/api/bookings/pending");
//         const acceptedResponse = await axios.get(`http://localhost:5000/api/bookings/accepted/${mechanicId}`);

//         setPendingBookings(pendingResponse.data);
//         setAcceptedBookings(acceptedResponse.data);
//       } catch (error) {
//         console.error("Error fetching bookings", error);
//       }
//     };

//     fetchBookings();
//   }, []);

//   // Accept booking
//   const handleAccept = async (bookingId) => {
//     try {
//       await axios.post(`http://localhost:5000/api/bookings/${bookingId}/accept`, { mechanicId });
//       setPendingBookings((prev) => prev.filter((booking) => booking._id !== bookingId));

//       const acceptedBooking = pendingBookings.find((b) => b._id === bookingId);
//       setAcceptedBookings((prev) => [...prev, acceptedBooking]);
//     } catch (error) {
//       console.error("Error accepting booking", error);
//     }
//   };

//   // Reject booking
//   const handleReject = async (bookingId) => {
//     try {
//       await axios.post(`http://localhost:5000/api/bookings/${bookingId}/reject`);
//       setPendingBookings((prev) => prev.filter((booking) => booking._id !== bookingId));
//     } catch (error) {
//       console.error("Error rejecting booking", error);
//     }
//   };

//   // Track biker
//   const handleTrack = async (booking) => {
//     setSelectedBooking(booking);

//     try {
//       const response = await axios.get(
//         `http://localhost:5000/api/map/route?start=${booking.bikerLocation[1]},${booking.bikerLocation[0]}&end=${booking.mechanicLocation[1]},${booking.mechanicLocation[0]}`
//       );

//       if (response.data && response.data.features) {
//         const coordinates = response.data.features[0].geometry.coordinates.map((coord) => [
//           coord[1], // Latitude
//           coord[0], // Longitude
//         ]);
//         setRoute(coordinates);
//       }
//     } catch (error) {
//       console.error("Error fetching route", error);
//     }
//   };

//   return (
//     <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
//       <h2>Pending Bookings</h2>
//       {pendingBookings.length === 0 ? (
//         <p>No pending bookings</p>
//       ) : (
//         pendingBookings.map((booking) => (
//           <div key={booking._id} style={{ border: "1px solid #ddd", padding: "10px", margin: "10px 0" }}>
//             <p><strong>Biker Location:</strong> {booking.bikerLocation.join(", ")}</p>
//             <p><strong>Issue:</strong> {booking.issue}</p>
//             <button onClick={() => handleAccept(booking._id)} style={{ marginRight: "10px", padding: "5px 10px", background: "green", color: "white", border: "none" }}>
//               Accept
//             </button>
//             <button onClick={() => handleReject(booking._id)} style={{ padding: "5px 10px", background: "red", color: "white", border: "none" }}>
//               Reject
//             </button>
//           </div>
//         ))
//       )}

//       <h2>Accepted Bookings</h2>
//       {acceptedBookings.length === 0 ? (
//         <p>No accepted bookings</p>
//       ) : (
//         acceptedBookings.map((booking) => (
//           <div key={booking._id} style={{ border: "1px solid #ddd", padding: "10px", margin: "10px 0" }}>
//             <p><strong>Biker Location:</strong> {booking.bikerLocation.join(", ")}</p>
//             <p><strong>Issue:</strong> {booking.issue}</p>
//             <button onClick={() => handleTrack(booking)} style={{ padding: "5px 10px", background: "blue", color: "white", border: "none" }}>
//               Track
//             </button>
//           </div>
//         ))
//       )}

//       {selectedBooking && (
//         <div style={{ marginTop: "20px" }}>
//           <h3>Tracking: {selectedBooking.bikerLocation.join(", ")}</h3>
//           <MapContainer center={selectedBooking.bikerLocation} zoom={13} style={{ width: "100%", height: "400px" }}>
//             <TileLayer
//               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//               attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//             />

//             {/* Biker Marker */}
//             <Marker position={selectedBooking.bikerLocation} icon={customIcon}>
//               <Popup>Biker's Location</Popup>
//             </Marker>

//             {/* Mechanic Marker */}
//             <Marker position={selectedBooking.mechanicLocation} icon={customIcon}>
//               <Popup>Your Location</Popup>
//             </Marker>

//             {/* Route */}
//             {route.length > 0 && <Polyline positions={route} color="blue" />}
//           </MapContainer>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MechanicDashboard;



//--------------------------------------------------------------

import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";

const customIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41], 
  iconAnchor: [12, 41], 
  popupAnchor: [1, -34],
});

const MechanicDashboard = () => {
  const [pendingBookings, setPendingBookings] = useState([]);
  const [acceptedBookings, setAcceptedBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bikerLocation, setBikerLocation] = useState(null);
  const [route, setRoute] = useState([]);
  const [completedJobs, setCompletedJobs] = useState([]);
  const [jobs, setJobs] = useState([]);

  const mechanicId = "67d29ea5e79bf91cbf6d514a"; // Replace with actual mechanic ID

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const pendingResponse = await axios.get("http://localhost:5000/api/bookings/pending");
        const acceptedResponse = await axios.get(`http://localhost:5000/api/bookings/accepted/${mechanicId}`);

        setPendingBookings(pendingResponse.data);
        setAcceptedBookings(acceptedResponse.data);
      } catch (error) {
        console.error("Error fetching bookings", error);
      }
    };

    fetchBookings();
  }, []);

  const handleAccept = async (bookingId) => {
    try {
      await axios.post(`http://localhost:5000/api/bookings/${bookingId}/accept`, { mechanicId });
      setPendingBookings((prev) => prev.filter((booking) => booking._id !== bookingId));

      const acceptedBooking = pendingBookings.find((b) => b._id === bookingId);
      setAcceptedBookings((prev) => [...prev, acceptedBooking]);
    } catch (error) {
      console.error("Error accepting booking", error);
    }
  };

  const handleTrack = async (booking) => {
    setSelectedBooking(booking);
    setBikerLocation(booking.bikerLocation);
    updateRoute(booking.bikerLocation, booking.mechanicLocation);
  };

  const updateRoute = async (bikerLoc, mechanicLoc) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/map/route?start=${bikerLoc[1]},${bikerLoc[0]}&end=${mechanicLoc[1]},${mechanicLoc[0]}`
      );
  
      if (response.data && response.data.features.length > 0) {
        const coordinates = response.data.features[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
        setRoute(coordinates);
      } else {
        console.warn("No route found in API response.");
      }
    } catch (error) {
      console.error("Error fetching route", error);
    }
  };

  const completeJob = async (jobId) => {
    try {
      await axios.post(`http://localhost:5000/api/mechanic/jobs/${jobId}/complete`);
      setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId)); // Remove from active list
    } catch (error) {
      console.error("Error completing job:", error);
    }
  };



  useEffect(() => {
    // Fetch active jobs
    axios.get("http://localhost:5000/api/mechanic/jobs")
      .then(response => setJobs(response.data))
      .catch(error => console.error("Error fetching jobs:", error));
  }, []);

  useEffect(() => {
    // Fetch completed jobs
    axios.get("http://localhost:5000/api/mechanic/completed-jobs")
      .then(response => setCompletedJobs(response.data))
      .catch(error => console.error("Error fetching completed jobs:", error));
  }, []);
  useEffect(() => {
  if (!selectedBooking) return;

  const interval = setInterval(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/bookings/${selectedBooking._id}/location`);
      if (response.data?.location) {
        setBikerLocation(response.data.location);
        updateRoute(response.data.location, selectedBooking.mechanicLocation);
      }
    } catch (error) {
      console.error("Error fetching live biker location", error);
    }
  }, 5000);

  return () => clearInterval(interval);
  }, [selectedBooking]);


  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h2>Accepted Bookings</h2>
      {acceptedBookings.map((booking) => (
        <div key={booking._id} style={{ border: "1px solid #ddd", padding: "10px", margin: "10px 0" }}>
          <p><strong>Biker Location:</strong> {booking.bikerLocation.join(", ")}</p>
          <p><strong>Issue:</strong> {booking.issue}</p>
          <button onClick={() => handleTrack(booking)} style={{ padding: "5px 10px", background: "blue", color: "white", border: "none" }}>
            Track Live
          </button>
        </div>
      ))}

    <h2>Active Jobs</h2>
      {jobs.length === 0 ? <p>No active jobs</p> : (
        jobs.map(job => (
          <div key={job.id} style={{ border: "1px solid black", padding: "10px", marginBottom: "10px" }}>
            <p><strong>Biker:</strong> {job.bikerName}</p>
            <p><strong>Location:</strong> {job.location}</p>
            <button onClick={() => completeJob(job.id)} style={{ backgroundColor: "green", color: "white", padding: "5px 10px" }}>
              Complete Job
            </button>
          </div>
        ))
      )}

      <h2>Pending Bookings</h2>
      {pendingBookings.map((booking) => (
        <div key={booking._id} style={{ border: "1px solid #ddd", padding: "10px", margin: "10px 0" }}>
          <p><strong>Biker Location:</strong> {booking.bikerLocation.join(", ")}</p>
          <p><strong>Issue:</strong> {booking.issue}</p>
          
          {/* Accept Booking Button */}
          <button 
            onClick={() => handleAccept(booking._id)} 
            style={{ padding: "5px 10px", background: "green", color: "white", border: "none" }}
          >
            Accept Booking
          </button>
        </div>
      ))}


      {selectedBooking && (
        <div style={{ marginTop: "20px" }}>
          <h3>Tracking: {bikerLocation?.join(", ")}</h3>
          <MapContainer center={bikerLocation} zoom={13} style={{ width: "100%", height: "400px" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* Biker Marker */}
            <Marker position={bikerLocation} icon={customIcon}>
              <Popup>Biker's Location</Popup>
            </Marker>

            {/* Mechanic Marker */}
            <Marker position={selectedBooking.mechanicLocation} icon={customIcon}>
              <Popup>Your Location</Popup>
            </Marker>

            {/* Route */}
            {route.length > 0 && <Polyline positions={route} color="blue" />}
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default MechanicDashboard;
