const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/signup', async (req, res) => {
  const { username, password, email, phone } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ username, password, email, phone });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

module.exports = router;