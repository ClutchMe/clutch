require('./db'); // MongoDB connection

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const authRoutes = require('./auth'); // 👈 Auth routes

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.json()); // 👈 Needed to read JSON from POST
app.use('/api', authRoutes); // 👈 Use /api/login and /api/signup
app.use(express.static('public')); // 👈 Frontend files

// WebSocket handling
io.on('connection', (socket) => {
  console.log('🟢 A user connected:', socket.id);

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('🔴 User disconnected:', socket.id);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 Clutch server running on http://localhost:${PORT}`);
});
