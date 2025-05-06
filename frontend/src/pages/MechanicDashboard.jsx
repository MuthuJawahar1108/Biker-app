


import React, { useState, useEffect} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import L from "leaflet"; // Import Leaflet for distance calculation




const socket = io("http://localhost:5000"); // Connect to WebSocket server

const MechanicDashboard = () => {
  const [pendingBookings, setPendingBookings] = useState([]);
  const [activeJobs, setActiveJobs] = useState([]);
  const [isAvailable, setIsAvailable] = useState(false);
  const [error, setError] = useState("");
  const [mechanicLocation, setMechanicLocation] = useState(null); // Store mechanic's location
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null); // New state for notifications
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId"); // Use userId from localStorage


  // Fetch mechanic location on mount and when returning from SetLocationPage
  useEffect(() => {
    let isMounted = true;

    const fetchMechanicLocation = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/mechanics/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (isMounted && response.data.location && response.data.location.coordinates) {
          setMechanicLocation([
            response.data.location.coordinates[0], // latitude
            response.data.location.coordinates[1], // longitude
          ]);
        } else {
          setError("No location set. Please set your location.");
          setMechanicLocation([0, 0]);
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to fetch location: " + err.message);
          setMechanicLocation([0, 0]);
        }
      }
    };

    fetchMechanicLocation();

    return () => {
      isMounted = false;
    };
  }, [token, userId, location]); // Depend on `location` to re-fetch when returning from SetLocationPage

  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates after unmount
  
    // Join mechanic room and handle connection
    const joinRoom = () => {
      socket.emit("join", "mechanic", () => {
        if (isMounted) console.log("Mechanic joined 'mechanic' room, socket ID:", socket.id);
      });
    };
  
    // Handle connection events
    const handleConnect = () => {
      console.log("Mechanic connected, socket ID:", socket.id);
      joinRoom();
    };
  
    const handleDisconnect = () => {
      if (isMounted) console.log("Mechanic disconnected, socket ID:", socket.id);
    };
  
    const handleReconnect = () => {
      console.log("Mechanic reconnected, socket ID:", socket.id);
      joinRoom();
    };


    // Fetch initial data
    const fetchData = async () => {

      if (!mechanicLocation) return; // Wait for mechanicLocation to be set
      setLoading(true);
      try {
        const [bookingsResponse, jobsResponse, availabilityResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/bookings/pending", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:5000/api/mechanics/jobs", { headers: { Authorization: `Bearer ${token}` } }), // Updated endpoint
          axios.get(`http://localhost:5000/api/mechanics/${localStorage.getItem("userId")}`, { headers: { Authorization: `Bearer ${token}` } }), // Updated endpoint
        ]);
        if (isMounted) {

          console.log("isMounted:", isMounted); // Debugging line

          const updatedBookings = bookingsResponse.data.map((booking) => {
            if (mechanicLocation && booking.bikerLocation) {
              const bikerLatLng = L.latLng(booking.bikerLocation.coordinates[0], booking.bikerLocation.coordinates[1]); // [lng, lat] to [lat, lng]
              const mechanicLatLng = L.latLng(mechanicLocation[0], mechanicLocation[1]);


              // console.log("Mechanic Location:", mechanicLocation);
              // console.log("Biker LatLng:", bikerLatLng);

              const distance = mechanicLatLng.distanceTo(bikerLatLng) / 1000; // Convert meters to kilometers
              const travelTime = (distance / 15) * 60; // Assume 15 km/h, convert to minutes
              return { ...booking, distance: distance.toFixed(2), travelTime: Math.round(travelTime) };
            }
            return { ...booking, distance: "N/A", travelTime: "N/A" };
          });


          setPendingBookings(updatedBookings);
          setActiveJobs(jobsResponse.data);
          setIsAvailable(availabilityResponse.data.isAvailable);
          setError("");


          // setPendingBookings(bookingsResponse.data);
          // setActiveJobs(jobsResponse.data);
          // setIsAvailable(availabilityResponse.data.isAvailable);
          // setError("");
        }
      } catch (err) {
        if (isMounted) setError("Error fetching data: " + err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };


    
    
    
  
    fetchData();
    joinRoom();

  // Listen for new bookings with notification
  socket.on("newBooking", (data) => {
    if (isMounted) {
      console.log("Received new booking:", data);
      console.log("Mechanic Location:", mechanicLocation);
      const bikerLatLng = L.latLng(data.bikerLocation.coordinates[0], data.bikerLocation.coordinates[1]);
      const distance = mechanicLocation
        ? (L.latLng(mechanicLocation[0], mechanicLocation[1]).distanceTo(bikerLatLng) / 1000).toFixed(2)
        : "N/A";
      const travelTime = mechanicLocation ? Math.round((distance / 15) * 60) : "N/A";
      setPendingBookings((prev) => {
        const exists = prev.some((b) => b._id === data.bookingId);
        if (!exists) {
          setNotification({ message: `New booking from ${data.bikerName}: ${data.issue}`, id: Date.now() });
          return [...prev, { ...data, createdAt: new Date(), distance, travelTime }];
        }
        return prev;
      });
      setTimeout(() => {
        if (isMounted && notification?.id === Date.now() - 5000) setNotification(null);
      }, 5000);
    }
  });


  


    // Set up event listeners
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("reconnect", handleReconnect);
  
    // Cleanup
    return () => {
      isMounted = false;
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("reconnect", handleReconnect);
      socket.off("newBooking");
    };
  }, [token, mechanicLocation]);

  // useEffect(() => {
    
  //   // Track mechanic location
  //   if (navigator.geolocation) {
  //     const watchId = navigator.geolocation.watchPosition(
  //       (position) => {
  //         const { latitude, longitude } = position.coords;
  //           setMechanicLocation([latitude, longitude]);
  //           socket.emit("mechanicLocation", { latitude, longitude, mechanicId: userId });
  //       },
  //       (err) => console.error("Geolocation error:", err),
  //       { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
  //     );
      
  //     socket.on("requestLocation", () => {
  //       console.log("Fetching data...");
  //       navigator.geolocation.getCurrentPosition((position) => {
  //         const { latitude, longitude } = position.coords;
  //         socket.emit("mechanicLocation", { latitude, longitude, mechanicId: userId });
  //       });
  //     });

  //     return () => {
  //       // isMounted = false;
  //       navigator.geolocation.clearWatch(watchId);
  //       socket.off("requestLocation");
  //     };
  //   }

  // }, [userId]);


  const handleSetLocation = () => {
    navigate("/set-location/mechanic");
  };

  const handleAcceptBooking = async (bookingId) => {
    try {
      // Lock the booking for analysis by this mechanic
      await axios.post(
        `http://localhost:5000/api/bookings/${bookingId}/lock`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Redirect to the AcceptBookingPage for route visualization and final decision
      navigate(`/accept-booking/${bookingId}`);
    } catch (err) {
      setError("Failed to lock booking for analysis: " + err.message);
    }
  };

  const handleToggleAvailability = async () => {
    try {
      await axios.put(
        "http://localhost:5000/api/mechanics/update-availability",
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
        `http://localhost:5000/api/jobs/${jobId}/complete`, // Corrected endpoint
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const fetchData = async () => {
        const jobsResponse = await axios.get("http://localhost:5000/api/jobs", {
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

      {notification && (
        <div
          style={{
            backgroundColor: "#28a745",
            color: "white",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "4px",
          }}
        >
          {notification.message}
        </div>
      )}

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
        <button onClick={handleSetLocation} style={{ padding: "5px 10px", background: "#007bff", color: "white", marginLeft: "10px" }}>
          Set Location
        </button>
      </div>
      <h3>Pending Bookings</h3>
      {pendingBookings.length === 0 ? (
        <p>No pending bookings</p>
      ) : (
        <ul>
          {pendingBookings.map((booking) => (
            <li key={booking._id || booking.bookingId} style={{ marginBottom: "10px" }}>
              {booking.bikerName} - {booking.issue} - Created: {new Date(booking.createdAt || Date.now()).toLocaleString()}
              <br />
              Distance: {booking.distance} km | Est. Time: {booking.travelTime} min
              <button
                onClick={() => handleAcceptBooking(booking._id || booking.bookingId)}
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




