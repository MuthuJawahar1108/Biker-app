
// import React, { useState, useEffect } from "react";
// import { Route, Routes, Navigate } from "react-router-dom";
// import { MechanicProvider } from "./context/MechanicContext";
// import MapPage from "./pages/MapPage";
// import MechanicDashboard from "./pages/MechanicDashboard";
// import LoginPage from "./pages/LoginPage";
// import RegisterPage from "./pages/RegisterPage";
// import NotFound from "./pages/NotFound";
// import AdminDashboard from "./pages/AdminDashboard";
// import NewBookingPage from "./pages/NewBookingPage";
// import MyBookingsPage from "./pages/MyBookingsPage";
// // import RateMechanicPage from "./pages/RateMechanicPage";


// const App = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
//   const role = localStorage.getItem("role");

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     setIsAuthenticated(!!token);
//   }, []);

//   const ProtectedRoute = ({ children, allowedRoles }) => {
//     if (!isAuthenticated) return <Navigate to="/login" />;
//     if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/unauthorized" />;
//     return children;
//   };

//   return (
//     <MechanicProvider>
//       <Routes>

//         <Route path="/" element={<h1>Home Page</h1>} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/register" element={<RegisterPage />} />
//         <Route
//           path="/map"
//           element={
//             <ProtectedRoute allowedRoles={["biker"]}>
//               <MapPage />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/new-booking"
//           element={
//             <ProtectedRoute allowedRoles={["biker"]}>
//               <NewBookingPage />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/my-bookings"
//           element={
//             <ProtectedRoute allowedRoles={["biker"]}>
//               <MyBookingsPage />
//             </ProtectedRoute>
//           }
//         />
//         {/* <Route
//           path="/rate-mechanic/:bookingId"
//           element={
//             <ProtectedRoute allowedRoles={["biker"]}>
//               <RateMechanicPage />
//             </ProtectedRoute>
//           }
//         /> */}
//         <Route
//           path="/mechanic-dashboard"
//           element={
//             <ProtectedRoute allowedRoles={["mechanic"]}>
//               <MechanicDashboard />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/admin-dashboard"
//           element={
//             <ProtectedRoute allowedRoles={["admin"]}>
//               <AdminDashboard />
//             </ProtectedRoute>
//           }
//         />
//         <Route path="/unauthorized" element={<h1>Unauthorized Access</h1>} />
//         <Route path="/" element={<Navigate to="/login" />} />
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//     </MechanicProvider>
//   );
// };

// export default App;




import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { MechanicProvider } from "./context/MechanicContext";
import MapPage from "./pages/MapPage";
import MechanicDashboard from "./pages/MechanicDashboard";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import NewBookingPage from "./pages/NewBookingPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import MechanicRegisterPage from "./pages/MechanicRegisterPage";
import BikerTrackingPage from "./pages/BikerTrackingPage";
import AcceptBookingPage from "./pages/AcceptBookingPage";
import SetLocationPage from "./pages/SetLocationPage";
// import RateMechanicPage from "./pages/RateMechanicPage";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  let role = localStorage.getItem("role");
  const location = useLocation();
  let token; 


  useEffect(() => {
    token = localStorage.getItem("token");

    console.log("Role:", role); // Debug log
    setIsAuthenticated(!!token);
    if (token && location.pathname === "/login") {
      // Redirect to dashboard after login
      window.location.href = role === "mechanic" ? "/mechanic-dashboard" : "/my-bookings";
    }
  }, [token, location]);

  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!isAuthenticated) return <Navigate to="/login" />;

    console.log("role: ", role, "allowedroles: ",allowedRoles);
    if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/unauthorized" />;
    console.log("Children:", children); // Debug log
    return children;
  };

  return (
    <MechanicProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register-mechanic" element={<ProtectedRoute allowedRoles={["admin"]}><MechanicRegisterPage /></ProtectedRoute>} /> {/* Mechanic registration */}
        <Route path="/map" element={<ProtectedRoute allowedRoles={["biker"]}><MapPage /></ProtectedRoute>} />
        <Route path="/new-booking" element={<ProtectedRoute allowedRoles={["biker"]}><NewBookingPage /></ProtectedRoute>} />
        <Route path="/my-bookings" element={<ProtectedRoute allowedRoles={["biker"]}><MyBookingsPage /></ProtectedRoute>} />
        <Route path="/tracking/:bookingId" element={<BikerTrackingPage />} />
        {/* <Route path="/rate-mechanic/:bookingId" element={<ProtectedRoute allowedRoles={["biker"]}><RateMechanicPage /></ProtectedRoute>} /> */}
        <Route path="/mechanic-dashboard" element={<ProtectedRoute allowedRoles={["mechanic"]}><MechanicDashboard /></ProtectedRoute>} />
        <Route path="/accept-booking/:bookingId" element={<AcceptBookingPage />} />

        <Route path="/set-location/:userType" element={<SetLocationPage />} />

        <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/unauthorized" element={<h1>Unauthorized Access</h1>} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MechanicProvider>
  );
};

export default App;