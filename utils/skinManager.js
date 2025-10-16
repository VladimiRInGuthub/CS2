const mongoose = require('mongoose');
const Skin = require('../models/Skin');
const Case = require('../models/Case');
require('dotenv').config();

// Connexion à la base de données
mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/cs2freecase', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

/**
 * Gestionnaire de skins CS2
 * Ce module permet de gérer les skins avec de vraies données et images
 */
class SkinManager {
  
  /**
   * Récupère tous les skins avec leurs statistiques
   */
  static async getAllSkins() {
    try {
      const skins = await Skin.find({ isActive: true }).sort({ rarity: 1, price: 1 });
      return skins;
    } catch (error) {
      console.error('Erreur lors de la récupération des skins:', error);
      throw error;
    }
  }

  /**
   * Récupère les skins par rareté
   */
  static async getSkinsByRarity(rarity) {
    try {
      const skins = await Skin.find({ rarity, isActive: true }).sort({ price: 1 });
      return skins;
    } catch (error) {
      console.error('Erreur lors de la récupération des skins par rareté:', error);
      throw error;
    }
  }

  /**
   * Récupère les skins par type d'arme
   */
  static async getSkinsByWeaponType(weaponType) {
    try {
      const skins = await Skin.find({ weaponType, isActive: true }).sort({ price: 1 });
      return skins;
    } catch (error) {
      console.error('Erreur lors de la récupération des skins par arme:', error);
      throw error;
    }
  }

  /**
   * Récupère les statistiques des skins
   */
  static async getSkinStatistics() {
    try {
      const stats = await Skin.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: '$rarity',
            count: { $sum: 1 },
            avgPrice: { $avg: '$price' },
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      const totalSkins = await Skin.countDocuments({ isActive: true });
      const totalValue = await Skin.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, total: { $sum: '$price' } } }
      ]);

      return {
        totalSkins,
        totalValue: totalValue[0]?.total || 0,
        rarityBreakdown: stats
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  }

  /**
   * Crée des cases avec les skins disponibles
   */
  static async createCases() {
    try {
      // Supprimer les anciennes cases
      await Case.deleteMany({});

      // Récupérer tous les skins par rareté
      const skinsByRarity = await Skin.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$rarity', skins: { $push: '$$ROOT' } } }
      ]);

      const rarityGroups = {};
      skinsByRarity.forEach(group => {
        rarityGroups[group._id] = group.skins;
      });

      // Créer des cases avec des skins réels
      const cases = [
        {
          name: 'Case Standard',
          description: 'Case contenant des skins communs et rares',
          image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjNjY2NjY2Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTA1IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlN0YW5kYXJkIENhc2U8L3RleHQ+Cjwvc3ZnPg==',
          price: 100,
          rarity: 'Common',
          skins: [
            ...(rarityGroups.Common || []).slice(0, 8),
            ...(rarityGroups.Uncommon || []).slice(0, 6),
            ...(rarityGroups.Rare || []).slice(0, 4)
          ]
        },
        {
          name: 'Case Premium',
          description: 'Case avec des skins rares et épiques',
          image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjOUMzN0IwIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTA1IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlByZW1pdW0gQ2FzZTwvdGV4dD4KPC9zdmc+',
          price: 250,
          rarity: 'Rare',
          skins: [
            ...(rarityGroups.Uncommon || []).slice(0, 5),
            ...(rarityGroups.Rare || []).slice(0, 8),
            ...(rarityGroups.Epic || []).slice(0, 6),
            ...(rarityGroups.Legendary || []).slice(0, 2)
          ]
        },
        {
          name: 'Case Legendary',
          description: 'Case avec des skins légendaires garantis',
          image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRkY5ODAwIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTA1IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkxlZ2VuZGFyeSBDYXNlPC90ZXh0Pgo8L3N2Zz4=',
          price: 500,
          rarity: 'Legendary',
          skins: [
            ...(rarityGroups.Rare || []).slice(0, 3),
            ...(rarityGroups.Epic || []).slice(0, 5),
            ...(rarityGroups.Legendary || []).slice(0, 8)
          ]
        },
        {
          name: 'Case Elite',
          description: 'Case exclusive avec skins de haute valeur',
          image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRkZEQzAwIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTA1IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkVsaXRlIENhc2U8L3RleHQ+Cjwvc3ZnPg==',
          price: 750,
          rarity: 'Legendary',
          skins: [
            ...(rarityGroups.Epic || []).slice(0, 4),
            ...(rarityGroups.Legendary || []).slice(0, 12)
          ]
        }
      ];

      const createdCases = [];
      for (const caseData of cases) {
        if (caseData.skins.length > 0) {
          const newCase = new Case({
            name: caseData.name,
            description: caseData.description,
            image: caseData.image,
            price: caseData.price,
            rarity: caseData.rarity,
            skins: caseData.skins.map(skin => skin._id),
            isActive: true
          });

          await newCase.save();
          createdCases.push(newCase);
          console.log(`✅ Case créée: ${caseData.name} (${caseData.skins.length} skins)`);
        }
      }

      return createdCases;
    } catch (error) {
      console.error('Erreur lors de la création des cases:', error);
      throw error;
    }
  }

  /**
   * Recherche des skins par nom
   */
  static async searchSkins(query) {
    try {
      const skins = await Skin.find({
        $and: [
          { isActive: true },
          {
            $or: [
              { name: { $regex: query, $options: 'i' } },
              { weapon: { $regex: query, $options: 'i' } }
            ]
          }
        ]
      }).sort({ rarity: 1, price: 1 });

      return skins;
    } catch (error) {
      console.error('Erreur lors de la recherche de skins:', error);
      throw error;
    }
  }

  /**
   * Récupère les skins les plus chers
   */
  static async getMostExpensiveSkins(limit = 10) {
    try {
      const skins = await Skin.find({ isActive: true })
        .sort({ price: -1 })
        .limit(limit);

      return skins;
    } catch (error) {
      console.error('Erreur lors de la récupération des skins les plus chers:', error);
      throw error;
    }
  }

  /**
   * Récupère les skins les moins chers
   */
  static async getCheapestSkins(limit = 10) {
    try {
      const skins = await Skin.find({ isActive: true })
        .sort({ price: 1 })
        .limit(limit);

      return skins;
    } catch (error) {
      console.error('Erreur lors de la récupération des skins les moins chers:', error);
      throw error;
    }
  }
}

// Fonction utilitaire pour afficher les statistiques
async function displayStatistics() {
  try {
    console.log('📊 Statistiques des skins CS2:');
    console.log('================================');
    
    const stats = await SkinManager.getSkinStatistics();
    console.log(`Total skins: ${stats.totalSkins}`);
    console.log(`Valeur totale: ${stats.totalValue.toLocaleString()} coins`);
    console.log('\nRépartition par rareté:');
    
    stats.rarityBreakdown.forEach(rarity => {
      console.log(`- ${rarity._id}: ${rarity.count} skins (prix moyen: ${Math.round(rarity.avgPrice)} coins)`);
    });

    console.log('\n🏆 Top 5 des skins les plus chers:');
    const expensiveSkins = await SkinManager.getMostExpensiveSkins(5);
    expensiveSkins.forEach((skin, index) => {
      console.log(`${index + 1}. ${skin.name} - ${skin.price.toLocaleString()} coins (${skin.rarity})`);
    });

  } catch (error) {
    console.error('Erreur lors de l\'affichage des statistiques:', error);
  }
}

// Exécuter les statistiques si le script est appelé directement
if (require.main === module) {
  displayStatistics().then(() => {
    process.exit(0);
  });
}

module.exports = SkinManager;
