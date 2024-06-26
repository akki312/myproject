const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const customerRoutes = require('./routes/customer');
const roomRoutes = require('./routes/room');
const bookingRoutes = require('./routes/bookingroutes');

const app = express();
const port = process.env.PORT || 3002;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/customers', customerRoutes);
app.use('/rooms', roomRoutes);
app.use('/bookings', bookingRoutes);

// Connect to MongoDB
mongoose.connect('mongodb+srv://akshithsistla:ccipnWsoxp5NQ0nm@cluster0.iljkeyx.mongodb.net/hotelmanagement', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}).catch(err => {
  console.error('Connection error', err);
});

module.exports = app;
