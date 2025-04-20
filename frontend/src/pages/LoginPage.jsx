

// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const LoginPage = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     console.log("Login attempt with", { email, password }); // Debug
//     try {
//       const response = await axios.post("http://localhost:5000/api/auth/login", { email, password });
//       console.log("Response:", response.data); // Debug response
//       localStorage.setItem("token", response.data.token);
//       localStorage.setItem("role", response.data.role || "biker");
//       const redirectPath = response.data.role === "mechanic" ? "/mechanic-dashboard" : "/map";
//       navigate(redirectPath);
//     } catch (err) {
//       console.error("Login error:", err.response?.data || err); // Detailed error
//       setError("Login failed: " + err.response?.data.message || err.message);
//     }
//   };

//   return (
//     <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
//       <h2>Login</h2>
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       <form onSubmit={handleLogin}>
//         <div>
//           <label>Email</label>
//           <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
//         </div>
//         <div>
//           <label>Password</label>
//           <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
//         </div>
//         <button
//           type="submit"
//           style={{ padding: "10px", background: "#007bff", color: "white" }}
//           onClick={() => console.log("Button clicked")} // Debug button
//         >
//           Login
//         </button>
//       </form>
//     </div>
//   );
// };

// export default LoginPage;

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login attempt with", { email, password }); // Debug login attempt
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      console.log("Response:", response.data); // Debug response
      const { token, userId, name, role } = response.data;

      // Validate and store data
      if (!token) throw new Error("No token received");
      if (!userId) throw new Error("No userId received");
      if (!name) throw new Error("No name received");
      if (!role) throw new Error("No role received");

      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("userName", name);
      localStorage.setItem("role", role);

      // Dynamic redirect based on role
      const redirectPath = role === "mechanic" ? "/mechanic-dashboard" : "/my-bookings";
      navigate(redirectPath);
    } catch (err) {
      console.error("Login error:", err.response?.data || err); // Detailed error
      setError("Login failed: " + err.response?.data.message || err.message);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" style={{ padding: "10px", background: "#007bff", color: "white" }}>Login</button>
      </form>
    </div>
  );
};

export default LoginPage;