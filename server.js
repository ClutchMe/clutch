require('dotenv').config();
require('./db');

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const authRoutes = require('./auth');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.json());
app.use('/api', authRoutes);
app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('🟢 A user connected:', socket.id);

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('🔴 User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Clutch server running on http://localhost:${PORT}`);
});
