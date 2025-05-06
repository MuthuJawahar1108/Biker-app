



const express = require("express");
const Booking = require("../models/Booking");
const Mechanic = require("../models/Mechanic");
const Job = require("../models/Job");

const {  authorizeRole } = require("../middleware/auth");
const mongoose = require("mongoose");




module.exports = function(io) {

  const router = express.Router();
  router.post("/", authorizeRole("biker"), async (req, res) => {



    try {
      let { bikerId, bikerName, bikerLocation, issue } = req.body;

      if (!mongoose.Types.ObjectId.isValid(bikerId))
        return res.status(400).json({ error: "Invalid biker ID" });
      if (!bikerName || typeof bikerName !== "string")
        return res.status(400).json({ error: "Invalid biker name" });
      if (!Array.isArray(bikerLocation) || bikerLocation.length !== 2 || !bikerLocation.every(Number.isFinite))
        return res.status(400).json({ error: "Invalid biker location" });
      if (!issue || typeof issue !== "string" || issue.trim().length === 0)
        return res.status(400).json({ error: "Invalid issue" });

      const booking = new Booking({
        bikerId: bikerId,
        bikerName,
        bikerLocation: { type: "Point", coordinates: bikerLocation },
        issue: issue.trim(),
      });

      console.log("Before save:", booking);
      await booking.save();
      console.log("After save, booking ID:", booking._id);

      // Notify mechanics
      console.log("Emitting newBooking to mechanic room");

      io.to("mechanic").emit("newBooking", {
        bookingId: booking._id,
        bikerName,
        issue,
        bikerLocation: booking.bikerLocation, // Add this line
      });

      console.log("Emit completed");

      res.status(201).json({ message: "Booking created", booking });
    } catch (error) {
      console.error("Error in booking creation:", error);
      res.status(500).json({ error: "Error creating booking", message: error.message });
    }
  });


  

  // GET /api/bookings - Fetch all bookings for the authenticated biker
  router.get("/", authorizeRole("biker"), async (req, res) => {
    try {
      const bikerId = req.user.id; // From JWT payload
      if (!mongoose.Types.ObjectId.isValid(bikerId)) return res.status(400).json({ error: "Invalid biker ID" });

      const bookings = await Booking.find({ bikerId })
        .sort({ createdAt: -1 }) // Latest first
        .select("bikerName bikerLocation issue status createdAt acceptedAt completedAt mechanicId");
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Error fetching bookings", error: error.message });
    }
  });

  // GET /api/bookings/pending - Fetch pending bookings (for mechanics/admins)
  router.get("/pending", authorizeRole("mechanic", "admin"), async (req, res) => {
    try {
      const bookings = await Booking.find({ status: "Pending" }).select("bikerId bikerName bikerLocation issue status createdAt");
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: "Error fetching pending bookings", message: error.message });
    }
  });

  // POST /api/bookings/:id/accept - Accept a booking
  // router.post("/:id/accept", authorizeRole("mechanic"), async (req, res) => {
  //   try {
  //     if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: "Invalid booking ID" });
  //     const booking = await Booking.findById(req.params.id);
  //     if (!booking || booking.status !== "Pending") return res.status(400).json({ error: "Invalid booking status" });
  //     if (!mongoose.Types.ObjectId.isValid(req.body.mechanicId)) return res.status(400).json({ error: "Invalid mechanic ID" });
  //     booking.mechanicId = new mongoose.Types.ObjectId(req.body.mechanicId);
  //     booking.status = "Accepted";
  //     booking.acceptedAt = new Date();
  //     await booking.save();
  //     res.json({ message: "Booking accepted", booking });
  //   } catch (error) {
  //     res.status(500).json({ error: "Error accepting booking", message: error.message });
  //   }
  // });

  // GET /api/bookings/:id/location - Fetch live biker location
  router.get("/:id/location", async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: "Invalid booking ID" });
      const booking = await Booking.findById(req.params.id);
      if (!booking) return res.status(404).json({ error: "Booking not found" });
      if (!booking.bikerLocation) return res.status(400).json({ error: "Location data not available" });
      res.json({ location: booking.bikerLocation });
    } catch (error) {
      res.status(500).json({ error: "Error fetching location", message: error.message });
    }
  });

  // router.post("/select-mechanic/:id", authorizeRole("mechanic"), async (req, res) => {
  //   try {
  //     const bookingId = req.params.id;
  //     if (!mongoose.Types.ObjectId.isValid(bookingId)) return res.status(400).json({ error: "Invalid booking ID" });
  //     const { mechanicId } = req.body;
  //     if (!mongoose.Types.ObjectId.isValid(mechanicId)) return res.status(400).json({ error: "Invalid mechanic ID" });

  //     const booking = await Booking.findById(bookingId);
  //     if (!booking || booking.status !== "Pending") return res.status(400).json({ error: "Invalid booking status" });
  //     const mechanic = await Mechanic.findById(mechanicId);
  //     if (!mechanic || !mechanic.isAvailable) return res.status(400).json({ error: "Mechanic not available" });

  //     booking.mechanicId = mechanicId;
  //     booking.status = "Assigned"; // New status before acceptance
  //     await booking.save();
  //     res.json({ message: "Mechanic selected", booking });
  //   } catch (error) {
  //     res.status(500).json({ message: "Error selecting mechanic", error: error.message });
  //   }
  // });



  // GET a specific booking by ID
