const Booking = require('../models/booking');
const io = require('socket.io-client'); // Client-side Socket.io
const socket = io('http://localhost:3000'); // Connect to the WebSocket server
const logger = require('../loaders/logger'); // Import the logger

// Create a new booking
async function createBooking(data) {
  try {
    const booking = new Booking(data);
    await booking.save();
    socket.emit('bookingUpdated', booking); // Notify clients of the new booking
    logger.info(`Booking created: ${JSON.stringify(booking)}`);
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
      socket.emit('bookingUpdated', updatedBooking); // Notify clients of the updated booking
      logger.info(`Booking updated: ${JSON.stringify(updatedBooking)}`);
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
    socket.emit('bookingDeleted', { id }); // Notify clients of the deleted booking
    logger.info(`Booking deleted with ID: ${id}`);
  } catch (error) {
    logger.error('Error deleting booking: ' + error.message);
    throw new Error('Error deleting booking: ' + error.message);
  }
}

module.exports = {
  createBooking,
  getAllBookings,
  getBookingsByStatus,
  getBookingById,
  updateBooking,
  deleteBooking
};
