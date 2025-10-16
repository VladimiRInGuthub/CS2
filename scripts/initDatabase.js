const mongoose = require('mongoose');
const User = require('../models/User');
const Case = require('../models/Case');
const Skin = require('../models/Skin');
const Battlepass = require('../models/Battlepass');
const logger = require('../utils/logger');

// Script d'initialisation complète de la base de données
const initializeDatabase = async () => {
  try {
    console.log('🚀 Initialisation de la base de données SkinCase...');
    
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skincase', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('📦 Connexion MongoDB établie');
    
    // Créer un administrateur par défaut
    await createDefaultAdmin();
    
    // Créer des cases par défaut
    await createDefaultCases();
    
    // Créer des skins par défaut
    await createDefaultSkins();
    
    // Créer un battlepass par défaut
    await createDefaultBattlepass();
    
    console.log('✅ Initialisation de la base de données terminée avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

// Créer un administrateur par défaut
const createDefaultAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ isAdmin: true });
    
    if (!existingAdmin) {
      const admin = new User({
        username: 'admin',
        email: 'admin@skincase.com',
        password: 'admin123', // À changer en production
        isAdmin: true,
        xcoins: 10000,
        emailVerified: true,
        preferences: {
          language: 'fr',
          theme: 'dark',
          notifications: {
            email: true,
            push: true,
            cases: true,
            servers: true,
            achievements: true
          }
        }
      });
      
      await admin.save();
      console.log('👤 Administrateur par défaut créé: admin@skincase.com / admin123');
    } else {
      console.log('👤 Administrateur existant trouvé');
    }
  } catch (error) {
    console.error('Erreur création admin:', error);
  }
};

// Créer des cases par défaut
const createDefaultCases = async () => {
  try {
    const existingCases = await Case.countDocuments();
    
    if (existingCases === 0) {
      const defaultCases = [
        {
          name: 'Case Starter',
          description: 'Parfaite pour débuter ! Contient des skins de qualité Consumer Grade à Mil-Spec.',
          shortDescription: 'Case parfaite pour débuter',
          price: 100,
          image: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhhwszJemkV08-jgZKKkuXLPr7Vn35cppwl3r3E9NWt3gLm_xE_N2-mJ4WQc1M3Y1rW-lfolO3p1pO-vJzJz3Rl6XJw5CjD30vgzA/256fx256f',
          rarity: 'Common',
          category: 'starter',
          dropRates: {
            'Consumer Grade': 79.92,
            'Industrial Grade': 15.98,
            'Mil-Spec Grade': 3.2,
            'Restricted': 0.64,
            'Classified': 0.16,
            'Covert': 0.06,
            'Contraband': 0.02
          },
          isActive: true,
          isFeatured: true,
          sortOrder: 1
        },
        {
          name: 'Case Premium',
          description: 'Case premium avec des skins de qualité supérieure. Plus de chances d\'obtenir des skins rares !',
          shortDescription: 'Case premium avec skins rares',
          price: 500,
          image: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhhwszJemkV08-jgZKKkuXLPr7Vn35cppwl3r3E9NWt3gLm_xE_N2-mJ4WQc1M3Y1rW-lfolO3p1pO-vJzJz3Rl6XJw5CjD30vgzA/256fx256f',
          rarity: 'Uncommon',
          category: 'premium',
          dropRates: {
            'Consumer Grade': 65.0,
            'Industrial Grade': 20.0,
            'Mil-Spec Grade': 10.0,
            'Restricted': 3.0,
            'Classified': 1.5,
            'Covert': 0.4,
            'Contraband': 0.1
          },
          isActive: true,
          isFeatured: true,
          sortOrder: 2
        },
        {
          name: 'Case Légendaire',
          description: 'La case la plus exclusive ! Contient uniquement des skins de qualité Classified et Covert.',
          shortDescription: 'Case exclusive avec skins légendaires',
          price: 2000,
          image: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhhwszJemkV08-jgZKKkuXLPr7Vn35cppwl3r3E9NWt3gLm_xE_N2-mJ4WQc1M3Y1rW-lfolO3p1pO-vJzJz3Rl6XJw5CjD30vgzA/256fx256f',
          rarity: 'Legendary',
          category: 'legendary',
          dropRates: {
            'Consumer Grade': 0,
            'Industrial Grade': 0,
            'Mil-Spec Grade': 0,
            'Restricted': 20.0,
            'Classified': 50.0,
            'Covert': 25.0,
            'Contraband': 5.0
          },
          isActive: true,
          isFeatured: true,
          sortOrder: 3
        }
      ];
      
      await Case.insertMany(defaultCases);
      console.log(`📦 ${defaultCases.length} cases par défaut créées`);
    } else {
      console.log(`📦 ${existingCases} cases existantes trouvées`);
    }
  } catch (error) {
    console.error('Erreur création cases:', error);
  }
};

