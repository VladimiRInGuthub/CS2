const mongoose = require('mongoose');
const Case = require('../models/Case');
const Skin = require('../models/Skin');
require('dotenv').config();

// Connexion à la base de données
mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/cs2freecase', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Données des skins
const skinsData = [
  // AK-47
  {
    name: 'AK-47 | Redline',
    weapon: 'AK-47',
    rarity: 'Rare',
    image: 'https://via.placeholder.com/300x200/FF5722/FFFFFF?text=AK-47+Redline',
    price: 1500
  },
  {
    name: 'AK-47 | Fire Serpent',
    weapon: 'AK-47',
    rarity: 'Legendary',
    image: 'https://via.placeholder.com/300x200/FF9800/FFFFFF?text=AK-47+Fire+Serpent',
    price: 5000
  },
  {
    name: 'AK-47 | Elite Build',
    weapon: 'AK-47',
    rarity: 'Common',
    image: 'https://via.placeholder.com/300x200/666666/FFFFFF?text=AK-47+Elite+Build',
    price: 200
  },
  
  // M4A4
  {
    name: 'M4A4 | Howl',
    weapon: 'M4A4',
    rarity: 'Legendary',
    image: 'https://via.placeholder.com/300x200/FF5722/FFFFFF?text=M4A4+Howl',
    price: 8000
  },
  {
    name: 'M4A4 | Desolate Space',
    weapon: 'M4A4',
    rarity: 'Epic',
    image: 'https://via.placeholder.com/300x200/9C27B0/FFFFFF?text=M4A4+Desolate+Space',
    price: 3000
  },
  {
    name: 'M4A4 | Evil Daimyo',
    weapon: 'M4A4',
    rarity: 'Uncommon',
    image: 'https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=M4A4+Evil+Daimyo',
    price: 800
  },
  
  // AWP
  {
    name: 'AWP | Dragon Lore',
    weapon: 'AWP',
    rarity: 'Legendary',
    image: 'https://via.placeholder.com/300x200/FFD700/FFFFFF?text=AWP+Dragon+Lore',
    price: 15000
  },
  {
    name: 'AWP | Asiimov',
    weapon: 'AWP',
    rarity: 'Epic',
    image: 'https://via.placeholder.com/300x200/FF5722/FFFFFF?text=AWP+Asiimov',
    price: 4000
  },
  {
    name: 'AWP | Hyper Beast',
    weapon: 'AWP',
    rarity: 'Rare',
    image: 'https://via.placeholder.com/300x200/2196F3/FFFFFF?text=AWP+Hyper+Beast',
    price: 2000
  },
  
  // Desert Eagle
  {
    name: 'Desert Eagle | Golden Koi',
    weapon: 'Desert Eagle',
    rarity: 'Epic',
    image: 'https://via.placeholder.com/300x200/FFD700/FFFFFF?text=Deagle+Golden+Koi',
    price: 2500
  },
  {
    name: 'Desert Eagle | Blaze',
    weapon: 'Desert Eagle',
    rarity: 'Rare',
    image: 'https://via.placeholder.com/300x200/FF5722/FFFFFF?text=Deagle+Blaze',
    price: 1800
  },
  
  // USP-S
  {
    name: 'USP-S | Kill Confirmed',
    weapon: 'USP-S',
    rarity: 'Rare',
    image: 'https://via.placeholder.com/300x200/2196F3/FFFFFF?text=USP-S+Kill+Confirmed',
    price: 1200
  },
  {
    name: 'USP-S | Guardian',
    weapon: 'USP-S',
    rarity: 'Uncommon',
    image: 'https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=USP-S+Guardian',
    price: 600
  },
  
  // Knives
  {
    name: 'Karambit | Fade',
    weapon: 'Knife',
    rarity: 'Legendary',
    image: 'https://via.placeholder.com/300x200/FF9800/FFFFFF?text=Karambit+Fade',
    price: 20000
  },
  {
    name: 'M9 Bayonet | Crimson Web',
    weapon: 'Knife',
    rarity: 'Epic',
    image: 'https://via.placeholder.com/300x200/9C27B0/FFFFFF?text=M9+Crimson+Web',
    price: 8000
  },
  
  // Gloves
  {
    name: 'Specialist Gloves | Crimson Kimono',
    weapon: 'Gloves',
    rarity: 'Legendary',
    image: 'https://via.placeholder.com/300x200/FF5722/FFFFFF?text=Crimson+Kimono+Gloves',
    price: 12000
  },
  {
    name: 'Hand Wraps | Leather',
    weapon: 'Gloves',
    rarity: 'Rare',
    image: 'https://via.placeholder.com/300x200/8D6E63/FFFFFF?text=Leather+Hand+Wraps',
    price: 1500
  }
];

