const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  bikerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bikerName: { type: String, required: true },
  bikerLocation: { 
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
  mechanicId: { type: mongoose.Schema.Types.ObjectId, ref: "Mechanic", default: null },
  status: { 
    type: String, 
    enum: ["Pending", "Accepted", "Completed", "Rejected"],
    default: "Pending"
  },
  createdAt: { type: Date, default: Date.now },
  acceptedAt: Date,
  completedAt: Date
});

bookingSchema.index({ bikerLocation: "2dsphere" });

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
