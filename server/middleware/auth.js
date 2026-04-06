const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ msg: 'No authentication token, access denied' });

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.status(401).json({ msg: 'Token verification failed, access denied' });

    req.user = verified.id;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ msg: 'Admin access denied' });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { auth, adminAuth };