// Données des cases
const casesData = [
  {
    name: 'Case Standard',
    description: 'Une case classique avec des skins de qualité variable',
    price: 500,
    image: 'https://via.placeholder.com/300x200/666666/FFFFFF?text=Standard+Case',
    rarity: 'Common',
    items: [
      { skinId: null, dropRate: 40 }, // Sera remplacé par l'ID réel
      { skinId: null, dropRate: 30 },
      { skinId: null, dropRate: 20 },
      { skinId: null, dropRate: 8 },
      { skinId: null, dropRate: 2 }
    ]
  },
  {
    name: 'Case Premium',
    description: 'Une case premium avec des skins de meilleure qualité',
    price: 1000,
    image: 'https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Premium+Case',
    rarity: 'Uncommon',
    items: [
      { skinId: null, dropRate: 30 },
      { skinId: null, dropRate: 35 },
      { skinId: null, dropRate: 25 },
      { skinId: null, dropRate: 8 },
      { skinId: null, dropRate: 2 }
    ]
  },
  {
    name: 'Case Elite',
    description: 'Une case d\'élite avec des skins rares et épiques',
    price: 2000,
    image: 'https://via.placeholder.com/300x200/2196F3/FFFFFF?text=Elite+Case',
    rarity: 'Rare',
    items: [
      { skinId: null, dropRate: 20 },
      { skinId: null, dropRate: 35 },
      { skinId: null, dropRate: 30 },
      { skinId: null, dropRate: 12 },
      { skinId: null, dropRate: 3 }
    ]
  },
  {
    name: 'Case Legendary',
    description: 'Une case légendaire avec des skins de la plus haute qualité',
    price: 5000,
    image: 'https://via.placeholder.com/300x200/FF9800/FFFFFF?text=Legendary+Case',
    rarity: 'Epic',
    items: [
      { skinId: null, dropRate: 15 },
      { skinId: null, dropRate: 30 },
      { skinId: null, dropRate: 35 },
      { skinId: null, dropRate: 15 },
      { skinId: null, dropRate: 5 }
    ]
  }
];

async function seedData() {
  try {
    console.log('🌱 Début du seeding des données...');
    
    // Supprimer les données existantes
    await Case.deleteMany({});
    await Skin.deleteMany({});
    console.log('🗑️ Anciennes données supprimées');
    
    // Créer les skins
    const createdSkins = await Skin.insertMany(skinsData);
    console.log(`✅ ${createdSkins.length} skins créées`);
    
    // Organiser les skins par rareté
    const skinsByRarity = {
      Common: createdSkins.filter(skin => skin.rarity === 'Common'),
      Uncommon: createdSkins.filter(skin => skin.rarity === 'Uncommon'),
      Rare: createdSkins.filter(skin => skin.rarity === 'Rare'),
      Epic: createdSkins.filter(skin => skin.rarity === 'Epic'),
      Legendary: createdSkins.filter(skin => skin.rarity === 'Legendary')
    };
    
    // Créer les cases avec les bons IDs de skins
    const casesWithSkins = casesData.map((caseData, index) => {
      const caseCopy = { ...caseData };
      
      // Assigner des skins selon la rareté de la case
      const rarityOrder = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
      caseCopy.items = caseCopy.items.map((item, itemIndex) => {
        const rarity = rarityOrder[itemIndex];
        const availableSkins = skinsByRarity[rarity];
        
        if (availableSkins && availableSkins.length > 0) {
          // Sélectionner un skin aléatoire de cette rareté
          const randomSkin = availableSkins[Math.floor(Math.random() * availableSkins.length)];
          return {
            skinId: randomSkin._id,
            dropRate: item.dropRate
          };
        }
        
        // Fallback: utiliser le premier skin disponible
        const allSkins = Object.values(skinsByRarity).flat();
        return {
          skinId: allSkins[0]._id,
          dropRate: item.dropRate
        };
      });
      
      return caseCopy;
    });
    
    const createdCases = await Case.insertMany(casesWithSkins);
    console.log(`✅ ${createdCases.length} cases créées`);
    
    console.log('🎉 Seeding terminé avec succès !');
    console.log('\n📊 Résumé:');
    console.log(`- ${createdSkins.length} skins créées`);
    console.log(`- ${createdCases.length} cases créées`);
    
    // Afficher quelques exemples
    console.log('\n🎁 Exemples de cases:');
    createdCases.forEach(caseItem => {
      console.log(`- ${caseItem.name} (${caseItem.price} coins)`);
    });
    
    console.log('\n🔫 Exemples de skins:');
    Object.entries(skinsByRarity).forEach(([rarity, skins]) => {
      if (skins.length > 0) {
        console.log(`- ${rarity}: ${skins[0].name}`);
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Connexion à la base de données fermée');
  }
}

// Exécuter le seeding si le script est appelé directement
if (require.main === module) {
  seedData();
}

module.exports = seedData; 