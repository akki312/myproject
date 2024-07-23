const Booking = require('../models/booking');
const io = require('socket.io-client'); // Client-side Socket.io
const socket = io('http://localhost:3000'); // Connect to the WebSocket server

// Create a new booking
async function createBooking(data) {
  try {
    const booking = new Booking(data);
    await booking.save();
    socket.emit('bookingUpdated', booking); // Notify clients of the new booking
    return booking;
  } catch (error) {
    throw new Error('Error creating booking: ' + error.message);
  }
}

// Get all bookings
async function getAllBookings() {
  try {
    return await Booking.find();
  } catch (error) {
    throw new Error('Error retrieving bookings: ' + error.message);
  }
}

// Get bookings by status
async function getBookingsByStatus(status) {
  try {
    return await Booking.find({ status });
  } catch (error) {
    throw new Error('Error retrieving bookings by status: ' + error.message);
  }
}

// Get a single booking by ID
async function getBookingById(id) {
  try {
    return await Booking.findById(id);
  } catch (error) {
    throw new Error('Error retrieving booking: ' + error.message);
  }
}

// Update a booking
async function updateBooking(id, updateData) {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (updatedBooking) {
      socket.emit('bookingUpdated', updatedBooking); // Notify clients of the updated booking
    }
    return updatedBooking;
  } catch (error) {
    throw new Error('Error updating booking: ' + error.message);
  }
}

// Delete a booking
async function deleteBooking(id) {
  try {
    await Booking.findByIdAndDelete(id);
    socket.emit('bookingDeleted', { id }); // Notify clients of the deleted booking
  } catch (error) {
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
