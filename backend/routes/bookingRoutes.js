// const express = require("express");
// const router = express.Router();
// const Booking = require("../models/Booking");
// const { authMiddleware, authorizeRole } = require("../middleware/auth");

// router.use(authMiddleware);
// const mongoose = require("mongoose");

// router.post("/",authorizeRole("biker"), async (req, res) => {
//   try {
//     let { bikerId, bikerName, bikerLocation, issue } = req.body;

//     // Validate bikerId format
//     if (!mongoose.Types.ObjectId.isValid(bikerId)) {
//       return res.status(400).json({ error: "Invalid biker ID format" });
//     }
//     bikerId = new mongoose.ObjectId(bikerId);

//     // Validate bikerLocation
//     if (
//       !Array.isArray(bikerLocation) ||
//       bikerLocation.length !== 2 ||
//       typeof bikerLocation[0] !== "number" ||
//       typeof bikerLocation[1] !== "number"
//     ) {
//       return res.status(400).json({ error: "Invalid biker location format. Expected [longitude, latitude]" });
//     }

//     // Create new booking
//     const booking = new Booking({
//       bikerId,
//       bikerName,
//       bikerLocation: {
//         type: "Point",
//         coordinates: bikerLocation
//       },
//       issue,
//       status: "Pending"
//     });

//     await booking.save();
//     res.status(201).json({ message: "Booking created successfully", booking });
//   } catch (error) {
//     console.error("Error creating booking:", error);
//     res.status(500).json({ message: "Error creating booking", error: error.message });
//   }
// });


// router.get("/pending", authorizeRole("mechanic","admin"),async (req, res) => {
//   try {
//     const pendingBookings = await Booking.find({ status: "Pending" })
//       .select("bikerId bikerName bikerLocation issue status createdAt");
    
//     res.json(pendingBookings);
//   } catch (error) {
//     res.status(500).json({ error: "Error fetching pending bookings" });
//   }
// });


// // Get bookings for a specific biker
// router.get("/biker/:bikerId",authorizeRole("biker"), async (req, res) => {
//   try {
//     const bikerId = new mongoose.Types.ObjectId(req.params.bikerId); // Convert to ObjectId

//     const bookings = await Booking.find({ bikerId })
//       .sort({ createdAt: -1 })
//       .populate("mechanicId", "name phone");

//     res.json(bookings);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching biker bookings", error });
//   }
// });
  

// router.get("/unassigned", async (req, res) => {
//   try {
//     const bookings = await Booking.find({ mechanicId: { $exists: false } });
//     res.json(bookings);
//   } catch (error) {
//     console.error("Error fetching unassigned bookings:", error);
//     res.status(500).json({ message: "Server Error" });
//   }
// });


// router.post("/:bookingId/accept",authorizeRole("mechanic"), async (req, res) => {
//   const { bookingId } = req.params;
//   let { mechanicId } = req.body;

//   try {
//     // Convert mechanicId to ObjectId
//     if (!mongoose.Types.ObjectId.isValid(mechanicId)) {
//       return res.status(400).json({ error: "Invalid mechanic ID" });
//     }
//     mechanicId = new mongoose.ObjectId(mechanicId);

//     const booking = await Booking.findById(bookingId);
//     if (!booking) {
//       return res.status(404).json({ error: "Booking not found" });
//     }

//     if (booking.status !== "Pending") {
//       return res.status(400).json({ error: "Booking is already assigned" });
//     }

//     booking.mechanicId = mechanicId;
//     booking.status = "Accepted";
//     await booking.save();

//     res.json({ message: "Booking accepted", booking });
//   } catch (error) {
//     console.error("Error accepting booking:", error);
//     res.status(500).json({ error: "Error accepting booking" });
//   }
// });



// router.post("/:bookingId/reject",authorizeRole("mechanic"), async (req, res) => {
//   const { bookingId } = req.params;

//   try {
//     const booking = await Booking.findById(bookingId);
//     if (!booking) {
//       return res.status(404).json({ error: "Booking not found" });
//     }

//     if (booking.status !== "Pending") {
//       return res.status(400).json({ error: "Booking is already assigned" });
//     }

//     // Change status to rejected but keep it available for another mechanic
//     booking.status = "Pending";  // Keep it available for reassignment
//     booking.mechanicId = null;   // Remove any assigned mechanic
//     await booking.save();

//     res.json({ message: "Booking rejected and is available for reassignment", booking });
//   } catch (error) {
//     console.error("Error rejecting booking:", error);
//     res.status(500).json({ error: "Error rejecting booking" });
//   }
// });



