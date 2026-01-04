// routes/admin.js (UPDATED WITH CLOUDINARY)
const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const Item = require("../models/Item");
const adminAuth = require("../middleware/adminAuth");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "elegance-rentals", // Folder name in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 800, height: 1000, crop: "limit" }] // Optimize images
  }
});

const upload = multer({ storage });

// GET /api/admin/items -> list all items
router.get("/items", adminAuth, async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/admin/items/add -> add an item (with Cloudinary upload)
router.post("/items/add", adminAuth, upload.single("image"), async (req, res) => {
  try {
    const body = req.body;
    
    // Cloudinary automatically provides the full URL in req.file.path
    const imagePath = req.file ? req.file.path : (body.image || "");
    
    const sizes = body.sizes ? body.sizes.split(",").map(s => s.trim()) : [];
    
    const item = new Item({
      name: body.name,
      price: Number(body.price) || 0,
      deposit: Number(body.deposit) || 0,
      image: imagePath,
      description: body.description || "",
      sizes,
      category: body.category || "Uncategorized"
    });
    
    await item.save();
    res.status(201).json({ message: "Item added successfully", item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/admin/items/:id -> update item
router.put("/items/:id", adminAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    
    const update = {
      name: body.name,
      price: Number(body.price) || 0,
      deposit: Number(body.deposit) || 0,
      category: body.category || "Uncategorized",
      description: body.description || "",
    };
    
    if (body.sizes) update.sizes = body.sizes.split(",").map(s => s.trim());
    if (body.image) update.image = body.image;
    
    const item = await Item.findByIdAndUpdate(id, update, { new: true });
    if (!item) return res.status(404).json({ message: "Item not found" });
    
    res.json({ message: "Item updated successfully", item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/admin/items/:id -> delete item
router.delete("/items/:id", adminAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const item = await Item.findByIdAndDelete(id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;