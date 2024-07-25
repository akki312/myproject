const express = require('express');
const router = express.Router();
const customerService = require('../services/customerservice');

// Create a new customer
router.post('/', async (req, res) => {
  try {
    const customer = await customerService.createCustomer(req.body);
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all customers
router.get('/', async (req, res) => {
  try {
    const customers = await customerService.getAllCustomers();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a customer by ID
router.get('/:id', async (req, res) => {
  try {
    const customer = await customerService.getCustomerById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a customer by ID
router.post('/:id', async (req, res) => {
  try {
    const customer = await customerService.updateCustomerById(req.params.id, req.body);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a customer by ID
router.post('/:id', async (req, res) => {
  try {
    const customer = await customerService.deleteCustomerById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json({ message: 'Customer deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/age-range/:minAge/:maxAge', async (req, res) => {
  try {
    const { minAge, maxAge } = req.params;
    const customers = await customerService.getCustomersByAgeRange(parseInt(minAge), parseInt(maxAge));
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/group-by-city', async (req, res) => {
  try {
    const customersGroupedByCity = await customerService.getCustomersGroupedByCity();
    res.status(200).json(customersGroupedByCity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




module.exports = router;
