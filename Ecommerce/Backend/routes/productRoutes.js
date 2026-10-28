const express = require("express");
const Product = require("../models/Product");
const { protect, adminOnly } = require("../middleware/auth");
const router = express.Router();

router.get("/", async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product nahi mila" });
    res.json(product);
  } catch {
    res.status(400).json({ message: "ID galat hai" });
  }
});

router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: "Product nahi mila" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product nahi mila" });
    res.json({ message: "Product delete ho gaya" });
  } catch {
    res.status(400).json({ message: "ID galat hai" });
  }
});

module.exports = router;