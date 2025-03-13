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

// Add dummy data for testing
const Job = mongoose.model("Job", jobSchema);

// // Insert dummy jobs if collection is empty
// Job.countDocuments({}, (err, count) => {
//   if (count === 0) {
//     Job.insertMany([
//       {
//         bikerId: new mongoose.Types.ObjectId(),
//         bikerName: "John Doe",
//         mechanicId: new mongoose.Types.ObjectId(),
//         location: {
//           type: "Point",
//           coordinates: [77.5946, 12.9716] // Bangalore coordinates
//         },
//         issue: "Flat tire",
//         status: "Pending"
//       },
//       {
//         bikerId: new mongoose.Types.ObjectId(),
//         bikerName: "Jane Smith",
//         mechanicId: new mongoose.Types.ObjectId(),
//         location: {
//           type: "Point",
//           coordinates: [77.2090, 28.6139] // Delhi coordinates
//         },
//         issue: "Engine trouble",
//         status: "In Progress"
//       }
//     ]);
//   }
// });

module.exports = Job;