router.get("/:bookingId", authorizeRole("mechanic"), async (req, res) => {
  try {
    const bookingId = req.params.bookingId;

    // Validate bookingId
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ error: "Invalid booking ID" });
    }

    // Find the booking
    const booking = await Booking.findById(bookingId).lean(); // .lean() for plain JS object

    // Check if booking exists
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Additional checks (e.g., ensure it's not completed or restricted)
    if (booking.status === "Completed") {
      return res.status(400).json({ error: "Booking is already completed" });
    }

    // Return the booking details
    console.log("Retrieved booking:", booking); // Logging for debugging
    res.status(200).json(booking);
  } catch (err) {
    console.error("Error fetching booking:", err);
    res.status(500).json({ error: "Error fetching booking: " + err.message });
  }
});

  router.post("/:bookingId/lock", authorizeRole("mechanic"), async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.bookingId);

      
      if (!booking || booking.status !== "Pending" || booking.isBeingAnalyzedBy) {
        return res.status(400).json({ error: "Booking unavailable for analysis" });
      }
      booking.isBeingAnalyzedBy = req.user._id; // Assume req.user from middleware
      console.log("Booking:", booking);
      await booking.save();
      res.status(200).json({ message: "Booking locked for analysis" });
    } catch (err) {
      res.status(500).json({ error: "Error locking booking: " + err.message });
    }
  });


  router.post("/select-mechanic/:id", authorizeRole("mechanic"), async (req, res) => {
    try {
      const bookingId = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(bookingId)) return res.status(400).json({ error: "Invalid booking ID" });
      const mechanicId = req.user.id; // Use authenticated user ID instead of req.body.mechanicId

      const booking = await Booking.findById(bookingId);
      if (!booking || booking.status !== "Pending") return res.status(400).json({ error: "Invalid booking status" });
      const mechanic = await Mechanic.findOne({ userId: mechanicId });
      if (!mechanic || !mechanic.isAvailable) return res.status(400).json({ error: "Mechanic not available" });

      booking.mechanicId = mechanic._id; // Use mechanic._id from the found document
      booking.status = "Assigned";
      await booking.save();
      res.json({ message: "Mechanic selected", booking });
    } catch (error) {
      res.status(500).json({ message: "Error selecting mechanic", error: error.message });
    }
  });

  // router.post("/:bookingId/accept", authorizeRole("mechanic"), async (req, res) => {
  //   try {
  //     const { bookingId } = req.params;


  //     if (!mongoose.Types.ObjectId.isValid(bookingId)) {
  //       return res.status(400).json({ error: "Invalid booking ID" });
  //     }
  //     const booking = await Booking.findById(bookingId);


  //     if (!booking) return res.status(404).json({ message: "Booking not found" });
  //     if (booking.status !== "Pending") {
  //       return res.status(400).json({ message: "Booking is not pending" });
  //     }
  //     if (booking.mechanicId) {
  //       return res.status(400).json({ message: "Booking already assigned" });
  //     }
  //     const mechanicId = req.user.id;



  //     const mechanic = await Mechanic.findOne({ userId: mechanicId });
  //     if (!mechanic) {
  //       return res.status(404).json({ error: "Mechanic not found for this user" });
  //     }

      
      
  //     // Update Booking
  //     booking.mechanicId = mechanic._id;
  //     booking.status = "Accepted";
  //     booking.acceptedAt = new Date();
  //     await booking.save();

  //     //Notify biker
  //     io.to("biker").emit("bookingAccepted", { bookingId, mechanicId: mechanic._id });
      
  //     // Optionally create a Job
  //     const job = new Job({
  //       bikerId: booking.bikerId,
  //       bikerName: booking.bikerName,
  //       mechanicId: mechanic._id,
  //       location: booking.bikerLocation,
  //       issue: booking.issue,
  //       status: "Completed",
  //     });
  //     console.log(" Job:", job);
  //     await job.save();

  //     console.log("Job inderted");


  //     res.json({ message: "Booking accepted", booking, job });
  //   } catch (error) {
  //     console.error("Error accepting booking:", error);
  //     res.status(500).json({ message: "Server error", details: error.message });
  //   }
  // });

  router.post("/:bookingId/accept", authorizeRole("mechanic"), async (req, res) => {

    console.log("Accepting booking with ID:", req.params.bookingId);
    try {
      const { bookingId } = req.params;
  
      if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        return res.status(400).json({ error: "Invalid booking ID" });
      }
  
      const booking = await Booking.findById(bookingId);
      if (!booking) return res.status(404).json({ message: "Booking not found" });
      if (booking.status !== "Pending") {
        return res.status(400).json({ message: "Booking is not pending" });
      }
      if (booking.mechanicId) {
        return res.status(400).json({ message: "Booking already assigned" });
      }
  
      const mechanicId = req.user.id; // Extracted from JWT token
      console.log("Mechanic ID from token:", mechanicId);
      const mechanic = await Mechanic.findOne({ userId: mechanicId}); // Assuming _id matches req.user.id
      console.log("Mechanic found:", mechanic);
      if (!mechanic) {
        return res.status(404).json({ error: "Mechanic not found" });
      }
  
      // Update Booking
      booking.mechanicId = mechanic._id;
      booking.status = "Accepted";
      booking.acceptedAt = new Date();
      await booking.save();
  
      // Notify biker
      io.to("biker").emit("bookingAccepted", { bookingId, mechanicId: mechanic._id });
  
      // Optionally create a Job
      const job = new Job({
        bikerId: booking.bikerId,
        bikerName: booking.bikerName,
        mechanicId: mechanic._id,
        location: booking.bikerLocation,
        issue: booking.issue,
        status: "In Progress", // Changed to "In Progress" since it’s just accepted
      });
      console.log("Job:", job);
      await job.save();
      console.log("Job inserted");
  
      res.json({ message: "Booking accepted", booking, job });
    } catch (error) {
      console.error("Error accepting booking:", error);
      res.status(500).json({ message: "Server error", details: error.message });
    }
  });

//update the biker’s location
  router.put("/location/:bikerId", authorizeRole("biker"), async (req, res) => {
    try {
      const { location } = req.body;
      if (!Array.isArray(location.coordinates) || location.coordinates.length !== 2 || !location.coordinates.every(Number.isFinite)) {
        return res.status(400).json({ error: "Invalid location format" });
      }
      const booking = await Booking.findOne({ bikerId: req.params.bikerId, status: "Pending" });
      if (!booking) return res.status(404).json({ error: "No pending booking found" });
      booking.bikerLocation = location;
      await booking.save();
      res.status(200).json({ message: "Location updated", location });
    } catch (err) {
      res.status(500).json({ error: "Error updating location: " + err.message });
    }
  });



  return router;
};
// module.exports = router;