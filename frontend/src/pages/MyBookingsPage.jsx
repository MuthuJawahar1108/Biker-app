// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate, Link } from "react-router-dom";

// const MyBookingsPage = () => {
//   const [bookings, setBookings] = useState([]);
//   const [error, setError] = useState("");
//   const token = localStorage.getItem("token");
//   const bikerId = localStorage.getItem("userId"); // Assume stored after login

//   useEffect(() => {
//     axios
//       .get(`http://localhost:5000/api/bookings`, { headers: { Authorization: `Bearer ${token}` } })
//       .then((response) => setBookings(response.data))
//       .catch((err) => setError("Error fetching bookings: " + err.message));
//   }, [token]);

//   return (
//     <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
//       <h2>My Bookings</h2>
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       <ul>
//         {bookings.map((booking) => (
//           <li key={booking._id}>
//             {booking.issue} - Status: {booking.status} - Created: {new Date(booking.createdAt).toLocaleString()}
//             {booking.status === "Accepted" && (
//               <Link
//                 to={`/map?bookingId=${booking._id}`}
//                 style={{ marginLeft: "10px", color: "#007bff", textDecoration: "underline" }}
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




import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/bookings", { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => setBookings(response.data))
      .catch((err) => setError("Error fetching bookings: " + err.message));
  }, [token]);

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h2>Dashboard</h2>
      <Link to="/new-booking" style={{ padding: "10px", background: "#007bff", color: "white", textDecoration: "none", marginBottom: "20px", display: "inline-block" }}>
        Report Issue
      </Link>
      <h3>My Bookings</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {bookings.map((booking) => (
          <li key={booking._id} style={{ marginBottom: "10px" }}>
            <strong>Issue:</strong> {booking.issue} <br />
            <strong>Status:</strong> {booking.status} <br />
            <strong>Created:</strong> {new Date(booking.createdAt).toLocaleString()} <br />
            {booking.status === "Accepted" && (
              <Link to={`/map?bookingId=${booking._id}`} style={{ marginLeft: "10px", color: "#007bff", textDecoration: "underline" }}>
                Track Mechanic
              </Link>
            )}
            {booking.status === "Completed" && (
              <Link to={`/rate-mechanic/${booking._id}`} style={{ marginLeft: "10px", color: "#007bff", textDecoration: "underline" }}>
                Rate Mechanic
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyBookingsPage;