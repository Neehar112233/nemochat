const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const Message = require('../models/Message');
const { auth, adminAuth } = require('../middleware/auth');
const crypto = require('crypto');

// Generate unique code
const generateCode = () => crypto.randomBytes(4).toString('hex').toUpperCase();

// Create room
router.post('/create', auth, async (req, res) => {
  try {
    const { name, isPrivate } = req.body;
    if (!name) return res.status(400).json({ msg: 'Room name is required' });

    let code = generateCode();
    let existingCode = await Room.findOne({ code });
    while (existingCode) {
      code = generateCode();
      existingCode = await Room.findOne({ code });
    }

    const newRoom = new Room({
      name,
      code,
      isPrivate,
      createdBy: req.user,
      participants: [req.user],
    });

    const savedRoom = await newRoom.save();
    res.json(savedRoom);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all public rooms
router.get('/public', auth, async (req, res) => {
  try {
    const rooms = await Room.find({ isPrivate: false }).populate('createdBy', 'username');
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Get all rooms (including private)
router.get('/all', auth, adminAuth, async (req, res) => {
  try {
    const rooms = await Room.find().populate('createdBy', 'username');
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get room by code
router.get('/:code', auth, async (req, res) => {
  try {
    const room = await Room.findOne({ code: req.params.code }).populate('createdBy', 'username');
    if (!room) return res.status(404).json({ msg: 'Room not found' });
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get messages for room
router.get('/:roomId/messages', auth, async (req, res) => {
  try {
    const messages = await Message.find({ roomId: req.params.roomId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Delete room
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) return res.status(404).json({ msg: 'Room not found' });
    await Message.deleteMany({ roomId: req.params.id });
    res.json({ msg: 'Room deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
