require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// Routes
const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);

// Serve HTML files
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/signup.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'signup.html')));
app.get('/login.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/verify.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'verify.html')));

app.listen(PORT, () => console.log(`🚀 Clutch server running on http://localhost:${PORT}`));