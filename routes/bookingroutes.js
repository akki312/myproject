const express = require('express');
const router = express.Router();
const bookingService = require('../services/bookingservice');

// Create a new booking
router.post('/newbooking', async (req, res) => {
  try {
    const booking = await bookingService.createBooking(req.body);
    req.io.emit('bookingCreated', booking); // Notify clients of the new booking
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all bookings
router.get('/allbookings', async (req, res) => {
  try {
    const bookings = await bookingService.getAllBookings();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get bookings by status
router.get('/status/:status', async (req, res) => {
  try {
    const { status } = req.params;
    const bookings = await bookingService.getBookingsByStatus(status);
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single booking by ID
router.get('/getsinglebyid/:id', async (req, res) => { // Corrected the route
  try {
    const booking = await bookingService.getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a booking
router.post('/updatebyid/:id', async (req, res) => { // Corrected the route
  try {
    const booking = await bookingService.updateBooking(req.params.id, req.body);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    req.io.emit('bookingUpdated', booking); // Notify clients of the updated booking
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a booking
router.post('/deletebyid/:id', async (req, res) => { // Corrected the route
  try {
    await bookingService.deleteBooking(req.params.id);
    req.io.emit('bookingDeleted', { id: req.params.id }); // Notify clients of the deleted booking
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