// router.get("/:bookingId/location",authorizeRole("mechanic"), async (req, res) => {
//   try {
//     const booking = await Booking.findById(req.params.bookingId);
//     if (!booking) {
//       return res.status(404).json({ error: "Booking not found" });
//     }

//     if (!booking.bikerLocation || !booking.bikerLocation.coordinates) {
//       return res.status(400).json({ error: "Location data not available" });
//     }

//     res.json({ location: booking.bikerLocation });
//   } catch (error) {
//     console.error("Error fetching booking location:", error);
//     res.status(500).json({ error: "Error fetching location" });
//   }
// });


// module.exports = router;



const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Mechanic = require("../models/Mechanic");
const Job = require("../models/Job");

const { authMiddleware, authorizeRole } = require("../middleware/auth");
const mongoose = require("mongoose");

router.use(authMiddleware);

// POST /api/bookings - Create a new booking
// router.post("/", authorizeRole("biker"), async (req, res) => {
//   try {

//     console.log("Received booking request:", req.body);
//     let { bikerId, bikerName, bikerLocation, issue } = req.body;
//     // Use the authenticated user's ID as bikerId for security
//     bikerId = req.user.id; // From JWT payload
//     if (!mongoose.Types.ObjectId.isValid(bikerId)) return res.status(400).json({ error: "Invalid biker ID" });

//     // Validate bikerName (optional, can be fetched from User model)
//     if (!bikerName || typeof bikerName !== "string") {
//       return res.status(400).json({ error: "Invalid biker name" });
//     }

//     // Validate bikerLocation
//     if (
//       !Array.isArray(bikerLocation) ||
//       bikerLocation.length !== 2 ||
//       !bikerLocation.every((coord) => Number.isFinite(coord))
//     ) {
//       return res.status(400).json({ error: "Invalid biker location format. Expected [longitude, latitude]" });
//     }

//     // Validate issue
//     if (!issue || typeof issue !== "string" || issue.trim().length === 0) {
//       return res.status(400).json({ error: "Issue is required" });
//     }

//     const booking = new Booking({
//       bikerId,
//       bikerName,
//       bikerLocation: { type: "Point", coordinates: bikerLocation },
//       issue: issue.trim(),
//     });
//     await booking.save();
//     res.status(201).json({ message: "Booking created successfully", booking });
//   } catch (error) {
//     res.status(500).json({ message: "Error creating booking", error: error.message });
//   }
// });


// In bookingRoutes.js
router.post("/", authorizeRole("biker"), async (req, res) => {
  try {
    let { bikerId, bikerName, bikerLocation, issue } = req.body;
    if (!mongoose.Types.ObjectId.isValid(bikerId)) return res.status(400).json({ error: "Invalid biker ID" });
    if (!bikerName || typeof bikerName !== "string") return res.status(400).json({ error: "Invalid biker name" });
    if (!Array.isArray(bikerLocation) || bikerLocation.length !== 2 || !bikerLocation.every(Number.isFinite))
      return res.status(400).json({ error: "Invalid biker location" });
    if (!issue || typeof issue !== "string" || issue.trim().length === 0) return res.status(400).json({ error: "Invalid issue" });

    const booking = new Booking({
      bikerId: bikerId,
      bikerName,
      bikerLocation: { type: "Point", coordinates: bikerLocation },
      issue: issue.trim(),
    });

    console.log("Booking data:", booking);
    await booking.save();
    res.status(201).json({ message: "Booking created", booking });
  } catch (error) {
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
router.post("/:bookingId/accept", authorizeRole("mechanic"), async (req, res) => {
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
    const mechanicId = req.user.id;



    const mechanic = await Mechanic.findOne({ userId: mechanicId });
    if (!mechanic) {
      return res.status(404).json({ error: "Mechanic not found for this user" });
    }

    
    
    // Update Booking
    booking.mechanicId = mechanic._id;
    booking.status = "Accepted";
    booking.acceptedAt = new Date();
    await booking.save();
    
    // Optionally create a Job
    const job = new Job({
      bikerId: booking.bikerId,
      bikerName: booking.bikerName,
      mechanicId: mechanic._id,
      location: booking.bikerLocation,
      issue: booking.issue,
      status: "Completed",
    });
    console.log(" Job:", job);
    await job.save();

    console.log("Job inderted");


    res.json({ message: "Booking accepted", booking, job });
  } catch (error) {
    console.error("Error accepting booking:", error);
    res.status(500).json({ message: "Server error", details: error.message });
  }
});
module.exports = router;