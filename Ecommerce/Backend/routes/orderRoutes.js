const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { protect, adminOnly } = require("../middleware/auth");
const router = express.Router();

// Customer: order place kare (price DB se lete hain, frontend pe bharosa nahi)
router.post("/", protect, async (req, res) => {
  try {
    const { items, address } = req.body; // items: [{ product: id, qty }]
    if (!items?.length) return res.status(400).json({ message: "Cart khali hai" });

    let totalPrice = 0;
    const orderItems = [];

    for (const i of items) {
      const p = await Product.findById(i.product);
      if (!p) return res.status(404).json({ message: "Product nahi mila" });
      if (p.stock < i.qty)
        return res.status(400).json({ message: `${p.name} ka stock kam hai` });

      p.stock -= i.qty;
      await p.save();

      totalPrice += p.price * i.qty;
      orderItems.push({ product: p._id, name: p.name, price: p.price, qty: i.qty });
    }

    const order = await Order.create({
      user: req.user._id, items: orderItems, totalPrice, address,
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Customer: apne orders
router.get("/my", protect, async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// Admin: saare orders
router.get("/", protect, adminOnly, async (req, res) => {
  const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
  res.json(orders);
});

// Admin: status change
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ message: "Order nahi mila" });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;