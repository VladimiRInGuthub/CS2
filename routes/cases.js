const express = require('express');
const router = express.Router();
const caseController = require('../controllers/caseController');
const auth = require('../utils/authMiddleware');

// 🎁 Routes publiques
router.get('/', caseController.getCases);
router.get('/:id', caseController.getCase);

// 🔐 Routes protégées
router.post('/open', auth, caseController.openCase);
router.get('/stats', auth, caseController.getCaseStats);
router.get('/history', auth, caseController.getCaseHistory);
router.get('/user-stats', auth, caseController.getUserStats);

// 🧪 Route de test pour l'authentification
router.get('/test-auth', auth, (req, res) => {
  res.json({ 
    message: 'Authentification réussie', 
    user: req.user,
    userId: req.user.id 
  });
});

module.exports = router;
