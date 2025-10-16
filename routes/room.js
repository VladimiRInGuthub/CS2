const express = require('express');
const router = express.Router();

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return res.status(401).json({ error: 'Non authentifié' });
};

const rooms = [];
const MAX_ROOMS_PER_USER = 3;

router.post('/create', ensureAuthenticated, (req, res) => {
  const username = req.user?.username || req.user?.steamId;
  const userRooms = rooms.filter(room => room.owner === username);
  if (userRooms.length >= MAX_ROOMS_PER_USER) {
    return res.status(429).json({ error: 'Limite de rooms atteinte' });
  }

  const roomId = Math.random().toString(36).substring(2, 8);
  const room = {
    id: roomId,
    owner: username,
    players: [username],
    createdAt: new Date()
  };
  rooms.push(room);
  res.json({ message: 'Room créée', room });
});

router.get('/list', (req, res) => {
  res.json(rooms);
});

module.exports = router;
