const Room = require('../models/room');
const io = require('socket.io-client'); // Client-side Socket.io
const socket = io('http://localhost:3000'); // Connect to the WebSocket server
const logger = require('../loaders/logger'); // Import the logger

// Buffer to store room updates
let roomBuffer = [];
const BUFFER_SIZE = 5; // Set the buffer size

// Function to emit updates in batches
function emitBufferedUpdates() {
  if (roomBuffer.length > 0) {
    socket.emit('roomBatchUpdated', roomBuffer); // Emit the buffered updates
    logger.info(`Batch room updates: ${JSON.stringify(roomBuffer)}`);
    roomBuffer = []; // Clear the buffer
  }
}

// Set an interval to emit any remaining updates in the buffer
setInterval(emitBufferedUpdates, 5000); // Adjust the interval as needed

// Create a new room
const createRoom = async (data) => {
  try {
    const room = new Room(data);
    await room.save();
    roomBuffer.push(room);
    logger.info(`Room created: ${room}`);

    if (roomBuffer.length >= BUFFER_SIZE) {
      emitBufferedUpdates();
    }

    return room;
  } catch (error) {
    logger.error('Error creating room: ' + error.message);
    throw new Error('Error creating room: ' + error.message);
  }
};

// Get all rooms
const getAllRooms = async () => {
  try {
    const rooms = await Room.find();
    logger.info('Retrieved all rooms');
    return rooms;
  } catch (error) {
    logger.error('Error retrieving rooms: ' + error.message);
    throw new Error('Error retrieving rooms: ' + error.message);
  }
};

// Get a room by ID
const getRoomById = async (id) => {
  try {
    const room = await Room.findById(id);
    logger.info(`Retrieved room with ID: ${id}`);
    return room;
  } catch (error) {
    logger.error('Error retrieving room: ' + error.message);
    throw new Error('Error retrieving room: ' + error.message);
  }
};

// Update a room by ID
const updateRoomById = async (id, data) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (updatedRoom) {
      roomBuffer.push(updatedRoom);
      logger.info(`Room updated: ${updatedRoom}`);

      if (roomBuffer.length >= BUFFER_SIZE) {
        emitBufferedUpdates();
      }
    }
    return updatedRoom;
  } catch (error) {
    logger.error('Error updating room: ' + error.message);
    throw new Error('Error updating room: ' + error.message);
  }
};

// Delete a room by ID
const deleteRoomById = async (id) => {
  try {
    await Room.findByIdAndDelete(id);
    roomBuffer.push({ id, deleted: true });
    logger.info(`Room deleted: ${id}`);

    if (roomBuffer.length >= BUFFER_SIZE) {
      emitBufferedUpdates();
    }
  } catch (error) {
    logger.error('Error deleting room: ' + error.message);
    throw new Error('Error deleting room: ' + error.message);
  }
};

// Get rooms by status
const getRoomsByStatus = async (status) => {
  try {
    const rooms = await Room.find({ status });
    logger.info(`Retrieved rooms with status: ${status}`);
    return rooms;
  } catch (error) {
    logger.error('Error retrieving rooms by status: ' + error.message);
    throw new Error('Error retrieving rooms by status: ' + error.message);
  }
};

// Get available rooms
const getAvailableRooms = async () => {
  try {
    const rooms = await Room.find({ status: 'Available' });
    logger.info('Retrieved available rooms');
    return rooms;
  } catch (error) {
    logger.error('Error retrieving available rooms: ' + error.message);
    throw new Error('Error retrieving available rooms: ' + error.message);
  }
};

// Update room statuses in bulk
const updateRoomStatuses = async (ids, status) => {
  try {
    const result = await Room.updateMany({ _id: { $in: ids } }, { status }, { new: true, runValidators: true });
    logger.info(`Updated room statuses for IDs: ${ids} to status: ${status}`);
    return result;
  } catch (error) {
    logger.error('Error updating room statuses: ' + error.message);
    throw new Error('Error updating room statuses: ' + error.message);
  }
};

// Get rooms grouped by type
const getRoomsGroupedByType = async () => {
  try {
    const roomsGrouped = await Room.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);
    logger.info('Retrieved rooms grouped by type');
    return roomsGrouped;
  } catch (error) {
    logger.error('Error retrieving rooms grouped by type: ' + error.message);
    throw new Error('Error retrieving rooms grouped by type: ' + error.message);
  }
};

// Get total number of rooms
const getTotalRooms = async () => {
  try {
    const total = await Room.countDocuments();
    logger.info(`Total number of rooms: ${total}`);
    return total;
  } catch (error) {
    logger.error('Error retrieving total number of rooms: ' + error.message);
    throw new Error('Error retrieving total number of rooms: ' + error.message);
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
  updateRoomStatuses,
  getRoomsGroupedByType,
  getTotalRooms
};
