const Customer = require('../models/customer');
const io = require('socket.io-client'); // Client-side Socket.io
const socket = io('http://localhost:3000'); // Connect to the WebSocket server
const logger = require('../loaders/mongoose'); // Import the logger

// Create a new customer
const createCustomer = async (data) => {
  try {
    const customer = new Customer(data);
    await customer.save();
    socket.emit('customerCreated', customer); // Notify clients of the new customer
    logger.info(`Customer created: ${JSON.stringify(customer)}`);
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
    logger.info(`Retrieved all customers`);
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
      socket.emit('customerUpdated', updatedCustomer); // Notify clients of the updated customer
      logger.info(`Customer updated: ${JSON.stringify(updatedCustomer)}`);
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
    socket.emit('customerDeleted', { id }); // Notify clients of the deleted customer
    logger.info(`Customer deleted with ID: ${id}`);
  } catch (error) {
    logger.error('Error deleting customer: ' + error.message);
    throw new Error('Error deleting customer: ' + error.message);
  }
};

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomerById,
  deleteCustomerById
};
