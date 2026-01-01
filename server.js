// server.js
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const itemRoutes = require("./routes/items");


// routes
const authRoutes = require("./routes/auth"); // optional if exists - keep if you have it
const adminRoutes = require("./routes/admin");

const app = express();

// middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// serve public folder
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads"))); // image files

// mount routes
if (authRoutes) app.use("/api/auth", authRoutes); // if you have auth routes
app.use("/api/admin", adminRoutes);
app.use("/api/items", itemRoutes);


// test route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// connect to mongo and start
const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("💚 MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log("MongoDB error:", err));
