const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ msg: 'Please enter all fields' });

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ msg: 'Username already exists' });

    const newUser = new User({ username, password });
    const savedUser = await newUser.save();
    
    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET);
    res.json({ token, user: { id: savedUser._id, username: savedUser.username, isAdmin: savedUser.isAdmin } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ msg: 'Please enter all fields' });

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: 'No account with this username has been registered' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token, user: { id: user._id, username: user.username, isAdmin: user.isAdmin } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/admin-login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (username !== 'admin' || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ msg: 'Invalid admin credentials' });
    }

    let user = await User.findOne({ username: 'admin' });
    if (!user) {
      user = new User({ username: 'admin', password: process.env.ADMIN_PASSWORD, isAdmin: true });
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token, user: { id: user._id, username: user.username, isAdmin: true } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
