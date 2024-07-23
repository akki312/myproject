const Customer = require('../models/customer');
const io = require('socket.io-client'); // Client-side Socket.io
const socket = io('http://localhost:3000'); // Connect to the WebSocket server

// Create a new customer
const createCustomer = async (data) => {
  try {
    const customer = new Customer(data);
    await customer.save();
    socket.emit('customerCreated', customer); // Notify clients of the new customer
    return customer;
  } catch (error) {
    throw new Error('Error creating customer: ' + error.message);
  }
};

// Get all customers
const getAllCustomers = async () => {
  try {
    return await Customer.find();
  } catch (error) {
    throw new Error('Error retrieving customers: ' + error.message);
  }
};

// Get a customer by ID
const getCustomerById = async (id) => {
  try {
    return await Customer.findById(id);
  } catch (error) {
    throw new Error('Error retrieving customer: ' + error.message);
  }
};

// Update a customer by ID
const updateCustomerById = async (id, data) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (updatedCustomer) {
      socket.emit('customerUpdated', updatedCustomer); // Notify clients of the updated customer
    }
    return updatedCustomer;
  } catch (error) {
    throw new Error('Error updating customer: ' + error.message);
  }
};

// Delete a customer by ID
const deleteCustomerById = async (id) => {
  try {
    await Customer.findByIdAndDelete(id);
    socket.emit('customerDeleted', { id }); // Notify clients of the deleted customer
  } catch (error) {
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
