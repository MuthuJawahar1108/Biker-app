
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

  const [mechanicId, setMechanicId] = useState(null);
  const [mechanic, setMechanic] = useState(null);
  const [isAvailable, setIsAvailable] = useState(true);

  const registerMechanic = async () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const response = await axios.post("http://localhost:5000/api/mechanics/register", {
          name: "John Mechanic",
          phone: "9876543210",
          longitude,
          latitude,
        });


        console.log(response.data)
        setMechanic(response.data.mechanic);
        setMechanicId(response.data.mechanic._id);
      } catch (error) {
        console.error("Error registering", error);
      }
    });
  };

  const updateAvailability = async () => {
    if (!mechanicId) return;
    try {
      const response = await axios.put(
        `http://localhost:5000/api/mechanics/update-availability/${mechanicId}`,
        { isAvailable: !isAvailable }
      );
      setIsAvailable(response.data.mechanic.isAvailable);
    } catch (error) {
      console.error("Error updating availability", error);
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const pendingResponse = await axios.get("http://localhost:5000/api/bookings/pending");
        const acceptedResponse = await axios.get("http://localhost:5000/api/bookings/biker/67d516900960c9c1dde5f169"); // Replace with actual biker ID

        setPendingBookings(pendingResponse.data);
        setAcceptedBookings(acceptedResponse.data);
      } catch (error) {
        console.error("Error fetching bookings", error);
      }
    };

    if (mechanicId) {
      fetchBookings();
    }
  }, [mechanicId]);

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
      await axios.post(`http://localhost:5000/api/mechanics/jobs/${jobId}/complete`);
      setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId)); // Remove from active list
    } catch (error) {
      console.error("Error completing job:", error);
    }
  };



  useEffect(() => {
    if (!mechanicId) return;
    
    // Fetch active jobs
    axios.get(`http://localhost:5000/api/mechanics/${mechanicId}/jobs`)
      .then(response => setJobs(response.data))
      .catch(error => console.error("Error fetching jobs:", error));

    // Fetch completed jobs
    axios.get(`http://localhost:5000/api/mechanics/${mechanicId}/completed-jobs`)
      .then(response => setCompletedJobs(response.data))
      .catch(error => console.error("Error fetching completed jobs:", error));
  }, [mechanicId]);


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
      <h1>Mechanic Dashboard</h1>
      
      {!mechanicId && (
        <button 
          onClick={registerMechanic}
          style={{
            padding: "10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginBottom: "20px"
          }}
        >
          Register as Mechanic
        </button>
      )}

      {mechanicId && (
        <button 
          onClick={updateAvailability}
          style={{
            padding: "10px",
            backgroundColor: isAvailable ? "#28a745" : "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginBottom: "20px"
          }}
        >
          Set {isAvailable ? "Busy" : "Available"}
        </button>
      )}
      <h2>Accepted Bookings</h2>
      {acceptedBookings.map((booking) => { 
        
        console.log("Booking Data:", booking); // Debugging
        return(
        
        <div key={booking._id} style={{ border: "1px solid #ddd", padding: "10px", margin: "10px 0" }}>
          <p><strong>Biker Location:</strong> {booking.bikerLocation.coordinates}</p>
          <p><strong>Issue:</strong> {booking.issue}</p>
          <button onClick={() => handleTrack(booking)} style={{ padding: "5px 10px", background: "blue", color: "white", border: "none" }}>
            Track Live
          </button>
        </div>
      )
      })}

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
          <p><strong>Biker Location:</strong> {booking.bikerLocation.coordinates}</p>
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
