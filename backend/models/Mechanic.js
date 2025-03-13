const mongoose = require("mongoose");

const mechanicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  location: {
    type: { type: String, default: "Point" },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  isAvailable: { type: Boolean, default: true }, // Mechanic's availability status
});

mechanicSchema.index({ location: "2dsphere" }); // Index for geospatial queries

const Mechanic = mongoose.model("Mechanic", mechanicSchema);
module.exports = Mechanic;
