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

    if (!username || !password) {
      return res.status(400).json({ message: "Missing username or password" });
    }

    // find user
    const admin = await User.findOne({ username });
    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    // check admin role
    if (admin.role !== "admin") {
      return res.status(403).json({ message: "Not an admin account" });
    }

    // check password
    const ok = await bcrypt.compare(password, admin.password);
    if (!ok) {
      return res.status(400).json({ message: "Wrong password" });
    }

    // ✅ CORRECT TOKEN (IMPORTANT PART)
    const token = jwt.sign(
      {
        id: admin._id,
        username: admin.username,
        isAdmin: true
      },
      process.env.JWT_SECRET,   // ✅ SAME SECRET USED EVERYWHERE
      { expiresIn: "7h" }
    );

    return res.json({
      message: "Admin login successful",
      token
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
