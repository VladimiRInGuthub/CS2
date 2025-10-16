const express = require('express');
const router = express.Router();
const caseController = require('../controllers/caseController');
const { body, query, param } = require('express-validator');
// Remplace l'auth JWT par une vérification de session Passport
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return res.status(401).json({ error: 'Non authentifié' });
};

// 🎁 Routes protégées (liste et lecture nécessitent une session)
router.get('/', ensureAuthenticated, caseController.getCases);
router.get('/:id', ensureAuthenticated, param('id').isMongoId(), caseController.getCase);

// 🔐 Routes protégées
router.post(
  '/open',
  ensureAuthenticated,
  body('caseId').isMongoId().withMessage('caseId invalide'),
  caseController.openCase
);
router.get('/stats', ensureAuthenticated, caseController.getCaseStats);
router.get('/history', ensureAuthenticated, caseController.getCaseHistory);
router.get('/user-stats', ensureAuthenticated, caseController.getUserStats);

// 🧪 Route de test pour l'authentification
router.get('/test-auth', ensureAuthenticated, (req, res) => {
  res.json({ 
    message: 'Authentification réussie', 
    user: req.user,
    userId: req.user.id 
  });
});

module.exports = router;
