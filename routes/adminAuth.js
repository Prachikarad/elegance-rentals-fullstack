// routes/adminAuth.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// POST /api/admin-auth/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Missing username or password" });

    const admin = await User.findOne({ username });
    if (!admin) return res.status(400).json({ message: "Admin not found" });

    if (admin.role !== "admin") return res.status(403).json({ message: "Not an admin account" });

    const ok = await bcrypt.compare(password, admin.password);
    if (!ok) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign({ id: admin._id, role: "admin", username: admin.username }, "SECRET123", { expiresIn: "7h" });
    return res.json({ message: "Admin login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
