const express = require("express");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();

router.get("/route", async (req, res) => {
    const { start, end } = req.query;
    console.log("API Key:", process.env.ORS_API_KEY);
    console.log("Received request:", start, end);
    
    if (!start || !end) {
        return res.status(400).json({ message: "Start and end coordinates are required" });
    }
    
    try {
        const response = await axios.get(
            `https://api.openrouteservice.org/v2/directions/driving-car`,
            {
                params: { api_key: process.env.ORS_API_KEY, start, end },
            }
        );
        console.log(response)

        res.json(response.data);
    } catch (error) {
        console.error("Error fetching route", error.response?.data || error.message);
        res.status(500).json({ message: "Error fetching route", error });
    }
});

module.exports = router;