// Créer des skins par défaut
const createDefaultSkins = async () => {
  try {
    const existingSkins = await Skin.countDocuments();
    
    if (existingSkins === 0) {
      const defaultSkins = [
        {
          name: 'AK-47 | Redline',
          weapon: 'AK-47',
          rarity: 'Classified',
          price: 25.50,
          image: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhhwszJemkV08-jgZKKkuXLPr7Vn35cppwl3r3E9NWt3gLm_xE_N2-mJ4WQc1M3Y1rW-lfolO3p1pO-vJzJz3Rl6XJw5CjD30vgzA/256fx256f',
          collection: 'The Dust 2 Collection',
          isActive: true
        },
        {
          name: 'AWP | Dragon Lore',
          weapon: 'AWP',
          rarity: 'Contraband',
          price: 2500.00,
          image: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhhwszJemkV08-jgZKKkuXLPr7Vn35cppwl3r3E9NWt3gLm_xE_N2-mJ4WQc1M3Y1rW-lfolO3p1pO-vJzJz3Rl6XJw5CjD30vgzA/256fx256f',
          collection: 'The Cobblestone Collection',
          isActive: true
        },
        {
          name: 'M4A4 | Howl',
          weapon: 'M4A4',
          rarity: 'Contraband',
          price: 1800.00,
          image: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhhwszJemkV08-jgZKKkuXLPr7Vn35cppwl3r3E9NWt3gLm_xE_N2-mJ4WQc1M3Y1rW-lfolO3p1pO-vJzJz3Rl6XJw5CjD30vgzA/256fx256f',
          collection: 'The Huntsman Collection',
          isActive: true
        },
        {
          name: 'Glock-18 | Water Elemental',
          weapon: 'Glock-18',
          rarity: 'Restricted',
          price: 8.50,
          image: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhhwszJemkV08-jgZKKkuXLPr7Vn35cppwl3r3E9NWt3gLm_xE_N2-mJ4WQc1M3Y1rW-lfolO3p1pO-vJzJz3Rl6XJw5CjD30vgzA/256fx256f',
          collection: 'The Cache Collection',
          isActive: true
        },
        {
          name: 'USP-S | Kill Confirmed',
          weapon: 'USP-S',
          rarity: 'Covert',
          price: 45.00,
          image: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhhwszJemkV08-jgZKKkuXLPr7Vn35cppwl3r3E9NWt3gLm_xE_N2-mJ4WQc1M3Y1rW-lfolO3p1pO-vJzJz3Rl6XJw5CjD30vgzA/256fx256f',
          collection: 'The Cache Collection',
          isActive: true
        }
      ];
      
      await Skin.insertMany(defaultSkins);
      console.log(`✨ ${defaultSkins.length} skins par défaut créés`);
    } else {
      console.log(`✨ ${existingSkins} skins existants trouvés`);
    }
  } catch (error) {
    console.error('Erreur création skins:', error);
  }
};

// Créer un battlepass par défaut
const createDefaultBattlepass = async () => {
  try {
    const existingBattlepass = await Battlepass.findOne({ isActive: true });
    
    if (!existingBattlepass) {
      const battlepass = new Battlepass({
        name: 'Battlepass Saison 1',
        description: 'Le premier battlepass de SkinCase ! Gagnez de l\'XP en jouant et débloquez des récompenses exclusives.',
        season: 'Saison 1',
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 jours
        price: 1000, // 1000 Xcoins
        tiers: [
          {
            level: 1,
            xpRequired: 0,
            freeRewards: [
              {
                type: 'xcoins',
                amount: 50,
                name: '50 Xcoins'
              }
            ],
            premiumRewards: [
              {
                type: 'xcoins',
                amount: 100,
                name: '100 Xcoins'
              },
              {
                type: 'title',
                amount: 1,
                name: 'Titre: Débutant'
              }
            ]
          },
          {
            level: 2,
            xpRequired: 100,
            freeRewards: [
              {
                type: 'case',
                amount: 1,
                name: 'Case Starter'
              }
            ],
            premiumRewards: [
              {
                type: 'case',
                amount: 2,
                name: '2 Cases Premium'
              }
            ]
          },
          {
            level: 3,
            xpRequired: 250,
            freeRewards: [
              {
                type: 'xcoins',
                amount: 75,
                name: '75 Xcoins'
              }
            ],
            premiumRewards: [
              {
                type: 'xcoins',
                amount: 150,
                name: '150 Xcoins'
              },
              {
                type: 'badge',
                amount: 1,
                name: 'Badge: Joueur Actif'
              }
            ]
          }
        ],
        missions: [
          {
            id: 'daily_case_open',
            name: 'Ouvrir une case',
            description: 'Ouvrez une case pour gagner de l\'XP',
            type: 'daily',
            category: 'cases',
            requirements: { casesOpened: 1 },
            xpReward: 50,
            xcoinsReward: 10
          },
          {
            id: 'daily_server_join',
            name: 'Rejoindre un serveur',
            description: 'Rejoignez un serveur CS2 pour gagner de l\'XP',
            type: 'daily',
            category: 'servers',
            requirements: { serversJoined: 1 },
            xpReward: 30,
            xcoinsReward: 5
          }
        ]
      });
      
      await battlepass.save();
      console.log('🎯 Battlepass par défaut créé');
    } else {
      console.log('🎯 Battlepass actif existant trouvé');
    }
  } catch (error) {
    console.error('Erreur création battlepass:', error);
  }
};

// Exécuter si appelé directement
if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase;
