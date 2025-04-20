const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  bikerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bikerName: { type: String, required: true },
  mechanicId: { type: mongoose.Schema.Types.ObjectId, ref: "Mechanic", required: true },
  location: { 
    type: { 
      type: String,
      default: "Point"
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  issue: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["Pending", "In Progress", "Completed"],
    default: "Pending"
  },
  createdAt: { type: Date, default: Date.now },
  completedAt: Date
});

jobSchema.index({ location: "2dsphere" });

const Job = mongoose.model("Job", jobSchema);


module.exports = Job;
