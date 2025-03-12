const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const mapRoutes = require("./routes/mapRoutes");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/map", mapRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

app.get("/", (req, res) => {
    res.send("Backend is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
