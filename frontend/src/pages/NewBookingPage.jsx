// import React, { useState, useContext } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { MechanicContext } from "../context/MechanicContext";

// const NewBookingPage = () => {
//   const { bikerLocation } = useContext(MechanicContext);
//   const [issue, setIssue] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/bookings",
//         {
//           bikerId: localStorage.getItem("userId"), // Assume userId is stored after login
//           bikerName: localStorage.getItem("userName"), // Assume name is stored
//           bikerLocation,
//           issue,
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       navigate("/my-bookings");
//     } catch (err) {
//       setError("Failed to create booking: " + err.response?.data.message || err.message);
//     }
//   };

//   return (
//     <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
//       <h2>New Booking</h2>
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Issue</label>
//           <textarea value={issue} onChange={(e) => setIssue(e.target.value)} required />
//         </div>
//         <button type="submit" style={{ padding: "10px", background: "#007bff", color: "white" }}>
//           Submit Booking
//         </button>
//       </form>
//     </div>
//   );
// };

// export default NewBookingPage;


// import React, { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { MechanicContext } from "../context/MechanicContext";

// const NewBookingPage = () => {
//   const { bikerLocation } = useContext(MechanicContext);
//   const [issue, setIssue] = useState("");
//   const [error, setError] = useState("");
//   const [nearbyMechanics, setNearbyMechanics] = useState([]);
//   const [selectedMechanic, setSelectedMechanic] = useState(null);
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");
//   const bikerId = localStorage.getItem("userId");
//   const bikerName = localStorage.getItem("userName");

//   useEffect(() => {
//     if (bikerLocation) {
//       axios
//         .get(`http://localhost:5000/api/mechanics/nearby?longitude=${bikerLocation[0]}&latitude=${bikerLocation[1]}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then((response) => setNearbyMechanics(response.data))
//         .catch((err) => setError("Error fetching mechanics: " + err.message));
//     }
//   }, [bikerLocation]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/bookings",
//         { bikerId, bikerName, bikerLocation, issue },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       const bookingId = response.data.booking._id;
//       if (selectedMechanic) {
//         await axios.post(
//           `http://localhost:5000/api/bookings/select-mechanic/${bookingId}`,
//           { mechanicId: selectedMechanic },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//       }
//       navigate("/my-bookings");
//     } catch (err) {
//       setError("Failed to create booking: " + err.response?.data.message || err.message);
//     }
//   };

//   return (
//     <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
//       <h2>Report an Issue</h2>
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Issue Description</label>
//           <textarea value={issue} onChange={(e) => setIssue(e.target.value)} placeholder="e.g., Flat tire, Chain stuck" required />
//         </div>
//         <div>
//           <label>Location</label>
//           <p>{bikerLocation ? `${bikerLocation[1]}, ${bikerLocation[0]}` : "Fetching location..."}</p>
//         </div>
//         <div>
//           <label>Select Mechanic</label>
//           <select value={selectedMechanic || ""} onChange={(e) => setSelectedMechanic(e.target.value)} required>
//             <option value="">-- Select a Mechanic --</option>
//             {nearbyMechanics.map((mechanic) => (
//               <option key={mechanic._id} value={mechanic._id}>
//                 {mechanic.name} (Rating: {mechanic.rating || "N/A"})
//               </option>
//             ))}
//           </select>
//         </div>
//         <button type="submit" style={{ padding: "10px", background: "#007bff", color: "white" }}>
//           Submit Issue
//         </button>
//       </form>
//     </div>
//   );
// };

// export default NewBookingPage;



import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MechanicContext } from "../context/MechanicContext";

const NewBookingPage = () => {
  const { bikerLocation, isLoading, error, updateLocation } = useContext(MechanicContext);
  const [issue, setIssue] = useState("");
  const [localError, setLocalError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const bikerId = localStorage.getItem("userId");
  const bikerName = localStorage.getItem("userName");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!issue.trim()) {
//       setLocalError("Issue description is required");
//       return;
//     }
//     if (!bikerLocation || isLoading) {
//       setLocalError("Please wait for location to update");
//       return;
//     }
//     try {
//         console.log({ bikerId, bikerName, bikerLocation, issue: issue.trim() })
//       await axios.post(
//         "http://localhost:5000/api/bookings",
//         { bikerId, bikerName, bikerLocation, issue: issue.trim() },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       navigate("/my-bookings");
//     } catch (err) {
//       setLocalError("Failed to create booking: " + err.response?.data.message || err.message);
//     }
//   };

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
    console.log({ bikerId, bikerName, bikerLocation, issue: issue.trim() }); // Debug log
    try {
      await axios.post(
        "http://localhost:5000/api/bookings",
        { bikerId, bikerName, bikerLocation, issue: issue.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/my-bookings");
    } catch (err) {
      setLocalError("Failed to create booking: " + err.response?.data.message || err.message);
    }
  };


  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto", backgroundColor: "#1C2526", color: "#FFF" }}>
      <h2 style={{ marginBottom: "20px" }}>Report an Issue</h2>
      {(error || localError) && <p style={{ color: "red", marginBottom: "10px" }}>{error || localError}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>Issue Description</label>
          <textarea
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            placeholder="e.g., Flat tire, Chain stuck"
            style={{ width: "100%", padding: "10px", backgroundColor: "#2C2F36", color: "#FFF", border: "1px solid #555", borderRadius: "4px" }}
            required
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Location</label>
          <p style={{ padding: "10px", backgroundColor: "#2C2F36", border: "1px solid #555", borderRadius: "4px" }}>
            {isLoading ? "Updating location..." : bikerLocation ? `${bikerLocation[1]}, ${bikerLocation[0]}` : "Location not available"}
          </p>
        </div>
        <button
          type="submit"
          disabled={isLoading || !bikerLocation}
          style={{ padding: "10px 20px", background: isLoading || !bikerLocation ? "#666" : "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: isLoading || !bikerLocation ? "not-allowed" : "pointer" }}
        >
          Submit Issue
        </button>
      </form>
    </div>
  );
};

export default NewBookingPage;