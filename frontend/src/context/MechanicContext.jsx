import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const MechanicContext = createContext();

export const MechanicProvider = ({ children }) => {
  const [mechanics, setMechanics] = useState([]);
  const [bikerLocation, setBikerLocation] = useState(null);

  // Fetch nearby mechanics when biker's location is set
  useEffect(() => {
    if (bikerLocation) {
      fetchNearbyMechanics();
    }
  }, [bikerLocation]);

  const fetchNearbyMechanics = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/mechanics/nearby?longitude=${bikerLocation[1]}&latitude=${bikerLocation[0]}`
      );
      setMechanics(response.data);
    } catch (error) {
      console.error("Error fetching mechanics", error);
    }
  };

  return (
    <MechanicContext.Provider value={{ mechanics, setBikerLocation }}>
      {children}
    </MechanicContext.Provider>
  );
};
