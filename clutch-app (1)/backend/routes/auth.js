const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/signup', async (req, res) => {
  try {
    const { username, password, email, phone } = req.body;
    const existingUser = await User.findOne({ $or: [{ username }, { email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username, email, or phone already in use' });
    }

    const newUser = new User({ username, password, email, phone });
    await newUser.save();
    res.status(200).json({ message: 'Signup successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during signup' });
  }
});

module.exports = router;
