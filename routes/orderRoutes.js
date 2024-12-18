// routes/orderRoutes.js
const express = require('express');
const User = require("../models/User.js")
const Order = require('../models/Order');
const router = express.Router();

// Place an order
router.post('/', async (req, res) => {
  const { userId, dishes } = req.body;

  try {
    

    // Calculate total amount
    const totalAmount = dishes.reduce((sum, dish) => sum + dish.quantity * dish.price, 0);

    // Create new order
    const order = new Order({
      userId,
      dishes,
      totalAmount,
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Expand order (add more dishes)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { dishes } = req.body;

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Add new dishes to the existing order
    order.dishes.push(...dishes);

    // Recalculate the total amount
    const totalAmount = order.dishes.reduce((sum, dish) => sum + dish.quantity * dish.price, 0);
    order.totalAmount = totalAmount;

    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'userName email');
    res.json({orders});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id).populate('userId', 'userName email');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get orders by user ID
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await Order.find({ userId }).populate('userId', 'userName email');
    if (orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }
    res.json({orders});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
