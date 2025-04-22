// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const mapRoutes = require("./routes/mapRoutes");
// const mechanicRoutes = require("./routes/mechanicRoutes");
// const bookingRoutes = require("./routes/bookingRoutes");
// const authRoutes = require("./routes/authRoutes");
// const adminRoutes = require("./routes/adminRoutes");
// const Booking = require("./models/Booking");



// require('dotenv').config()


// console.log("MONGO_URI:", process.env.MONGO_URI); // Debugging line


// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use("/api/map", mapRoutes);
// app.use("/api/mechanics", mechanicRoutes);
// app.use("/api/bookings", bookingRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/admin", adminRoutes);


// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173", // Adjust for your frontend URL
//     methods: ["*"],
//   },
// });







// io.on("connection", (socket) => {
//     console.log("New client connected:", socket.id);
  
//     socket.on("join", (room, callback) => {
//       socket.join(room);
//       console.log(`${socket.id} joined room: ${room}`);
//       if (callback) callback();
//     });
  
//     socket.on("disconnect", () => {
//       console.log("Client disconnected:", socket.id);
//     });
  
//     socket.on("connect", () => {
//       // Rejoin rooms based on user role (simplified logic)
//       const token = socket.handshake.headers.authorization?.split(" ")[1];
//       if (token) {
//         const decoded = jwtDecode(token);
//         if (decoded.role === "mechanic") {
//           socket.join("mechanic");
//           console.log(`${socket.id} rejoined 'mechanic' room on reconnect`);
//         }
//       }
//     });
  
//     socket.on("mechanicLocation", async (data) => {
//       const booking = await Booking.findOne({ mechanicId: data.mechanicId, status: "Accepted" });
//       if (booking) {
//         io.to(`biker_${booking.bikerId}`).emit("mechanicLocationUpdate", data);
//       }
//     });
//   });

// const PORT = process.env.PORT || 5000;


// server.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//     mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/", {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     }).then(() => console.log("MongoDB connected"));
//   });
  
//   // Export io for use in routes
//   module.exports = { app, io };



const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
const mapRoutes = require("./routes/mapRoutes");
const mechanicRoutes = require("./routes/mechanicRoutes");
const createBookingRoutes = require("./routes/bookingRoutes"); // 👈 Function that returns router
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const Booking = require("./models/Booking");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/map", mapRoutes);
app.use("/api/mechanics", mechanicRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // adjust as needed
    methods: ["GET", "POST"],
  },
});

// 👇 Inject io AFTER initialization
const bookingRoutes = createBookingRoutes(io);
app.use("/api/bookings", bookingRoutes);

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("join", (room, callback) => {
    socket.join(room);
    console.log(`${socket.id} joined room: ${room}`);
    if (callback) callback();
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });

  socket.on("connect", () => {
    const token = socket.handshake.headers.authorization?.split(" ")[1];
    if (token) {
      const decoded = jwtDecode(token);
      if (decoded.role === "mechanic") {
        socket.join("mechanic");
        console.log(`${socket.id} rejoined 'mechanic' room on reconnect`);
      }
    }
  });

  socket.on("mechanicLocation", async (data) => {
    const booking = await Booking.findOne({ mechanicId: data.mechanicId, status: "Accepted" });
    if (booking) {
      io.to(`biker_${booking.bikerId}`).emit("mechanicLocationUpdate", data);
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  mongoose
    .connect(process.env.MONGO_URI || "mongodb://localhost:27017/", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected"));
});
