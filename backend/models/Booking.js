const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  bikerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bikerLocation: { type: { lat: Number, lng: Number }, required: true },
  issueDescription: { type: String, required: true },
  mechanicId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // Mechanic is null if unassigned
  status: { type: String, enum: ["Pending", "Accepted", "Completed", "Rejected"], default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Booking", bookingSchema);
