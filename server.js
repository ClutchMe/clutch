require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  phone: String
}));

app.post('/api/signup', async (req, res) => {
  const { username, password, email, phone } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }, { phone }] });
    if (existingUser) return res.status(400).send('User already exists');
    const user = new User({ username, password, email, phone });
    await user.save();
    res.redirect('/verify.html');
  } catch (err) {
    res.status(500).send('Server error');
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (user) res.send('Logged in');
  else res.status(400).send('Invalid credentials');
});

app.post('/api/verify', (req, res) => {
  res.send('Verification step placeholder');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
