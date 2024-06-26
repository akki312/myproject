const express = require('express');
const router = express.Router();
const bookingService = require('../services/bookingservice');

// Create a new booking
router.post('/', async (req, res) => {
  try {
    const booking = await bookingService.createBooking(req.body);
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await bookingService.getAllBookings();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a booking by ID
router.get('/:id', async (req, res) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a booking by ID
router.put('/:id', async (req, res) => {
  try {
    const booking = await bookingService.updateBookingById(req.params.id, req.body);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a booking by ID
router.delete('/:id', async (req, res) => {
  try {
    const booking = await bookingService.deleteBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json({ message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get booking statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await bookingService.getBookingStatistics();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get bookings by date range
router.get('/range/:startDate/:endDate', async (req, res) => {
  try {
    const { startDate, endDate } = req.params;
    const bookings = await bookingService.getBookingsByDateRange(startDate, endDate);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get revenue by month
router.get('/revenue/monthly', async (req, res) => {
  try {
    const revenue = await bookingService.getRevenueByMonth();
    res.json(revenue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
