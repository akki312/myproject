const Booking = require('../models/booking');
const io = require('socket.io-client');
const socket = io('http://localhost:3000');
const logger = require('../loaders/logger');

// Buffer to store booking updates
let bookingBuffer = [];
const BUFFER_SIZE = 5; // Set the buffer size

// Function to emit updates in batches
function emitBufferedUpdates() {
  if (bookingBuffer.length > 0) {
    socket.emit('bookingBatchUpdated', bookingBuffer); // Emit the buffered updates
    socket.send(bookingBuffer); // Send the buffered updates using send method
    logger.info(`Batch booking updates: ${JSON.stringify(bookingBuffer)}`);
    bookingBuffer = []; // Clear the buffer
  }
}

// Create a new booking
async function createBooking(data) {
  try {
    const booking = new Booking(data);
    await booking.save();
    bookingBuffer.push({ action: 'create', booking });
    logger.info(`Booking created: ${JSON.stringify(booking)}`);

    if (bookingBuffer.length >= BUFFER_SIZE) {
      emitBufferedUpdates();
    }
    
    return booking;
  } catch (error) {
    logger.error('Error creating booking: ' + error.message);
    throw new Error('Error creating booking: ' + error.message);
  }
}

// Get all bookings
async function getAllBookings() {
  try {
    const bookings = await Booking.find();
    console.log('////data')
    logger.info('Retrieved all bookings');
    return bookings;
  } catch (error) {
    logger.error('Error retrieving bookings: ' + error.message);
    throw new Error('Error retrieving bookings: ' + error.message);
  }
}

// Get bookings by status
async function getBookingsByStatus(status) {
  try {
    const bookings = await Booking.find({ status });
    logger.info(`Retrieved bookings with status: ${status}`);
    return bookings;
  } catch (error) {
    logger.error('Error retrieving bookings by status: ' + error.message);
    throw new Error('Error retrieving bookings by status: ' + error.message);
  }
}

// Get a single booking by ID
async function getBookingById(id) {
  try {
    const booking = await Booking.findById(id);
    logger.info(`Retrieved booking with ID: ${id}`);
    return booking;
  } catch (error) {
    logger.error('Error retrieving booking: ' + error.message);
    throw new Error('Error retrieving booking: ' + error.message);
  }
}

// Update a booking
async function updateBooking(id, updateData) {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (updatedBooking) {
      bookingBuffer.push({ action: 'update', booking: updatedBooking });
      logger.info(`Booking updated: ${JSON.stringify(updatedBooking)}`);

      if (bookingBuffer.length >= BUFFER_SIZE) {
        emitBufferedUpdates();
      }
    }
    return updatedBooking;
  } catch (error) {
    logger.error('Error updating booking: ' + error.message);
    throw new Error('Error updating booking: ' + error.message);
  }
}

// Delete a booking
async function deleteBooking(id) {
  try {
    await Booking.findByIdAndDelete(id);
    bookingBuffer.push({ action: 'delete', id });
    logger.info(`Booking deleted with ID: ${id}`);

    if (bookingBuffer.length >= BUFFER_SIZE) {
      emitBufferedUpdates();
    }
  } catch (error) {
    logger.error('Error deleting booking: ' + error.message);
    throw new Error('Error deleting booking: ' + error.message);
  }
}

// Set an interval to emit any remaining updates in the buffer
setInterval(emitBufferedUpdates, 5000); // Adjust the interval as needed

// Using socket event handlers
socket.on('connect', () => {
  logger.info('Connected to WebSocket server');
});

socket.on('disconnect', () => {
  logger.warn('Disconnected from WebSocket server');
});

// Handle incoming messages efficiently
socket.on('bookingBatchUpdated', (data) => {
  logger.info(`Received batch booking updates: ${JSON.stringify(data)}`);
  // Process the received data promptly
});

module.exports = {
  createBooking,
  getAllBookings,
  getBookingsByStatus,
  getBookingById,
  updateBooking,
  deleteBooking
};
