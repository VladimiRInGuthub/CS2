const mongoose = require('mongoose');
const Case = require('../models/Case');
const Skin = require('../models/Skin');
require('dotenv').config();

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cs2');

// 🎨 Skins de base
const skins = [
  // Common Skins
  {
    name: 'AK-47 | Elite Build',
    weapon: 'AK-47',
    rarity: 'Common',
    image: 'https://via.placeholder.com/300x200/666666/FFFFFF?text=AK-47+Elite+Build',
    price: 50,
    wear: 'Field-Tested'
  },
  {
    name: 'M4A4 | Evil Daimyo',
    weapon: 'M4A4',
    rarity: 'Common',
    image: 'https://via.placeholder.com/300x200/666666/FFFFFF?text=M4A4+Evil+Daimyo',
    price: 45,
    wear: 'Field-Tested'
  },
  {
    name: 'USP-S | Guardian',
    weapon: 'USP-S',
    rarity: 'Common',
    image: 'https://via.placeholder.com/300x200/666666/FFFFFF?text=USP-S+Guardian',
    price: 30,
    wear: 'Field-Tested'
  },
  {
    name: 'Glock-18 | Water Elemental',
    weapon: 'Glock-18',
    rarity: 'Common',
    image: 'https://via.placeholder.com/300x200/666666/FFFFFF?text=Glock-18+Water+Elemental',
    price: 35,
    wear: 'Field-Tested'
  },

  // Uncommon Skins
  {
    name: 'AWP | Hyper Beast',
    weapon: 'AWP',
    rarity: 'Uncommon',
    image: 'https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=AWP+Hyper+Beast',
    price: 150,
    wear: 'Field-Tested'
  },
  {
    name: 'Desert Eagle | Golden Koi',
    weapon: 'Desert Eagle',
    rarity: 'Uncommon',
    image: 'https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Desert+Eagle+Golden+Koi',
    price: 120,
    wear: 'Field-Tested'
  },
  {
    name: 'M4A1-S | Hyper Beast',
    weapon: 'M4A1-S',
    rarity: 'Uncommon',
    image: 'https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=M4A1-S+Hyper+Beast',
    price: 180,
    wear: 'Field-Tested'
  },

  // Rare Skins
  {
    name: 'AK-47 | Fire Serpent',
    weapon: 'AK-47',
    rarity: 'Rare',
    image: 'https://via.placeholder.com/300x200/2196F3/FFFFFF?text=AK-47+Fire+Serpent',
    price: 500,
    wear: 'Field-Tested'
  },
  {
    name: 'AWP | Dragon Lore',
    weapon: 'AWP',
    rarity: 'Rare',
    image: 'https://via.placeholder.com/300x200/2196F3/FFFFFF?text=AWP+Dragon+Lore',
    price: 800,
    wear: 'Field-Tested'
  },
  {
    name: 'M4A4 | Howl',
    weapon: 'M4A4',
    rarity: 'Rare',
    image: 'https://via.placeholder.com/300x200/2196F3/FFFFFF?text=M4A4+Howl',
    price: 600,
    wear: 'Field-Tested'
  },

  // Epic Skins
  {
    name: 'Karambit | Fade',
    weapon: 'Knife',
    rarity: 'Epic',
    image: 'https://via.placeholder.com/300x200/9C27B0/FFFFFF?text=Karambit+Fade',
    price: 2000,
    wear: 'Factory New'
  },
  {
    name: 'M9 Bayonet | Marble Fade',
    weapon: 'Knife',
    rarity: 'Epic',
    image: 'https://via.placeholder.com/300x200/9C27B0/FFFFFF?text=M9+Bayonet+Marble+Fade',
    price: 1800,
    wear: 'Factory New'
  },

  // Legendary Skins
  {
    name: 'Butterfly Knife | Sapphire',
    weapon: 'Knife',
    rarity: 'Legendary',
    image: 'https://via.placeholder.com/300x200/FF9800/FFFFFF?text=Butterfly+Knife+Sapphire',
    price: 5000,
    wear: 'Factory New'
  },
  {
    name: 'M4A4 | Poseidon',
    weapon: 'M4A4',
    rarity: 'Legendary',
    image: 'https://via.placeholder.com/300x200/FF9800/FFFFFF?text=M4A4+Poseidon',
    price: 3000,
    wear: 'Factory New'
  }
];

