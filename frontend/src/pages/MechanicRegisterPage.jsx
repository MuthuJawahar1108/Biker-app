import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MechanicRegisterPage = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {

        console.log({ name, phone, longitude, latitude })
      const response = await axios.post(
        "http://localhost:5000/api/mechanics/register",
        { name, phone, longitude, latitude },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Registration response:", response.data);
      navigate("/mechanic-dashboard");
    } catch (err) {
      setError("Registration failed: " + err.response?.data.message || err.message);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>Register as Mechanic</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleRegister}>
        <div>
          <label>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Phone</label>
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>
        <div>
          <label>Longitude</label>
          <input type="number" value={longitude} onChange={(e) => setLongitude(e.target.value)} required />
        </div>
        <div>
          <label>Latitude</label>
          <input type="number" value={latitude} onChange={(e) => setLatitude(e.target.value)} required />
        </div>
        <button type="submit" style={{ padding: "10px", background: "#007bff", color: "white" }}>Register</button>
      </form>
    </div>
  );
};

export default MechanicRegisterPage;