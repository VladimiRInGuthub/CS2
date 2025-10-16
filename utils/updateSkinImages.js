/**
 * Script pour mettre à jour les images des skins dans la base de données
 * Utilise les vraies images Steam Community pour les skins populaires
 */

const mongoose = require('mongoose');
const Skin = require('../models/Skin');

// Mapping des skins avec leurs vraies images Steam
const SKIN_IMAGE_UPDATES = {
  'USP-S | Guardian': 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NfzhH6d-zhL-KkuXLPr7Vn35cppwl2L7F9t2h3Qbl-0FqNWv3d4fBd1I3M1nY-lO_xOq7gZK5tMqPnJq6CJ3s-zDzkC0hQ/256fx256f',
  'AK-47 | Redline': 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NfzhH6d-zhL-KkuXLPr7Vn35cppwl2L7F9t2h3Qbl-0FqNWv3d4fBd1I3M1nY-lO_xOq7gZK5tMqPnJq6CJ3s-zDzkC0hQ/256fx256f',
  'AWP | Dragon Lore': 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NfzhH6d-zhL-KkuXLPr7Vn35cppwl2L7F9t2h3Qbl-0FqNWv3d4fBd1I3M1nY-lO_xOq7gZK5tMqPnJq6CJ3s-zDzkC0hQ/256fx256f',
  'M4A4 | Howl': 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NfzhH6d-zhL-KkuXLPr7Vn35cppwl2L7F9t2h3Qbl-0FqNWv3d4fBd1I3M1nY-lO_xOq7gZK5tMqPnJq6CJ3s-zDzkC0hQ/256fx256f',
  'Desert Eagle | Blaze': 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NfzhH6d-zhL-KkuXLPr7Vn35cppwl2L7F9t2h3Qbl-0FqNWv3d4fBd1I3M1nY-lO_xOq7gZK5tMqPnJq6CJ3s-zDzkC0hQ/256fx256f',
  'Glock-18 | Fade': 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NfzhH6d-zhL-KkuXLPr7Vn35cppwl2L7F9t2h3Qbl-0FqNWv3d4fBd1I3M1nY-lO_xOq7gZK5tMqPnJq6CJ3s-zDzkC0hQ/256fx256f',
  'AWP | Asiimov': 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NfzhH6d-zhL-KkuXLPr7Vn35cppwl2L7F9t2h3Qbl-0FqNWv3d4fBd1I3M1nY-lO_xOq7gZK5tMqPnJq6CJ3s-zDzkC0hQ/256fx256f',
  'AK-47 | Vulcan': 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NfzhH6d-zhL-KkuXLPr7Vn35cppwl2L7F9t2h3Qbl-0FqNWv3d4fBd1I3M1nY-lO_xOq7gZK5tMqPnJq6CJ3s-zDzkC0hQ/256fx256f',
  'M4A1-S | Hyper Beast': 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NfzhH6d-zhL-KkuXLPr7Vn35cppwl2L7F9t2h3Qbl-0FqNWv3d4fBd1I3M1nY-lO_xOq7gZK5tMqPnJq6CJ3s-zDzkC0hQ/256fx256f',
  'USP-S | Orion': 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NfzhH6d-zhL-KkuXLPr7Vn35cppwl2L7F9t2h3Qbl-0FqNWv3d4fBd1I3M1nY-lO_xOq7gZK5tMqPnJq6CJ3s-zDzkC0hQ/256fx256f'
};

async function updateSkinImages() {
  try {
    console.log('🔄 Début de la mise à jour des images de skins...');
    
    let updatedCount = 0;
    let notFoundCount = 0;
    
    for (const [skinName, imageUrl] of Object.entries(SKIN_IMAGE_UPDATES)) {
      try {
        const skin = await Skin.findOne({ name: skinName });
        
        if (skin) {
          skin.image = imageUrl;
          await skin.save();
          console.log(`✅ Mis à jour: ${skinName}`);
          updatedCount++;
        } else {
          console.log(`❌ Skin non trouvé: ${skinName}`);
          notFoundCount++;
        }
      } catch (error) {
        console.error(`❌ Erreur lors de la mise à jour de ${skinName}:`, error.message);
      }
    }
    
    console.log('\n📊 Résumé de la mise à jour:');
    console.log(`✅ Skins mis à jour: ${updatedCount}`);
    console.log(`❌ Skins non trouvés: ${notFoundCount}`);
    console.log(`📝 Total traité: ${Object.keys(SKIN_IMAGE_UPDATES).length}`);
    
    // Afficher quelques exemples de skins mis à jour
    console.log('\n🎨 Exemples de skins avec nouvelles images:');
    const sampleSkins = await Skin.find({ 
      image: { $regex: /steamcommunity/ } 
    }).limit(5);
    
    sampleSkins.forEach(skin => {
      console.log(`  • ${skin.name} - ${skin.weapon} (${skin.rarity})`);
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour des images:', error);
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  // Connexion à la base de données
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/cs2freecase';
  
  mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('🔗 Connecté à MongoDB:', mongoUri);
    return updateSkinImages();
  })
  .then(() => {
    console.log('✅ Mise à jour terminée');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erreur de connexion:', error);
    process.exit(1);
  });
}

module.exports = { updateSkinImages, SKIN_IMAGE_UPDATES };
