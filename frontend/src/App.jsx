import React from "react";
import { Routes, Route } from "react-router-dom";
import MapPage from "./pages/MapPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<h1>Home Page</h1>} />
      <Route path="/map" element={<MapPage />} />
    </Routes>
  );
};

export default App;
