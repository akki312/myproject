const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  roomNumber: {
    type: Number,
    required: true
  },
  checkInDate: {
    type: Date,
    required: true
  },
  checkOutDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        return value > this.checkInDate;
      },
      message: 'Check-out date must be after check-in date.'
    }
  },
  status: {
    type: String,
    enum: ['Confirmed', 'Checked In', 'Checked Out', 'Cancelled'],
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid'],
    required: true
  }
}, {
  timestamps: true
});

// Method to calculate the duration of the stay
bookingSchema.methods.calculateStayDuration = function() {
  const checkIn = new Date(this.checkInDate);
  const checkOut = new Date(this.checkOutDate);
  const duration = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24)); // Duration in days
  return duration;
};

// Static method to get bookings by status
bookingSchema.statics.getBookingsByStatus = function(status) {
  return this.find({ status });
};

module.exports = mongoose.model('Booking', bookingSchema);
