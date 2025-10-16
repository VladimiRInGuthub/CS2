const express = require('express');
const router = express.Router();
const Battlepass = require('../models/Battlepass');
const UserBattlepass = require('../models/UserBattlepass');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { ensureAuthenticated } = require('../middleware/auth');

// @route   GET /api/battlepass/active
// @desc    Get active battlepass
// @access  Public
router.get('/active', async (req, res) => {
  try {
    const battlepass = await Battlepass.getActiveBattlepass();
    
    if (!battlepass) {
      return res.status(404).json({ message: 'Aucun battlepass actif' });
    }
    
    res.json(battlepass);
  } catch (error) {
    console.error('Erreur récupération battlepass actif:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   GET /api/battlepass/progress
// @desc    Get user battlepass progress
// @access  Private
router.get('/progress', ensureAuthenticated, async (req, res) => {
  try {
    const battlepass = await Battlepass.getActiveBattlepass();
    
    if (!battlepass) {
      return res.status(404).json({ message: 'Aucun battlepass actif' });
    }
    
    let userProgress = await UserBattlepass.getUserProgress(req.user.id, battlepass._id);
    
    // Créer la progression si elle n'existe pas
    if (!userProgress) {
      userProgress = new UserBattlepass({
        userId: req.user.id,
        battlepassId: battlepass._id,
        isPremium: false,
        currentLevel: 0,
        currentXp: 0,
        totalXp: 0
      });
      await userProgress.save();
    }
    
    // Calculer le niveau actuel basé sur l'XP
    const currentLevel = battlepass.calculateUserLevel(userProgress.currentXp);
    userProgress.currentLevel = currentLevel;
    await userProgress.save();
    
    // Obtenir les récompenses non réclamées
    const unclaimedRewards = userProgress.getUnclaimedRewards();
    
    // Obtenir les missions actives
    const activeMissions = await Battlepass.getActiveMissions();
    
    res.json({
      battlepass: {
        id: battlepass._id,
        name: battlepass.name,
        description: battlepass.description,
        season: battlepass.season,
        startDate: battlepass.startDate,
        endDate: battlepass.endDate,
        timeRemaining: battlepass.getTimeRemaining(),
        tiers: battlepass.tiers
      },
      progress: {
        currentLevel: userProgress.currentLevel,
        currentXp: userProgress.currentXp,
        totalXp: userProgress.totalXp,
        isPremium: userProgress.isPremium,
        purchasedAt: userProgress.purchasedAt
      },
      unclaimedRewards,
      missions: activeMissions.map(m => m.mission),
      stats: userProgress.stats
    });
  } catch (error) {
    console.error('Erreur récupération progression battlepass:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   POST /api/battlepass/purchase
// @desc    Purchase battlepass premium
// @access  Private
router.post('/purchase', ensureAuthenticated, async (req, res) => {
  try {
    const battlepass = await Battlepass.getActiveBattlepass();
    
    if (!battlepass) {
      return res.status(404).json({ message: 'Aucun battlepass actif' });
    }
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    // Vérifier si l'utilisateur a assez de Xcoins
    if (user.xcoins < battlepass.price) {
      return res.status(400).json({ 
        message: 'Xcoins insuffisants',
        required: battlepass.price,
        current: user.xcoins
      });
    }
    
    // Obtenir ou créer la progression utilisateur
    let userProgress = await UserBattlepass.getUserProgress(req.user.id, battlepass._id);
    
    if (!userProgress) {
      userProgress = new UserBattlepass({
        userId: req.user.id,
        battlepassId: battlepass._id,
        isPremium: false,
        currentLevel: 0,
        currentXp: 0,
        totalXp: 0
      });
    }
    
    // Vérifier si l'utilisateur n'a pas déjà le premium
    if (userProgress.isPremium) {
      return res.status(400).json({ message: 'Vous avez déjà le battlepass premium' });
    }
    
    // Débiter les Xcoins
    user.xcoins -= battlepass.price;
    await user.save();
    
    // Activer le premium
    userProgress.isPremium = true;
    userProgress.purchasedAt = new Date();
    await userProgress.save();
    
    // Mettre à jour les statistiques du battlepass
    battlepass.stats.totalPurchases += 1;
    battlepass.stats.totalRevenue += battlepass.price;
    await battlepass.save();
    
    // Envoyer une notification
    await Notification.createNotification(
      req.user.id,
      'battlepass_purchased',
      'Battlepass Premium acheté !',
      `Félicitations ! Vous avez débloqué le battlepass premium "${battlepass.name}"`,
      { battlepassId: battlepass._id, battlepassName: battlepass.name },
      'high'
    );
    
    res.json({
      message: 'Battlepass premium acheté avec succès !',
      battlepass: {
        id: battlepass._id,
        name: battlepass.name,
        season: battlepass.season
      },
      remainingXcoins: user.xcoins
    });
  } catch (error) {
    console.error('Erreur achat battlepass:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   POST /api/battlepass/claim-reward
// @desc    Claim battlepass reward
// @access  Private
router.post('/claim-reward', ensureAuthenticated, async (req, res) => {
  try {
    const { tier, isPremium } = req.body;
    
    if (!tier || typeof isPremium !== 'boolean') {
      return res.status(400).json({ message: 'Paramètres invalides' });
    }
    
    const battlepass = await Battlepass.getActiveBattlepass();
    if (!battlepass) {
      return res.status(404).json({ message: 'Aucun battlepass actif' });
    }
    
    const userProgress = await UserBattlepass.getUserProgress(req.user.id, battlepass._id);
    if (!userProgress) {
      return res.status(404).json({ message: 'Progression non trouvée' });
    }
    
    // Vérifier si la récompense peut être réclamée
    if (!userProgress.canClaimReward(tier, isPremium)) {
      return res.status(400).json({ message: 'Récompense non disponible' });
    }
    
    // Obtenir les récompenses du tier
    const tierRewards = battlepass.getTierRewards(tier, isPremium);
    const rewards = isPremium ? tierRewards.premium : tierRewards.free;
    
    if (!rewards || rewards.length === 0) {
      return res.status(400).json({ message: 'Aucune récompense disponible pour ce tier' });
    }
    
    const user = await User.findById(req.user.id);
    const claimedItems = [];
    
    // Appliquer les récompenses
    for (const reward of rewards) {
      switch (reward.type) {
        case 'xcoins':
          user.xcoins += reward.amount;
          claimedItems.push(`${reward.amount} Xcoins`);
          break;
          
        case 'case':
          // Ajouter une case à l'inventaire (simulation)
          claimedItems.push(`Case: ${reward.name}`);
          break;
          
        case 'skin':
          // Ajouter un skin à l'inventaire (simulation)
          claimedItems.push(`Skin: ${reward.name}`);
          break;
          
        case 'title':
          // Ajouter un titre (simulation)
          claimedItems.push(`Titre: ${reward.name}`);
          break;
          
        case 'badge':
          // Ajouter un badge (simulation)
          claimedItems.push(`Badge: ${reward.name}`);
          break;
          
        case 'premium_days':
          // Ajouter des jours premium (simulation)
          claimedItems.push(`${reward.amount} jours premium`);
          break;
      }
    }
    
    await user.save();
    
    // Marquer la récompense comme réclamée
    userProgress.claimReward(tier, isPremium);
    await userProgress.save();
    
    // Envoyer une notification
    await Notification.createNotification(
      req.user.id,
      'battlepass_reward_claimed',
      'Récompense battlepass réclamée !',
      `Vous avez réclamé les récompenses du tier ${tier}: ${claimedItems.join(', ')}`,
      { tier, isPremium, rewards: claimedItems },
      'medium'
    );
    
    res.json({
      message: 'Récompense réclamée avec succès !',
      tier,
      isPremium,
      rewards: claimedItems,
      remainingXcoins: user.xcoins
    });
  } catch (error) {
    console.error('Erreur réclamation récompense:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   GET /api/battlepass/leaderboard
// @desc    Get battlepass leaderboard
// @access  Public
router.get('/leaderboard', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const battlepass = await Battlepass.getActiveBattlepass();
    if (!battlepass) {
      return res.status(404).json({ message: 'Aucun battlepass actif' });
    }
    
    const topPlayers = await UserBattlepass.getTopPlayers(battlepass._id, parseInt(limit));
    
    const leaderboard = topPlayers.map((player, index) => ({
      rank: index + 1,
      username: player.userId.username,
      avatar: player.userId.avatar,
      level: player.currentLevel,
      xp: player.currentXp,
      isPremium: player.isPremium,
      totalMissionsCompleted: player.stats.totalMissionsCompleted
    }));
    
    res.json({
      battlepass: {
        id: battlepass._id,
        name: battlepass.name,
        season: battlepass.season
      },
      leaderboard,
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error('Erreur récupération leaderboard battlepass:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   GET /api/battlepass/missions
// @desc    Get active missions
// @access  Public
router.get('/missions', async (req, res) => {
  try {
    const activeMissions = await Battlepass.getActiveMissions();
    
    res.json({
      missions: activeMissions.map(m => m.mission),
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error('Erreur récupération missions:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
