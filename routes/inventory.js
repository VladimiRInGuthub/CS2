const express = require('express');
const router = express.Router();

// Exemple simple
router.get('/', (req, res) => {
  res.json({ message: 'Inventaire OK' });
});

module.exports = router;
