const express = require('express');
const router = express.Router();
const caseController = require('../controllers/caseController');
const auth = require('../utils/authMiddleware'); // JWT à créer juste après

router.post('/open', auth, caseController.openCase);

router.get('/', (req, res) => {
  res.json({ message: 'API cases OK' });
});

module.exports = router;
