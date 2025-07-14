const express = require('express');
const router = express.Router();
const auth = require('../utils/authMiddleware');

const rooms = [];
const MAX_ROOMS_PER_USER = 3;

router.post('/create', auth, (req, res) => {
  const userRooms = rooms.filter(room => room.owner === req.user.username);
  if (userRooms.length >= MAX_ROOMS_PER_USER) {
    return res.status(429).json({ error: 'Limite de rooms atteinte' });
  }

  const roomId = Math.random().toString(36).substring(2, 8);
  const room = {
    id: roomId,
    owner: req.user.username,
    players: [req.user.username],
    createdAt: new Date()
  };
  rooms.push(room);
  res.json({ message: 'Room créée', room });
});

router.get('/list', (req, res) => {
  res.json(rooms);
});

module.exports = router;