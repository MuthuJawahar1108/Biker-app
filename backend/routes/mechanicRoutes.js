
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
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
    
    // Validate isAvailable field
    if (typeof isAvailable !== "boolean") {
      return res.status(400).json({ error: "Invalid availability status" });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid mechanic ID" });
    }

    const mechanic = await Mechanic.findByIdAndUpdate(
      req.params.id, 
      { isAvailable }, 
      { new: true }
    );

    if (!mechanic) return res.status(404).json({ error: "Mechanic not found" });

    res.json({ message: "Availability updated", mechanic });
  } catch (error) {
    console.error("Error updating availability:", error);
    res.status(500).json({ error: "Server error while updating availability" });
  }
});




// ✅ Get nearby mechanics (within 5km radius)

router.get("/nearby", async (req, res) => {
  try {
    const { longitude, latitude } = req.query;

    // Validate latitude & longitude
    if (!longitude || !latitude || isNaN(longitude) || isNaN(latitude)) {
      return res.status(400).json({ error: "Invalid or missing latitude/longitude" });
    }

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
    console.error("Error finding nearby mechanics:", error);
    res.status(500).json({ error: "Server error while finding nearby mechanics" });
  }
});




// Get mechanic's active jobs

router.get("/:mechanicId/jobs", async (req, res) => {
  try {
    const { mechanicId } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(mechanicId)) {
      return res.status(400).json({ error: "Invalid mechanic ID" });
    }

    // Query active jobs
    const jobs = await Job.find({ 
      mechanicId: new mongoose.Types.ObjectId(mechanicId),
      status: { $in: ["Pending", "In Progress"] }
    });

    res.json(jobs);
  } catch (error) {
    console.error("Error fetching active jobs:", error);
    res.status(500).json({ message: "Server error while fetching active jobs", error });
  }
});


// Get mechanic's completed jobs

router.get("/:mechanicId/completed-jobs", async (req, res) => {
  try {
    const { mechanicId } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(mechanicId)) {
      return res.status(400).json({ error: "Invalid mechanic ID" });
    }

    // Query completed jobs
    const jobs = await Job.find({ 
      mechanicId: new mongoose.Types.ObjectId(mechanicId),
      status: "Completed"
    });

    res.json(jobs);
  } catch (error) {
    console.error("Error fetching completed jobs:", error.message, error.stack);
    res.status(500).json({ message: "Server error while fetching completed jobs", error: error.message });
  }
});


// Mark job as completed

router.post("/jobs/:jobId/complete", async (req, res) => {
  try {
    const { jobId } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ error: "Invalid job ID" });
    }

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Check if job is already completed
    if (job.status === "Completed") {
      return res.status(400).json({ message: "Job is already completed" });
    }

    // Update job status
    job.status = "Completed";
    job.completedAt = new Date();
    await job.save();

    res.json({ message: "Job completed successfully", job });
  } catch (error) {
    console.error("Error completing job:", error);
    res.status(500).json({ message: "Server error while completing job", error });
  }
});


// Update job status

router.put("/jobs/:jobId", async (req, res) => {
  try {
    const { jobId } = req.params;
    const { status } = req.body;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ error: "Invalid job ID" });
    }

    // Validate status field
    const validStatuses = ["Pending", "In Progress"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid job status update" });
    }

    // Update job status
    const job = await Job.findByIdAndUpdate(
      jobId,
      { status },
      { new: true }
    );

    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json({ message: "Job status updated", job });
  } catch (error) {
    console.error("Error updating job status:", error);
    res.status(500).json({ message: "Server error while updating job status", error });
  }
});
 

module.exports = router;
