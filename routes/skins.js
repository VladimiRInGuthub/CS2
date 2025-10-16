const express = require('express');
const router = express.Router();
const SkinManager = require('../utils/skinManager');

// Récupérer tous les skins
router.get('/', async (req, res) => {
  try {
    const skins = await SkinManager.getAllSkins();
    res.json({ success: true, data: skins });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// Récupérer les skins par rareté
router.get('/rarity/:rarity', async (req, res) => {
  try {
    const { rarity } = req.params;
    const skins = await SkinManager.getSkinsByRarity(rarity);
    res.json({ success: true, data: skins });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// Récupérer les skins par type d'arme
router.get('/weapon/:weaponType', async (req, res) => {
  try {
    const { weaponType } = req.params;
    const skins = await SkinManager.getSkinsByWeaponType(weaponType);
    res.json({ success: true, data: skins });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// Rechercher des skins
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, error: 'Paramètre de recherche requis' });
    }
    
    const skins = await SkinManager.searchSkins(q);
    res.json({ success: true, data: skins });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// Récupérer les statistiques des skins
router.get('/stats', async (req, res) => {
  try {
    const stats = await SkinManager.getSkinStatistics();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// Récupérer les skins les plus chers
router.get('/expensive', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const skins = await SkinManager.getMostExpensiveSkins(limit);
    res.json({ success: true, data: skins });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// Récupérer les skins les moins chers
router.get('/cheapest', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const skins = await SkinManager.getCheapestSkins(limit);
    res.json({ success: true, data: skins });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// Créer des cases avec les skins disponibles
router.post('/create-cases', async (req, res) => {
  try {
    const cases = await SkinManager.createCases();
    res.json({ success: true, data: cases, message: 'Cases créées avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

module.exports = router;
