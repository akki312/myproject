const express = require('express');
const router = express.Router();
const roomService = require('../services/roomservice');

// Create a new room
router.post('/', async (req, res) => {
  try {
    const room = await roomService.createRoom(req.body);
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await roomService.getAllRooms();
    res.status(200).json(rooms);
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
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a room by ID
router.put('/:id', async (req, res) => {
  try {
    const room = await roomService.updateRoomById(req.params.id, req.body);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a room by ID
router.delete('/:id', async (req, res) => {
  try {
    await roomService.deleteRoomById(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get rooms by status
router.get('/status/:status', async (req, res) => {
  try {
    const rooms = await roomService.getRoomsByStatus(req.params.status);
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get available rooms
router.get('/availability/available', async (req, res) => {
  try {
    const rooms = await roomService.getAvailableRooms();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update room statuses in bulk
router.put('/bulk/status', async (req, res) => {
  try {
    const { ids, status } = req.body;
    const updatedRooms = await roomService.updateRoomStatuses(ids, status);
    res.status(200).json(updatedRooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
