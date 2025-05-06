const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hash this in practice
  role: {
    type: String,
    enum: ["biker", "mechanic", "admin"],
    default: "biker",
  },
  createdAt: { type: Date, default: Date.now },
  // location: {
  //   type: { type: String, default: "Point" },
  //   coordinates: { type: [Number], default: [0, 0] },
  // },
  // role: { type: String, enum: ["biker", "mechanic"], required: true },
});

module.exports = mongoose.model("User", userSchema);