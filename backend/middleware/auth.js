const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};



const authorizeRole = (role) => {
  return (req, res, next) => {
    try {

      // Extract token from Authorization header
      const authHeader = req.headers.authorization;


      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token provided or invalid format" });
      }

      const token = authHeader.split(" ")[1]; // Extract the token part

      console.log("Extracted Token:", token); // Debugging line

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded) {
        return res.status(401).json({ error: "Invalid token" });
      }

      // Check role
      if (decoded.role !== role) {
        return res.status(403).json({ error: "Unauthorized: Role mismatch" });
      }

      // Set req.user for downstream use
      req.user = decoded;
      next();
    } catch (error) {
      console.error("Authentication error:", error.message);
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token expired" });
      }
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ error: "Invalid token" });
      }
      res.status(500).json({ error: "Server error during authentication", details: error.message });
    }
  };
};


// const authorizeRole = (role) => {
//   return (req, res, next) => {
//     const token = req.headers.authorization?.split(" ")[1];
//     if (!token) return res.status(401).json({ error: "No token provided" });
//     try {
//       const decoded = jwtDecode(token);
//       console.log("Decoded token:", decoded);
//       if (decoded.role !== role) return res.status(403).json({ error: "Unauthorized role" });
//       req.user = decoded;
//       next();
//     } catch (error) {
//       console.error("Token decoding error:", error);
//       res.status(401).json({ error: "Invalid token" });
//     }
//   };
// };


module.exports = { authMiddleware, authorizeRole };