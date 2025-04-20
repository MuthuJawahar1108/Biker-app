// import React, { createContext, useState, useEffect } from "react";
// import axios from "axios";

// export const MechanicContext = createContext();

// export const MechanicProvider = ({ children }) => {

//   const [mechanics, setMechanics] = useState([]);
//   const [bikerLocation, setBikerLocation] = useState(null);
  
//   // Fetch nearby mechanics when biker's location is set
//   useEffect(() => {
//     if (bikerLocation) {
//       console.log("MechanicProvider rendered");
//       fetchNearbyMechanics();
//     }
//   }, [bikerLocation]);

//   const fetchNearbyMechanics = async () => {
//     try {
//       const response = await axios.get(
//         `http://localhost:5000/api/mechanics/nearby?longitude=${bikerLocation[0]}&latitude=${bikerLocation[1]}`
//       );
//       setMechanics(response.data);
//     } catch (error) {
//       console.error("Error fetching mechanics", error);
//     }
//   };

//   return (
//     <MechanicContext.Provider value={{ mechanics, setBikerLocation }}>
//       {children}
//     </MechanicContext.Provider>
//   );
// };


import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const MechanicContext = createContext();

export const MechanicProvider = ({ children }) => {
  const [mechanics, setMechanics] = useState([]);
  const [bikerLocation, setBikerLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Start loading until location is fetched
  const [error, setError] = useState(null);

  // Fetch and update location periodically
  useEffect(() => {
    let locationInterval;
    const fetchLocation = () => {
      if ("geolocation" in navigator) {
        setIsLoading(true);
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const newLocation = [position.coords.longitude, position.coords.latitude];
            setBikerLocation(newLocation);
            setError(null); // Clear error on success
            setIsLoading(false);
          },
          (err) => {
            setError("Geolocation error: " + err.message);
            setIsLoading(false);
          }
        );
      } else {
        setError("Geolocation is not supported by this browser");
        setIsLoading(false);
      }
    };

    fetchLocation(); // Initial fetch
    locationInterval = setInterval(fetchLocation, 5000); // Update every 5 seconds

    return () => clearInterval(locationInterval); // Cleanup interval
  }, []);

  // Fetch nearby mechanics when bikerLocation changes
  useEffect(() => {
    if (bikerLocation) {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      axios
        .get(`http://localhost:5000/api/mechanics/nearby?longitude=${bikerLocation[0]}&latitude=${bikerLocation[1]}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setMechanics(response.data);
          setError(null); // Clear error on success
        })
        .catch((error) => setError("Error fetching mechanics: " + error.message))
        .finally(() => setIsLoading(false));
    }
  }, [bikerLocation]);

  // Function to manually update location (e.g., from NewBookingPage)
  const updateLocation = (newLocation) => {
    if (Array.isArray(newLocation) && newLocation.length === 2 && newLocation.every(Number.isFinite)) {
      setBikerLocation(newLocation);
      setError(null); // Clear error on manual update
    } else {
      setError("Invalid location format");
    }
  };

  return (
    <MechanicContext.Provider value={{ mechanics, bikerLocation, isLoading, error, updateLocation }}>
      {children}
    </MechanicContext.Provider>
  );
};