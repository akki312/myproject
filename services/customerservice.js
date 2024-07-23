const Customer = require('../models/customer');

// Create a new customer
const createCustomer = async (data) => {
  const customer = new Customer(data);
  await customer.save();
  return customer;
};

// Get all customers
const getAllCustomers = async () => {
  return await Customer.find();
};

// Get a customer by ID
const getCustomerById = async (id) => {
  return await Customer.findById(id);
};

// Update a customer by ID
const updateCustomerById = async (id, data) => {
  return await Customer.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

// Delete a customer by ID
const deleteCustomerById = async (id) => {
  return await Customer.findByIdAndDelete(id);
};

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomerById,
  deleteCustomerById
};
