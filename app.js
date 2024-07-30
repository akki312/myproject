// In your WebSocket server file (e.g., app.js or a separate WebSocket server file)
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./loaders/mongoose');
const bookingRoutes = require('./routes/bookingroutes');
const roomRoutes = require('./routes/room');
const customerRoutes = require('./routes/customer');
const authRoutes = require('./routes/authenticationroutes'); // Assuming you have a route file for rooms
const logger = require('./loaders/logger')

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware and other setup
app.use(express.json());
app.use('/api/bookings', bookingRoutes);
app.use('/api/rooms', roomRoutes); 
app.use('/api/customer', customerRoutes)
app.use('/api/authentication', authRoutes);// Add the room routes

// WebSocket connection handler
io.on('connection', (socket) => {
  console.log('New WebSocket connection established');

  // Handle incoming room events from clients or other sources
  socket.on('roomCreated', (room) => {
    console.log('Room created:', room);
    io.emit('roomCreated', room); // Broadcast the event to all clients
  });

  socket.on('roomUpdated', (room) => {
    console.log('Room updated:', room);
    io.emit('roomUpdated', room); // Broadcast the event to all clients
  });

  socket.on('roomDeleted', (data) => {
    console.log('Room deleted:', data);
    io.emit('roomDeleted', data); // Broadcast the event to all clients
  });

  socket.on('disconnect', () => {
    console.log('WebSocket connection closed');
  });
});

// Connect to MongoDB and start the server
connectDB().then(() => {
  server.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
});
