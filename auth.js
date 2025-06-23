const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const router = express.Router();

// Replace with a secure key in production!
const JWT_SECRET = 'super_secret_key';

// User Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
});

const User = mongoose.model('User', UserSchema);

// Signup
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({ username, email, password: hashed });
    res.status(201).json({ message: 'User created', user: { username, email } });
  } catch (err) {
    res.status(400).json({ error: 'User already exists or invalid input' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign({ id: user._id }, JWT_SECRET);
  res.json({ token, username: user.username });
});

module.exports = router;
