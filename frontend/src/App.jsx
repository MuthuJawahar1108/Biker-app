import React from "react";
import {  Route, Routes } from "react-router-dom";
import { MechanicProvider } from "./context/MechanicContext";
import MapPage from "./pages/MapPage";
import MechanicDashboard from "./pages/MechanicDashboard";

const App = () => {
  return (
    <MechanicProvider>
        <Routes>
          <Route path="/" element={<h1>Home Page</h1>} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/mechanic-dashboard" element={<MechanicDashboard />} />
        </Routes>
    </MechanicProvider>
  );
};

export default App;
