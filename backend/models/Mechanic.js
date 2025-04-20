const mongoose = require("mongoose");

const mechanicSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  location: {
    type: { type: String, default: "Point" },
    coordinates: { type: [Number], required: true },
  },
  isAvailable: { type: Boolean, default: true },
});
mechanicSchema.index({ location: "2dsphere" });

const Mechanic = mongoose.model("Mechanic", mechanicSchema);
module.exports = Mechanic;
