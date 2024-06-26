const Booking = require('../models/booking');

// Create a new booking
const createBooking = async (data) => {
  const booking = new Booking(data);
  await booking.save();
  return booking;
};

// Get all bookings
const getAllBookings = async () => {
  return await Booking.find().populate('customer').populate('room');
};

// Get a booking by ID
const getBookingById = async (id) => {
  return await Booking.findById(id).populate('customer').populate('room');
};

// Update a booking by ID
const updateBookingById = async (id, data) => {
  return await Booking.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

// Delete a booking by ID
const deleteBookingById = async (id) => {
  return await Booking.findByIdAndDelete(id);
};

module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingById,
  deleteBookingById
};
