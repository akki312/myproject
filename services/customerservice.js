const Customer = require('../models/customer');
const io = require('socket.io-client'); // Client-side Socket.io
const socket = io('http://localhost:3000'); // Connect to the WebSocket server
const logger = require('../loaders/logger'); // Import the logger

// Buffer to store customer updates
let customerBuffer = [];
const BUFFER_SIZE = 5; // Set the buffer size

// Function to emit updates in batches
function emitBufferedUpdates() {
  if (customerBuffer.length > 0) {
    socket.emit('customerBatchUpdated', customerBuffer); // Emit the buffered updates
    logger.info(`Batch customer updates: ${JSON.stringify(customerBuffer)}`);
    customerBuffer = []; // Clear the buffer
  }
}

// Create a new customer
const createCustomer = async (data) => {
  try {
    const customer = new Customer(data);
    await customer.save();
    customerBuffer.push(customer);
    logger.info(`Customer created: ${JSON.stringify(customer)}`);

    if (customerBuffer.length >= BUFFER_SIZE) {
      emitBufferedUpdates();
    }
    
    return customer;
  } catch (error) {
    logger.error('Error creating customer: ' + error.message);
    throw new Error('Error creating customer: ' + error.message);
  }
};

// Get all customers
const getAllCustomers = async () => {
  try {
    const customers = await Customer.find();
    logger.info('Retrieved all customers');
    return customers;
  } catch (error) {
    logger.error('Error retrieving customers: ' + error.message);
    throw new Error('Error retrieving customers: ' + error.message);
  }
};

// Get a customer by ID
const getCustomerById = async (id) => {
  try {
    const customer = await Customer.findById(id);
    logger.info(`Retrieved customer with ID: ${id}`);
    return customer;
  } catch (error) {
    logger.error('Error retrieving customer: ' + error.message);
    throw new Error('Error retrieving customer: ' + error.message);
  }
};

// Update a customer by ID
const updateCustomerById = async (id, data) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (updatedCustomer) {
      customerBuffer.push(updatedCustomer);
      logger.info(`Customer updated: ${JSON.stringify(updatedCustomer)}`);

      if (customerBuffer.length >= BUFFER_SIZE) {
        emitBufferedUpdates();
      }
    }
    return updatedCustomer;
  } catch (error) {
    logger.error('Error updating customer: ' + error.message);
    throw new Error('Error updating customer: ' + error.message);
  }
};

// Delete a customer by ID
const deleteCustomerById = async (id) => {
  try {
    await Customer.findByIdAndDelete(id);
    customerBuffer.push({ id, deleted: true });
    logger.info(`Customer deleted with ID: ${id}`);

    if (customerBuffer.length >= BUFFER_SIZE) {
      emitBufferedUpdates();
    }
  } catch (error) {
    logger.error('Error deleting customer: ' + error.message);
    throw new Error('Error deleting customer: ' + error.message);
  }
};

// Get customers by age range
const getCustomersByAgeRange = async (minAge, maxAge) => {
  try {
    const customers = await Customer.aggregate([
      { $match: { age: { $gte: minAge, $lte: maxAge } } }
    ]);
    logger.info(`Retrieved customers by age range: ${minAge} - ${maxAge}`);
    return customers;
  } catch (error) {
    logger.error('Error retrieving customers by age range: ' + error.message);
    throw new Error('Error retrieving customers by age range: ' + error.message);
  }
};

// Get total number of customers
const getTotalCustomers = async () => {
  try {
    const total = await Customer.countDocuments();
    logger.info(`Total number of customers: ${total}`);
    return total;
  } catch (error) {
    logger.error('Error retrieving total number of customers: ' + error.message);
    throw new Error('Error retrieving total number of customers: ' + error.message);
  }
};

// Get customers grouped by city
const getCustomersGroupedByCity = async () => {
  try {
    const customersGrouped = await Customer.aggregate([
      { $group: { _id: '$city', count: { $sum: 1 } } }
    ]);
    logger.info('Retrieved customers grouped by city');
    return customersGrouped;
  } catch (error) {
    logger.error('Error retrieving customers grouped by city: ' + error.message);
    throw new Error('Error retrieving customers grouped by city: ' + error.message);
  }
};

// Set an interval to emit any remaining updates in the buffer
setInterval(emitBufferedUpdates, 5000); // Adjust the interval as needed

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomerById,
  deleteCustomerById,
  getCustomersByAgeRange,
  getTotalCustomers,
  getCustomersGroupedByCity
};
