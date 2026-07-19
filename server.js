// server.js
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const itemRoutes = require("./routes/items");
const adminAuthRoutes = require("./routes/adminAuth");
const vendorAuthRoutes = require('./routes/vendorAuth');
const vendorRoutes = require('./routes/vendor');
const orderRoutes = require("./routes/orders");



// routes
const authRoutes = require("./routes/auth"); // optional if exists - keep if you have it
const adminRoutes = require("./routes/admin");

const app = express();

let mongoConnectionPromise = null;

function connectDatabase() {
  const MONGO_URL = process.env.MONGO_URL;

  if (!MONGO_URL) {
    console.warn("MongoDB warning: MONGO_URL is not set. Database features will not work.");
    return Promise.resolve();
  }

  if (mongoose.connection.readyState >= 1) {
    return Promise.resolve();
  }

  if (!mongoConnectionPromise) {
    mongoConnectionPromise = mongoose
      .connect(MONGO_URL, { serverSelectionTimeoutMS: 10000 })
      .then(() => {
        console.log("MongoDB connected");
      })
      .catch((err) => {
        mongoConnectionPromise = null;
        console.error("MongoDB error:", err.message);
        throw err;
      });
  }

  return mongoConnectionPromise;
}

// middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// serve public folder
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads"))); // image files

app.use("/api", async (req, res, next) => {
  try {
    await connectDatabase();
    next();
  } catch (err) {
    res.status(500).json({ message: "Database connection failed" });
  }
});

// mount routes
if (authRoutes) app.use("/api/auth", authRoutes); // if you have auth routes
app.use("/api/admin", adminRoutes);
app.use("/api/admin-auth", adminAuthRoutes);
app.use("/api/items", itemRoutes);
app.use('/api/vendor-auth', vendorAuthRoutes);
app.use('/api/vendor', vendorRoutes);
app.use("/api/orders", orderRoutes); 


// test route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });

  connectDatabase().catch(() => {
    console.warn("Server is still running, but database features will not work until MongoDB connects.");
  });
}

module.exports = app;