// 🎁 Cases de base
const cases = [
  {
    name: 'Case Standard',
    description: 'Case de base avec des skins communs et rares',
    price: 100,
    image: 'https://via.placeholder.com/300x200/FF6B35/FFFFFF?text=Standard+Case',
    rarity: 'Common',
    items: [] // Sera rempli après création des skins
  },
  {
    name: 'Case Premium',
    description: 'Case premium avec des skins rares et épiques',
    price: 250,
    image: 'https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=Premium+Case',
    rarity: 'Uncommon',
    items: []
  },
  {
    name: 'Case Legendary',
    description: 'Case légendaire avec des skins épiques et légendaires',
    price: 500,
    image: 'https://via.placeholder.com/300x200/FFE66D/FFFFFF?text=Legendary+Case',
    rarity: 'Rare',
    items: []
  }
];

async function initializeDatabase() {
  try {
    console.log('🗄️ Initialisation de la base de données...');

    // Supprimer les données existantes
    await Skin.deleteMany({});
    await Case.deleteMany({});

    console.log('✅ Anciennes données supprimées');

    // Créer les skins
    const createdSkins = await Skin.insertMany(skins);
    console.log(`✅ ${createdSkins.length} skins créés`);

    // Organiser les skins par rareté
    const skinsByRarity = {
      Common: createdSkins.filter(skin => skin.rarity === 'Common'),
      Uncommon: createdSkins.filter(skin => skin.rarity === 'Uncommon'),
      Rare: createdSkins.filter(skin => skin.rarity === 'Rare'),
      Epic: createdSkins.filter(skin => skin.rarity === 'Epic'),
      Legendary: createdSkins.filter(skin => skin.rarity === 'Legendary')
    };

    // Configurer les cases avec leurs items
    const caseStandard = {
      ...cases[0],
      items: [
        // 70% Common, 25% Uncommon, 5% Rare
        ...skinsByRarity.Common.map(skin => ({ skinId: skin._id, dropRate: 70 / skinsByRarity.Common.length })),
        ...skinsByRarity.Uncommon.map(skin => ({ skinId: skin._id, dropRate: 25 / skinsByRarity.Uncommon.length })),
        ...skinsByRarity.Rare.map(skin => ({ skinId: skin._id, dropRate: 5 / skinsByRarity.Rare.length }))
      ]
    };

    const casePremium = {
      ...cases[1],
      items: [
        // 50% Uncommon, 35% Rare, 15% Epic
        ...skinsByRarity.Uncommon.map(skin => ({ skinId: skin._id, dropRate: 50 / skinsByRarity.Uncommon.length })),
        ...skinsByRarity.Rare.map(skin => ({ skinId: skin._id, dropRate: 35 / skinsByRarity.Rare.length })),
        ...skinsByRarity.Epic.map(skin => ({ skinId: skin._id, dropRate: 15 / skinsByRarity.Epic.length }))
      ]
    };

    const caseLegendary = {
      ...cases[2],
      items: [
        // 30% Rare, 50% Epic, 20% Legendary
        ...skinsByRarity.Rare.map(skin => ({ skinId: skin._id, dropRate: 30 / skinsByRarity.Rare.length })),
        ...skinsByRarity.Epic.map(skin => ({ skinId: skin._id, dropRate: 50 / skinsByRarity.Epic.length })),
        ...skinsByRarity.Legendary.map(skin => ({ skinId: skin._id, dropRate: 20 / skinsByRarity.Legendary.length }))
      ]
    };

    // Créer les cases
    const createdCases = await Case.insertMany([caseStandard, casePremium, caseLegendary]);
    console.log(`✅ ${createdCases.length} cases créées`);

    console.log('🎉 Base de données initialisée avec succès !');
    console.log('\n📊 Résumé :');
    console.log(`- ${createdSkins.length} skins créés`);
    console.log(`- ${createdCases.length} cases créées`);
    console.log('\n🎮 Votre plateforme CS2 est prête !');

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Exécuter si le script est appelé directement
if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase; 