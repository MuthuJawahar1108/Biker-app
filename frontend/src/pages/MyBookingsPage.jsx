


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";

// const MyBookingsPage = () => {
//   const [bookings, setBookings] = useState([]);
//   const [error, setError] = useState("");
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     axios
//       .get("http://localhost:5000/api/bookings", { headers: { Authorization: `Bearer ${token}` } })
//       .then((response) => setBookings(response.data))
//       .catch((err) => setError("Error fetching bookings: " + err.message));
//   }, [token]);

//   return (
//     <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
//       <h2>Dashboard</h2>
//       <Link to="/new-booking" style={{ padding: "10px", background: "#007bff", color: "white", textDecoration: "none", marginBottom: "20px", display: "inline-block" }}>
//         Report Issue
//       </Link>
//       <h3>My Bookings</h3>
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       <ul>
//         {bookings.map((booking) => (
//           <li key={booking._id} style={{ marginBottom: "10px" }}>
//             <strong>Issue:</strong> {booking.issue} <br />
//             <strong>Status:</strong> {booking.status} <br />
//             <strong>Created:</strong> {new Date(booking.createdAt).toLocaleString()} <br />
//             {booking.status === "Accepted" && (
//               <Link to={`/map?bookingId=${booking._id}`} style={{ marginLeft: "10px", color: "#007bff", textDecoration: "underline" }}>
//                 Track Mechanic
//               </Link>
//             )}
//             {booking.status === "Completed" && (
//               <Link to={`/rate-mechanic/${booking._id}`} style={{ marginLeft: "10px", color: "#007bff", textDecoration: "underline" }}>
//                 Rate Mechanic
//               </Link>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default MyBookingsPage;




import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/bookings", { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        setBookings(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching bookings: " + err.message);
        setLoading(false);
      });
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
      <h3 style={{ marginBottom: "10px" }}>My Bookings</h3>
      {bookings.length === 0 && !error && <p>No bookings found.</p>}
      <ul>
        {bookings.map((booking) => (
          <li key={booking._id} style={{ marginBottom: "15px", padding: "10px", backgroundColor: "#2C2F36", borderRadius: "4px" }}>
            <strong>Issue:</strong> {booking.issue} <br />
            <strong>Status:</strong> {booking.status} <br />
            <strong>Created:</strong> {new Date(booking.createdAt).toLocaleString()} <br />
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