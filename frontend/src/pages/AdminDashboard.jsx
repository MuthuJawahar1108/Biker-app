import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/api/admin/bookings", { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => setBookings(response.data))
      .catch((err) => setError("Error fetching bookings: " + err.message));

    axios
      .get("http://localhost:5000/api/admin/mechanics", { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => setMechanics(response.data))
      .catch((err) => setError("Error fetching mechanics: " + err.message));
  }, []);

  const suspendMechanic = async (mechanicId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(`http://localhost:5000/api/admin/mechanics/${mechanicId}/suspend`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setMechanics(mechanics.map((m) => (m._id === mechanicId ? { ...m, isAvailable: false } : m)));
    } catch (err) {
      setError("Error suspending mechanic: " + err.message);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h1>Admin Dashboard</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <h2>Bookings</h2>
      <ul>
        {bookings.map((booking) => (
          <li key={booking._id}>{booking.bikerName} - {booking.status}</li>
        ))}
      </ul>
      <h2>Mechanics</h2>
      <ul>
        {mechanics.map((mechanic) => (
          <li key={mechanic._id}>
            {mechanic.name} - {mechanic.isAvailable ? "Available" : "Suspended"}
            {!mechanic.isAvailable && <button onClick={() => suspendMechanic(mechanic._id)}>Suspend</button>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;