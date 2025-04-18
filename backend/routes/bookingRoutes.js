const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");


const mongoose = require("mongoose");

router.post("/", async (req, res) => {
  try {
    let { bikerId, bikerName, bikerLocation, issue } = req.body;

    // Validate bikerId format
    if (!mongoose.Types.ObjectId.isValid(bikerId)) {
      return res.status(400).json({ error: "Invalid biker ID format" });
    }
    bikerId = new mongoose.Types.ObjectId(bikerId);

    // Validate bikerLocation
    if (
      !Array.isArray(bikerLocation) ||
      bikerLocation.length !== 2 ||
      typeof bikerLocation[0] !== "number" ||
      typeof bikerLocation[1] !== "number"
    ) {
      return res.status(400).json({ error: "Invalid biker location format. Expected [longitude, latitude]" });
    }

    // Create new booking
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
    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Error creating booking", error: error.message });
  }
});


router.get("/pending", async (req, res) => {
  try {
    const pendingBookings = await Booking.find({ status: "Pending" })
      .select("bikerId bikerName bikerLocation issue status createdAt");
    
    res.json(pendingBookings);
  } catch (error) {
    res.status(500).json({ error: "Error fetching pending bookings" });
  }
});


// Get bookings for a specific biker
router.get("/biker/:bikerId", async (req, res) => {
  try {
    const bikerId = new mongoose.Types.ObjectId(req.params.bikerId); // Convert to ObjectId

    const bookings = await Booking.find({ bikerId })
      .sort({ createdAt: -1 })
      .populate("mechanicId", "name phone");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching biker bookings", error });
  }
});
  

router.get("/unassigned", async (req, res) => {
  try {
    const bookings = await Booking.find({ mechanicId: { $exists: false } });
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching unassigned bookings:", error);
    res.status(500).json({ message: "Server Error" });
  }
});


router.post("/:bookingId/accept", async (req, res) => {
  const { bookingId } = req.params;
  let { mechanicId } = req.body;

  try {
    // Convert mechanicId to ObjectId
    if (!mongoose.Types.ObjectId.isValid(mechanicId)) {
      return res.status(400).json({ error: "Invalid mechanic ID" });
    }
    mechanicId = new mongoose.Types.ObjectId(mechanicId);

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
    console.error("Error accepting booking:", error);
    res.status(500).json({ error: "Error accepting booking" });
  }
});



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

    // Change status to rejected but keep it available for another mechanic
    booking.status = "Pending";  // Keep it available for reassignment
    booking.mechanicId = null;   // Remove any assigned mechanic
    await booking.save();

    res.json({ message: "Booking rejected and is available for reassignment", booking });
  } catch (error) {
    console.error("Error rejecting booking:", error);
    res.status(500).json({ error: "Error rejecting booking" });
  }
});



router.get("/:bookingId/location", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (!booking.bikerLocation || !booking.bikerLocation.coordinates) {
      return res.status(400).json({ error: "Location data not available" });
    }

    res.json({ location: booking.bikerLocation });
  } catch (error) {
    console.error("Error fetching booking location:", error);
    res.status(500).json({ error: "Error fetching location" });
  }
});


module.exports = router;
