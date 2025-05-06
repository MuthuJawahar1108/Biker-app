



import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [bikerLocation, setBikerLocation] = useState(null);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const location = useLocation();
  


  const handleSetLocation = () => {
    navigate("/set-location/biker");
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [bookingsResponse, userResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/bookings", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`http://localhost:5000/api/auth/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setBookings(bookingsResponse.data);
        if (userResponse.data.location && userResponse.data.location.coordinates) {
          setBikerLocation([
            userResponse.data.location.coordinates[0], // latitude
            userResponse.data.location.coordinates[1], // longitude
          ]);
        }
        setLoading(false);
      } catch (err) {
        setError("Error fetching bookings: " + err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) return <div style={{ padding: "20px", color: "#FFF", backgroundColor: "#1C2526" }}>Loading bookings...</div>;
  if (error) return <div style={{ padding: "20px", color: "red", backgroundColor: "#1C2526" }}>{error}</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto", backgroundColor: "#1C2526", color: "#FFF" }}>
      <h2 style={{ marginBottom: "20px" }}>Dashboard</h2>
      <Link
        to="/new-booking"
        style={{
          padding: "10px",
          background: "#007bff",
          color: "white",
          textDecoration: "none",
          marginBottom: "20px",
          display: "inline-block",
          borderRadius: "4px",
        }}
      >
        Report Issue
      </Link>
      <button type="button" onClick={handleSetLocation} style={{ padding: "10px", background: "#007bff", color: "white", marginBottom: "10px" }}>
          Set Location
        </button>

        {bikerLocation && (
        <p style={{ marginBottom: "20px" }}>
          Your Location: Latitude: {bikerLocation[0]}, Longitude: {bikerLocation[1]}
        </p>
      )}
      <h3 style={{ marginBottom: "10px" }}>My Bookings</h3>
      {bookings.length === 0 && !error && <p>No bookings found.</p>}
      <ul>
        {bookings.map((booking) => (
          <li key={booking._id} style={{ marginBottom: "15px", padding: "10px", backgroundColor: "#2C2F36", borderRadius: "4px" }}>
            <strong>Issue:</strong> {booking.issue} <br />
            <strong>Status:</strong> {booking.status} <br />
            <strong>Created:</strong> {new Date(booking.createdAt).toLocaleString()} <br />

            {booking.bikerLocation && booking.bikerLocation.coordinates && (
              <p>
                Booking Location: Latitude: {booking.bikerLocation.coordinates[1]}, Longitude: {booking.bikerLocation.coordinates[0]}
              </p>
            )}
            {booking.status === "Accepted" && (
              <Link
                to={`/tracking/${booking._id}`}
                style={{ marginLeft: "10px", color: "#17a2b8", textDecoration: "underline" }}
              >
                Track Mechanic
              </Link>
            )}
            {/* {booking.status === "Completed" && (
              <Link
                to={`/rate-mechanic/${booking._id}`}
                style={{ marginLeft: "10px", color: "#17a2b8", textDecoration: "underline" }}
              >
                Rate Mechanic
              </Link>
            )} */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyBookingsPage;


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate, useLocation } from "react-router-dom";
// import { Link } from "react-router-dom";

// const MyBookingsPage = () => {
//   const [bookings, setBookings] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [bikerLocation, setBikerLocation] = useState(null);
//   const token = localStorage.getItem("token");
//   const userId = localStorage.getItem("userId");
//   const navigate = useNavigate();
//   const location = useLocation();

//   const fetchBookings = async () => {
//     setLoading(true);
//     try {
//       const [bookingsResponse, userResponse] = await Promise.all([
//         axios.get("http://localhost:5000/api/bookings", { headers: { Authorization: `Bearer ${token}` } }),
//         axios.get(`http://localhost:5000/api/auth/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
//       ]);

//       console.log("Boking Response: ", bookingsResponse)
//       console.log("userResponse: ", userResponse)
//       setBookings(bookingsResponse.data);
//       if (userResponse.data.location && userResponse.data.location.coordinates) {
//         setBikerLocation([
//           userResponse.data.location.coordinates[0], // latitude
//           userResponse.data.location.coordinates[1], // longitude
//         ]);
//       }
//       setLoading(false);
//     } catch (err) {
//       setError("Error fetching bookings: " + err.message);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBookings();
//   }, [token, userId, location]); // Re-fetch when returning from SetLocationPage

//   const handleSetLocation = () => {
//     navigate("/set-location/biker");
//   };

//   if (loading) return <div style={{ padding: "20px", color: "#FFF", backgroundColor: "#1C2526" }}>Loading bookings...</div>;
//   if (error) return <div style={{ padding: "20px", color: "red", backgroundColor: "#1C2526" }}>{error}</div>;

//   return (
//     <div style={{ padding: "20px", maxWidth: "800px", margin: "auto", backgroundColor: "#1C2526", color: "#FFF" }}>
//       <h2 style={{ marginBottom: "20px" }}>Dashboard</h2>
//       <Link
//         to="/new-booking"
//         style={{
//           padding: "10px",
//           background: "#007bff",
//           color: "white",
//           textDecoration: "none",
//           marginBottom: "20px",
//           display: "inline-block",
//           borderRadius: "4px",
//         }}
//       >
//         Report Issue
//       </Link>
//       <button type="button" onClick={handleSetLocation} style={{ padding: "10px", background: "#007bff", color: "white", marginBottom: "10px" }}>
//         Set Location
//       </button>
//       {bikerLocation && (
//         <p style={{ marginBottom: "20px" }}>
//           Your Location: Latitude: {bikerLocation[0]}, Longitude: {bikerLocation[1]}
//         </p>
//       )}
//       <h3 style={{ marginBottom: "10px" }}>My Bookings</h3>
//       {bookings.length === 0 && !error && <p>No bookings found.</p>}
//       <ul>
//         {bookings.map((booking) => (
//           <li key={booking._id} style={{ marginBottom: "15px", padding: "10px", backgroundColor: "#2C2F36", borderRadius: "4px" }}>
//             <strong>Issue:</strong> {booking.issue} <br />
//             <strong>Status:</strong> {booking.status} <br />
//             <strong>Created:</strong> {new Date(booking.createdAt).toLocaleString()} <br />
//             {booking.bikerLocation && booking.bikerLocation.coordinates && (
//               <p>
//                 Booking Location: Latitude: {booking.bikerLocation.coordinates[1]}, Longitude: {booking.bikerLocation.coordinates[0]}
//               </p>
//             )}
//             {booking.status === "Accepted" && (
//               <Link
//                 to={`/tracking/${booking._id}`}
//                 style={{ marginLeft: "10px", color: "#17a2b8", textDecoration: "underline" }}
//               >
//                 Track Mechanic
//               </Link>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default MyBookingsPage;
