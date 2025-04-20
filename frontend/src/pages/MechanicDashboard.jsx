


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const MechanicDashboard = () => {
//   const [pendingBookings, setPendingBookings] = useState([]);
//   const [activeJobs, setActiveJobs] = useState([]);
//   const [isAvailable, setIsAvailable] = useState(false);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");
//   const mechanicId = localStorage.getItem("userId"); // Assuming set during mechanic login

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const [bookingsResponse, jobsResponse, availabilityResponse] = await Promise.all([
//           axios.get("http://localhost:5000/api/bookings/pending", { headers: { Authorization: `Bearer ${token}` } }),
//           axios.get(`http://localhost:5000/api/mechanics/${mechanicId}/jobs`, { headers: { Authorization: `Bearer ${token}` } }),
//           axios.get(`http://localhost:5000/api/mechanics/${mechanicId}`, { headers: { Authorization: `Bearer ${token}` } }),
//         ]);
//         setPendingBookings(bookingsResponse.data);
//         setActiveJobs(jobsResponse.data);
//         setIsAvailable(availabilityResponse.data.isAvailable); // Matches new endpoint
//         setError("");
//       } catch (err) {
//         setError("Error fetching data: " + err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [mechanicId, token]);

//   const handleAcceptBooking = async (bookingId) => {
//     try {
//       await axios.post(
//         `http://localhost:5000/api/bookings/${bookingId}/accept`,
//         { mechanicId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       // Refresh data after acceptance
//       const fetchData = async () => {
//         const [bookingsResponse, jobsResponse] = await Promise.all([
//           axios.get("http://localhost:5000/api/bookings/pending", { headers: { Authorization: `Bearer ${token}` } }),
//           axios.get(`http://localhost:5000/api/mechanics/${mechanicId}/jobs`, { headers: { Authorization: `Bearer ${token}` } }),
//         ]);
//         setPendingBookings(bookingsResponse.data);
//         setActiveJobs(jobsResponse.data);
//       };
//       fetchData();
//     } catch (err) {
//       setError("Failed to accept booking: " + err.message);
//     }
//   };

//   const handleToggleAvailability = async () => {
//     try {
//       await axios.put(
//         `http://localhost:5000/api/mechanics/update-availability/${mechanicId}`,
//         { isAvailable: !isAvailable },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setIsAvailable(!isAvailable);
//     } catch (err) {
//       setError("Failed to update availability: " + err.message);
//     }
//   };

//   const handleCompleteJob = async (jobId) => {
//     try {
//       await axios.post(
//         `http://localhost:5000/api/mechanics/jobs/${jobId}/complete`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       // Refresh data after completion
//       const fetchData = async () => {
//         const jobsResponse = await axios.get(`http://localhost:5000/api/mechanics/${mechanicId}/jobs`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setActiveJobs(jobsResponse.data);
//       };
//       fetchData();
//     } catch (err) {
//       setError("Failed to complete job: " + err.message);
//     }
//   };

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div style={{ padding: "20px", maxWidth: "800px", margin: "auto", backgroundColor: "#1C2526", color: "#FFF" }}>
//       <h2>Mechanic Dashboard</h2>
//       {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
//       <div style={{ marginBottom: "20px" }}>
//         <label>Availability: </label>
//         <input
//           type="checkbox"
//           checked={isAvailable}
//           onChange={handleToggleAvailability}
//           style={{ marginRight: "10px" }}
//         />
//         <span>{isAvailable ? "Available" : "Not Available"}</span>
//       </div>
//       <h3>Pending Bookings</h3>
//       {pendingBookings.length === 0 ? (
//         <p>No pending bookings</p>
//       ) : (
//         <ul>
//           {pendingBookings.map((booking) => (
//             <li key={booking._id} style={{ marginBottom: "10px" }}>
//               {booking.bikerName} - {booking.issue} - {new Date(booking.createdAt).toLocaleString()}
//               <button
//                 onClick={() => handleAcceptBooking(booking._id)}
//                 style={{ padding: "5px 10px", background: "#007bff", color: "white", marginLeft: "10px" }}
//               >
//                 Accept
//               </button>
//             </li>
//           ))}
//         </ul>
//       )}
//       <h3>Active Jobs</h3>
//       {activeJobs.length === 0 ? (
//         <p>No active jobs</p>
//       ) : (
//         <ul>
//           {activeJobs.map((job) => (
//             <li key={job._id} style={{ marginBottom: "10px" }}>
//               {job.bikerName} - {job.issue} - Status: {job.status}
//               <button
//                 onClick={() => handleCompleteJob(job._id)}
//                 style={{ padding: "5px 10px", background: "#28a745", color: "white", marginLeft: "10px" }}
//               >
//                 Complete
//               </button>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default MechanicDashboard;



import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MechanicDashboard = () => {
  const [pendingBookings, setPendingBookings] = useState([]);
  const [activeJobs, setActiveJobs] = useState([]);
  const [isAvailable, setIsAvailable] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  // const mechanicId = localStorage.getItem("userId"); // No longer needed for these endpoints

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [bookingsResponse, jobsResponse, availabilityResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/bookings/pending", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:5000/api/mechanics/jobs", { headers: { Authorization: `Bearer ${token}` } }), // Updated endpoint
          axios.get(`http://localhost:5000/api/mechanics/${localStorage.getItem("userId")}`, { headers: { Authorization: `Bearer ${token}` } }), // Keep for initial fetch
        ]);
        setPendingBookings(bookingsResponse.data);
        setActiveJobs(jobsResponse.data);
        setIsAvailable(availabilityResponse.data.isAvailable); // Matches new endpoint
        setError("");
      } catch (err) {
        setError("Error fetching data: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]); // Removed mechanicId from dependency

  const handleAcceptBooking = async (bookingId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/bookings/${bookingId}/accept`,
        {}, // Removed mechanicId from body
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh data after acceptance
      const fetchData = async () => {
        const [bookingsResponse, jobsResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/bookings/pending", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:5000/api/mechanics/jobs", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setPendingBookings(bookingsResponse.data);
        setActiveJobs(jobsResponse.data);
      };
      fetchData();
    } catch (err) {
      setError("Failed to accept booking: " + err.message);
    }
  };

  const handleToggleAvailability = async () => {
    try {
      await axios.put(
        "http://localhost:5000/api/mechanics/update-availability", // Updated endpoint
        { isAvailable: !isAvailable },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsAvailable(!isAvailable);
    } catch (err) {
      setError("Failed to update availability: " + err.message);
    }
  };

  const handleCompleteJob = async (jobId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/mechanics/jobs/${jobId}/complete`, // Updated endpoint
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh data after completion
      const fetchData = async () => {
        const jobsResponse = await axios.get("http://localhost:5000/api/mechanics/jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setActiveJobs(jobsResponse.data);
      };
      fetchData();
    } catch (err) {
      setError("Failed to complete job: " + err.message);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto", backgroundColor: "#1C2526", color: "#FFF" }}>
      <h2>Mechanic Dashboard</h2>
      {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
      <div style={{ marginBottom: "20px" }}>
        <label>Availability: </label>
        <input
          type="checkbox"
          checked={isAvailable}
          onChange={handleToggleAvailability}
          style={{ marginRight: "10px" }}
        />
        <span>{isAvailable ? "Available" : "Not Available"}</span>
      </div>
      <h3>Pending Bookings</h3>
      {pendingBookings.length === 0 ? (
        <p>No pending bookings</p>
      ) : (
        <ul>
          {pendingBookings.map((booking) => (
            <li key={booking._id} style={{ marginBottom: "10px" }}>
              {booking.bikerName} - {booking.issue} - {new Date(booking.createdAt).toLocaleString()}
              <button
                onClick={() => handleAcceptBooking(booking._id)}
                style={{ padding: "5px 10px", background: "#007bff", color: "white", marginLeft: "10px" }}
              >
                Accept
              </button>
            </li>
          ))}
        </ul>
      )}
      <h3>Active Jobs</h3>
      {activeJobs.length === 0 ? (
        <p>No active jobs</p>
      ) : (
        <ul>
          {activeJobs.map((job) => (
            <li key={job._id} style={{ marginBottom: "10px" }}>
              {job.bikerName} - {job.issue} - Status: {job.status}
              <button
                onClick={() => handleCompleteJob(job._id)}
                style={{ padding: "5px 10px", background: "#28a745", color: "white", marginLeft: "10px" }}
              >
                Complete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MechanicDashboard;