// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const RegisterPage = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("biker");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post("http://localhost:5000/api/auth/register", { name, email, password, role });
//       navigate("/login");
//     } catch (err) {
//       setError("Registration failed: " + err.response?.data.message || err.message);
//     }
//   };

//   return (
//     <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
//       <h2>Register</h2>
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       <form onSubmit={handleRegister}>
//         <div>
//           <label>Name</label>
//           <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
//         </div>
//         <div>
//           <label>Email</label>
//           <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
//         </div>
//         <div>
//           <label>Password</label>
//           <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
//         </div>
//         <div>
//           <label>Role</label>
//           <select value={role} onChange={(e) => setRole(e.target.value)}>
//             <option value="biker">Biker</option>
//             <option value="mechanic">Mechanic</option>
//             <option value="admin">Admin</option>
//           </select>
//         </div>
//         <button type="submit" style={{ padding: "10px", background: "#007bff", color: "white" }}>Register</button>
//       </form>
//     </div>
//   );
// };

// export default RegisterPage;




import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("biker");
  const [phone, setPhone] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // For mechanic registration (admin)

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (role === "mechanic") {
        // Validate mechanic-specific fields
        if (!phone || !longitude || !latitude) {
          throw new Error("Phone, longitude, and latitude are required for mechanics");
        }
        if (isNaN(longitude) || isNaN(latitude)) {
          throw new Error("Invalid coordinates");
        }

        // Step 1: Register user
        response = await axios.post("http://localhost:5000/api/auth/register", { name, email, password, role });
        const userId = response.data.userId;

        // Step 2: Register mechanic (requires admin token)
        await axios.post(
          "http://localhost:5000/api/mechanics/register",
          { name, phone, longitude, latitude, userId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Register normal user (biker or admin)
        response = await axios.post("http://localhost:5000/api/auth/register", { name, email, password, role });
      }

      console.log("Registration response:", response.data);
      navigate("/login");
    } catch (err) {
      setError("Registration failed: " + err.response?.data.message || err.message);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>Register</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleRegister}>
        <div>
          <label>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div>
          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="biker">Biker</option>
            <option value="mechanic">Mechanic</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        {role === "mechanic" && (
          <>
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
          </>
        )}
        <button type="submit" style={{ padding: "10px", background: "#007bff", color: "white" }}>Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;