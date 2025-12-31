// routes/admin.js
const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const Item = require("../models/Item");
const adminAuth = require("../middleware/adminAuth");

// multer setup -> save files to /public/uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "public", "uploads"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, name);
  }
});
const upload = multer({ storage });

// GET /api/admin/items  -> list all items
router.get("/items", adminAuth, async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/admin/items/add -> add an item (multipart/form-data)
router.post("/items/add", adminAuth, upload.single("image"), async (req, res) => {
  try {
    const body = req.body;
    const imagePath = req.file ? "/uploads/" + req.file.filename : (body.image || "");
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
    res.status(201).json({ message: "Item added", item });
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
    if (body.image) update.image = body.image; // if frontend passes new image URL/path

    const item = await Item.findByIdAndUpdate(id, update, { new: true });
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item updated", item });
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
    res.json({ message: "Item deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
