const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.post("/register", async (req, res) => {
  try {

    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(201).json({ message: "User registered successfully", token, userId: user._id.toString(), name: user.name, role: user.role });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
});




// In authRoutes.js
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }); // Assuming a User model
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: "1h" });
    console.log(token);
    res.json({ token, userId: user._id, name: user.name, role: user.role }); // Return user data
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});





module.exports = router;