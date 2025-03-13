const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  bikerName: String,
  location: String,
  status: { type: String, default: "Pending" }, // New status field
});

module.exports = mongoose.model("Job", jobSchema);
