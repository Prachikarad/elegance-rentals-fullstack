// createAdmin.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const MONGO_URL = "mongodb://localhost:27017/loginApp";

async function createAdmin() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB");

    const existing = await User.findOne({ username: "admin" });
    if (existing) {
      console.log("Admin already exists. Updating role/password...");
      existing.role = "admin";
      existing.password = await bcrypt.hash("admin123", 10);
      await existing.save();
      console.log("Admin updated. username=admin password=admin123");
      return process.exit(0);
    }

    const hashed = await bcrypt.hash("admin123", 10);
    const admin = new User({
      username: "admin",
      password: hashed,
      role: "admin"
    });
    await admin.save();
    console.log("Admin created. username=admin password=admin123");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

createAdmin();
