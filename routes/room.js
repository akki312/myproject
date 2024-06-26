const express = require('express');
const router = express.Router();
const roomService = require('../services/roomservice');

// Create a new room
router.post('/', async (req, res) => {
  try {
    const room = await roomService.createRoom(req.body);
    res.status(201).json(room);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await roomService.getAllRooms();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a room by ID
router.get('/:id', async (req, res) => {
  try {
    const room = await roomService.getRoomById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a room by ID
router.post('/:id', async (req, res) => {
  try {
    const room = await roomService.updateRoomById(req.params.id, req.body);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a room by ID
router.post('/:id', async (req, res) => {
  try {
    const room = await roomService.deleteRoomById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json({ message: 'Room deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
