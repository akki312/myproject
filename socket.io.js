const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const bookingRoutes = require('../my project/routes/bookingroutes');
const Booking = require('./models/booking');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware and other setup
app.use(express.json());
app.use('/api/bookings', bookingRoutes);

// WebSocket connection handler
io.on('connection', (socket) => {
  console.log('New WebSocket connection established');

  // Listen for booking updates from clients
  socket.on('updateBooking', async (data) => {
    try {
      const updatedBooking = await Booking.findByIdAndUpdate(data.id, data.update, { new: true, runValidators: true });
      if (updatedBooking) {
        // Broadcast the updated booking to all connected clients
        io.emit('bookingUpdated', updatedBooking);
      }
    } catch (error) {
      socket.emit('error', { message: 'Error updating booking: ' + error.message });
    }
  });

  socket.on('disconnect', () => {
    console.log('WebSocket connection closed');
  });
});

// Connect to MongoDB and start the server
mongoose.connect('mongodb://localhost:27017/bookingDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    server.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });