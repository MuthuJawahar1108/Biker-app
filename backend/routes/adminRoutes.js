const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Mechanic = require("../models/Mechanic");
const { authMiddleware, authorizeRole } = require("../middleware/auth");

router.use(authMiddleware);
router.use(authorizeRole("admin"));

router.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().select("bikerId bikerName bikerLocation status createdAt");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Error fetching bookings" });
  }
});

router.get("/mechanics", async (req, res) => {
  try {
    const mechanics = await Mechanic.find().select("name phone location isAvailable rating");
    res.json(mechanics);
  } catch (error) {
    res.status(500).json({ error: "Error fetching mechanics" });
  }
});

router.put("/mechanics/:mechanicId/suspend", async (req, res) => {
  try {
    const mechanic = await Mechanic.findByIdAndUpdate(req.params.mechanicId, { isAvailable: false }, { new: true });
    if (!mechanic) return res.status(404).json({ error: "Mechanic not found" });
    res.json({ message: "Mechanic suspended", mechanic });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;