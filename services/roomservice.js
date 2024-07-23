const Room = require('../models/room');

// Create a new room
const createRoom = async (data) => {
  const room = new Room(data);
  await room.save();
  return room;
};

// Get all rooms
const getAllRooms = async () => {
  return await Room.find();
};

// Get a room by ID
const getRoomById = async (id) => {
  return await Room.findById(id);
};

// Update a room by ID
const updateRoomById = async (id, data) => {
  return await Room.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

// Delete a room by ID
const deleteRoomById = async (id) => {
  return await Room.findByIdAndDelete(id);
};

module.exports = {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoomById,
  deleteRoomById
};
