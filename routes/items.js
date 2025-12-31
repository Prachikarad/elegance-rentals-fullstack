// routes/items.js
const express = require("express");
const router = express.Router();
const Item = require("../models/Item");

// Public: list all items
router.get("/", async (req, res) => {
    try {
        const items = await Item.find().sort({ createdAt: -1 });
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
