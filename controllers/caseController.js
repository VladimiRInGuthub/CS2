const User = require('../models/User');
const getRandomSkin = require('../utils/dropTable');

const CASE_PRICE = 250;

exports.openCase = async (req, res) => {
  const userId = req.user.id;

  try {
    // Use atomic findOneAndUpdate to prevent race conditions
    const user = await User.findOneAndUpdate(
      { 
        _id: userId, 
        coins: { $gte: CASE_PRICE } 
      },
      { 
        $inc: { coins: -CASE_PRICE } 
      },
      { 
        new: true, 
        runValidators: true 
      }
    );

    if (!user) {
      // Check if user exists but doesn't have enough coins
      const existingUser = await User.findById(userId);
      if (!existingUser) {
        return res.status(404).json({ error: 'Utilisateur introuvable' });
      }
      return res.status(400).json({ 
        error: 'Pas assez de coins',
        required: CASE_PRICE,
        available: existingUser.coins
      });
    }

    // Generate random skin after successful payment
    const skin = getRandomSkin();
    const skinId = skin.name.toLowerCase().replace(/\s/g, '-');
    
    // Add skin to inventory (allow duplicates - this is normal for case opening)
    const inventoryItem = {
      skinId,
      rarity: skin.rarity,
      name: skin.name,
      obtainedAt: new Date()
    };

    await User.findByIdAndUpdate(
      userId,
      { $push: { inventory: inventoryItem } },
      { runValidators: true }
    );

    res.json({
      message: 'Caisse ouverte avec succès !',
      skin,
      coins: user.coins,
      inventoryItem
    });
  } catch (err) {
    console.error('Error opening case:', err);
    
    // More specific error handling
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Données invalides',
        details: err.message 
      });
    }
    
    res.status(500).json({ 
      error: 'Erreur serveur lors de l\'ouverture de la caisse',
      timestamp: new Date().toISOString()
    });
  }
};
