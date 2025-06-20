const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/signup', async (req, res) => {
  const { username, password, email, phone } = req.body;
  try {
    const exists = await User.findOne({ $or: [{ username }, { email }, { phone }] });
    if (exists) return res.status(400).json({ message: "User, email or phone already exists" });

    const newUser = new User({ username, password, email, phone });
    await newUser.save();
    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during signup" });
  }
});

module.exports = router;