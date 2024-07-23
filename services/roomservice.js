const Room = require('../models/room');
const io = require('socket.io-client'); // Client-side Socket.io
const socket = io('http://localhost:3000'); // Connect to the WebSocket server

// Create a new room
const createRoom = async (data) => {
  try {
    const room = new Room(data);
    await room.save();
    socket.emit('roomCreated', room); // Notify clients of the new room
    return room;
  } catch (error) {
    throw new Error('Error creating room: ' + error.message);
  }
};

// Get all rooms
const getAllRooms = async () => {
  try {
    return await Room.find();
  } catch (error) {
    throw new Error('Error retrieving rooms: ' + error.message);
  }
};

// Get a room by ID
const getRoomById = async (id) => {
  try {
    return await Room.findById(id);
  } catch (error) {
    throw new Error('Error retrieving room: ' + error.message);
  }
};

// Update a room by ID
const updateRoomById = async (id, data) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (updatedRoom) {
      socket.emit('roomUpdated', updatedRoom); // Notify clients of the updated room
    }
    return updatedRoom;
  } catch (error) {
    throw new Error('Error updating room: ' + error.message);
  }
};

// Delete a room by ID
const deleteRoomById = async (id) => {
  try {
    await Room.findByIdAndDelete(id);
    socket.emit('roomDeleted', { id }); // Notify clients of the deleted room
  } catch (error) {
    throw new Error('Error deleting room: ' + error.message);
  }
};

// Get rooms by status
const getRoomsByStatus = async (status) => {
  try {
    return await Room.find({ status });
  } catch (error) {
    throw new Error('Error retrieving rooms by status: ' + error.message);
  }
};

// Get available rooms
const getAvailableRooms = async () => {
  try {
    return await Room.find({ status: 'Available' });
  } catch (error) {
    throw new Error('Error retrieving available rooms: ' + error.message);
  }
};

// Update room statuses in bulk
const updateRoomStatuses = async (ids, status) => {
  try {
    return await Room.updateMany({ _id: { $in: ids } }, { status }, { new: true, runValidators: true });
  } catch (error) {
    throw new Error('Error updating room statuses: ' + error.message);
  }
};

module.exports = {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoomById,
  deleteRoomById,
  getRoomsByStatus,
  getAvailableRooms,
  updateRoomStatuses
};
