const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");



// Create new booking
router.post("/", async (req, res) => {
  try {
    const { bikerId, bikerName, bikerLocation, issue } = req.body;
    
    const booking = new Booking({
      bikerId,
      bikerName,
      bikerLocation: {
        type: "Point",
        coordinates: bikerLocation
      },
      issue,
      status: "Pending"
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Error creating booking", error });
  }
});

// Get all pending bookings (for mechanics)
router.get("/pending", async (req, res) => {
  try {
    const pendingBookings = await Booking.find({ status: "Pending" })
      .populate("bikerId", "name phone")
      .populate("mechanicId", "name phone");
    res.json(pendingBookings);
  } catch (error) {
    res.status(500).json({ error: "Error fetching pending bookings" });
  }
});

// Get bookings for a specific biker
router.get("/biker/:bikerId", async (req, res) => {
  try {
    const bookings = await Booking.find({ bikerId: req.params.bikerId })
      .sort({ createdAt: -1 })
      .populate("mechanicId", "name phone");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching biker bookings", error });
  }
});
  

// Get all unassigned booking requests
router.get("/unassigned", async (req, res) => {
  try {
    const bookings = await Booking.find({ mechanicId: null }); // Fetch unassigned bookings
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching unassigned bookings:", error);
    res.status(500).json({ message: "Server Error" });
  }
});



// Mechanic accepts a booking
router.post("/:bookingId/accept", async (req, res) => {
    const { bookingId } = req.params;
    const { mechanicId } = req.body; // Mechanic ID from request
  
    try {
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
  
      if (booking.status !== "Pending") {
        return res.status(400).json({ error: "Booking is already assigned" });
      }
  
      booking.mechanicId = mechanicId;
      booking.status = "Accepted";
      await booking.save();
  
      res.json({ message: "Booking accepted", booking });
    } catch (error) {
      res.status(500).json({ error: "Error accepting booking" });
    }
  });




// Mechanic rejects a booking
router.post("/:bookingId/reject", async (req, res) => {
    const { bookingId } = req.params;
  
    try {
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
  
      if (booking.status !== "Pending") {
        return res.status(400).json({ error: "Booking is already assigned" });
      }
  
      booking.status = "Rejected";
      await booking.save();
  
      res.json({ message: "Booking rejected", booking });
    } catch (error) {
      res.status(500).json({ error: "Error rejecting booking" });
    }
  });


  router.get("/:bookingId/location", async (req, res) => {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ error: "Booking not found" });
  
    res.json({ location: booking.bikerLocation });
  });
  

module.exports = router;
