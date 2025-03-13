
const express = require("express");
const router = express.Router();
const Mechanic = require("../models/Mechanic");
const Job = require("../models/Job");

// ✅ Register mechanic with location
router.post("/register", async (req, res) => {
  try {
    const { name, phone, longitude, latitude } = req.body;
    const mechanic = new Mechanic({
      name,
      phone,
      location: { type: "Point", coordinates: [longitude, latitude] },
    });
    await mechanic.save();
    res.status(201).json({ message: "Mechanic registered successfully", mechanic });
  } catch (error) {
    res.status(500).json({ error: "Error registering mechanic" });
  }
});

// ✅ Update availability
router.put("/update-availability/:id", async (req, res) => {
  try {
    const { isAvailable } = req.body;
    const mechanic = await Mechanic.findByIdAndUpdate(req.params.id, { isAvailable }, { new: true });
    if (!mechanic) return res.status(404).json({ error: "Mechanic not found" });
    res.json({ message: "Availability updated", mechanic });
  } catch (error) {
    res.status(500).json({ error: "Error updating availability" });
  }
});

// ✅ Get nearby mechanics (within 5km radius)
router.get("/nearby", async (req, res) => {
  try {
    const { longitude, latitude } = req.query;
    const mechanics = await Mechanic.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(longitude), parseFloat(latitude)] },
          $maxDistance: 5000, // 5 km radius
        },
      },
      isAvailable: true,
    });
    res.json(mechanics);
  } catch (error) {
    res.status(500).json({ error: "Error finding nearby mechanics" });
  }
});



// Get mechanic's active jobs
router.get("/:mechanicId/jobs", async (req, res) => {
  try {
    const jobs = await Job.find({ 
      mechanicId: req.params.mechanicId,
      status: { $in: ["Pending", "In Progress"] }
    });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs", error });
  }
});

// Get mechanic's completed jobs
router.get("/:mechanicId/completed-jobs", async (req, res) => {
  try {
    const jobs = await Job.find({ 
      mechanicId: req.params.mechanicId,
      status: "Completed"
    });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching completed jobs", error });
  }
});

// Mark job as completed
router.post("/jobs/:jobId/complete", async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    job.status = "Completed";
    job.completedAt = new Date();
    await job.save();

    res.json({ message: "Job completed successfully", job });
  } catch (error) {
    res.status(500).json({ message: "Error completing job", error });
  }
});

// Update job status
router.put("/jobs/:jobId", async (req, res) => {
  try {
    const { status } = req.body;
    const job = await Job.findByIdAndUpdate(
      req.params.jobId,
      { status },
      { new: true }
    );
    
    if (!job) return res.status(404).json({ message: "Job not found" });
    
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: "Error updating job", error });
  }
});
  

module.exports = router;
