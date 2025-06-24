const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/signup', async (req, res) => {
  const { username, password, email, phone } = req.body;

  try {
    const userExists = await User.findOne({ $or: [{ username }, { email }, { phone }] });
    if (userExists) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const newUser = new User({ username, password, email, phone });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

module.exports = router;
