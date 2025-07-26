const express = require('express');
const router = express.Router();
const auth = require('../utils/authMiddleware');
const crypto = require('crypto');

const rooms = [];
const MAX_ROOMS_PER_USER = 3;
const ROOM_EXPIRY_TIME = 30 * 60 * 1000; // 30 minutes

// Cleanup expired rooms every 5 minutes
setInterval(() => {
  const now = new Date();
  for (let i = rooms.length - 1; i >= 0; i--) {
    if (now - rooms[i].createdAt > ROOM_EXPIRY_TIME) {
      rooms.splice(i, 1);
    }
  }
}, 5 * 60 * 1000);

router.post('/create', auth, (req, res) => {
  // Clean up user's expired rooms first
  const now = new Date();
  for (let i = rooms.length - 1; i >= 0; i--) {
    if (rooms[i].owner === req.user.username && now - rooms[i].createdAt > ROOM_EXPIRY_TIME) {
      rooms.splice(i, 1);
    }
  }

  const userRooms = rooms.filter(room => room.owner === req.user.username);
  if (userRooms.length >= MAX_ROOMS_PER_USER) {
    return res.status(429).json({ error: 'Limite de rooms atteinte' });
  }

  // Generate cryptographically secure room ID
  const roomId = crypto.randomBytes(4).toString('hex').toUpperCase();
  const room = {
    id: roomId,
    owner: req.user.username,
    players: [req.user.username],
    createdAt: new Date()
  };
  rooms.push(room);
  res.json({ message: 'Room créée', room });
});

router.get('/list', auth, (req, res) => {
  // Only return non-expired rooms
  const now = new Date();
  const activeRooms = rooms.filter(room => now - room.createdAt <= ROOM_EXPIRY_TIME);
  res.json(activeRooms);
});

module.exports = router;
