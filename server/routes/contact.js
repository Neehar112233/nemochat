const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');
const { auth, adminAuth } = require('../middleware/auth');

// Public: Send a contact message (no auth needed)
router.post('/send', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !message) return res.status(400).json({ msg: 'Name and message are required' });

    const newMsg = new ContactMessage({ name, email, message });
    await newMsg.save();
    res.json({ msg: 'Message sent successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Get all contact messages
router.get('/all', auth, adminAuth, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Mark message as read
router.patch('/:id/read', auth, adminAuth, async (req, res) => {
  try {
    await ContactMessage.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ msg: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Delete contact message
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
