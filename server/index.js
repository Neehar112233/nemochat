require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');
const contactRoutes = require('./routes/contact');
const Room = require('./models/Room');
const Message = require('./models/Message');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/contact', contactRoutes);

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Socket.io logic
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('joinRoom', async ({ roomId, userId, username, isAdmin }) => {
    socket.join(roomId);
    
    if (isAdmin) {
      console.log(`Admin ${username} joined room: ${roomId} stealthily`);
      return;
    }

    console.log(`${username} joined room: ${roomId}`);

    // Update room participants in DB
    try {
      await Room.findByIdAndUpdate(roomId, { $addToSet: { participants: userId } });
      io.to(roomId).emit('message', {
        username: 'System',
        text: `${username} has joined the chat`,
        createdAt: new Date()
      });
    } catch (err) {
      console.error(err);
    }
  });

  socket.on('sendMessage', async ({ roomId, userId, username, text }) => {
    try {
      const newMessage = new Message({ roomId, sender: userId, username, text });
      await newMessage.save();
      io.to(roomId).emit('message', newMessage);
    } catch (err) {
      console.error(err);
    }
  });

  socket.on('leaveRoom', async ({ roomId, userId, username, isAdmin }) => {
    socket.leave(roomId);
    
    if (isAdmin) {
      console.log(`Admin ${username} left room: ${roomId} stealthily`);
      return;
    }

    console.log(`${username} left room: ${roomId}`);

    try {
      const room = await Room.findByIdAndUpdate(
        roomId,
        { $pull: { participants: userId } },
        { new: true }
      );

      if (room && room.participants.length === 0) {
        console.log(`Room ${roomId} is empty, deleting...`);
        await Room.findByIdAndDelete(roomId);
        await Message.deleteMany({ roomId });
      } else {
        io.to(roomId).emit('message', {
          username: 'System',
          text: `${username} has left the chat`,
          createdAt: new Date()
        });
      }
    } catch (err) {
      console.error(err);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    // Note: To handle disconnect properly, we'd need to track which room the socket was in.
    // Simplifying for now by relying on explicit 'leaveRoom' event or ping/pong logic.
  });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
