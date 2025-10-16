const mongoose = require('mongoose');
const Battlepass = require('./models/Battlepass');

// Script d'initialisation du battlepass par défaut
const initializeBattlepass = async () => {
  try {
    console.log('🚀 Initialisation du battlepass par défaut...');
    
    // Vérifier s'il y a déjà un battlepass actif
    const existingBattlepass = await Battlepass.getActiveBattlepass();
    if (existingBattlepass) {
      console.log('✅ Battlepass actif déjà existant:', existingBattlepass.name);
      return;
    }
    
    // Créer le battlepass par défaut
    const defaultBattlepass = new Battlepass({
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
        },
        {
          level: 4,
          xpRequired: 450,
          freeRewards: [
            {
              type: 'case',
              amount: 1,
              name: 'Case Mil-Spec'
            }
          ],
          premiumRewards: [
            {
              type: 'case',
              amount: 1,
              name: 'Case Restricted'
            },
            {
              type: 'title',
              amount: 1,
              name: 'Titre: Collectionneur'
            }
          ]
        },
        {
          level: 5,
          xpRequired: 700,
          freeRewards: [
            {
              type: 'xcoins',
              amount: 100,
              name: '100 Xcoins'
            }
          ],
          premiumRewards: [
            {
              type: 'xcoins',
              amount: 200,
              name: '200 Xcoins'
            },
            {
              type: 'premium_days',
              amount: 3,
              name: '3 jours Premium'
            }
          ]
        },
        {
          level: 6,
          xpRequired: 1000,
          freeRewards: [
            {
              type: 'case',
              amount: 1,
              name: 'Case Restricted'
            }
          ],
          premiumRewards: [
            {
              type: 'case',
              amount: 1,
              name: 'Case Classified'
            },
            {
              type: 'badge',
              amount: 1,
              name: 'Badge: Expert'
            }
          ]
        },
        {
          level: 7,
          xpRequired: 1350,
          freeRewards: [
            {
              type: 'xcoins',
              amount: 125,
              name: '125 Xcoins'
            }
          ],
          premiumRewards: [
            {
              type: 'xcoins',
              amount: 250,
              name: '250 Xcoins'
            },
            {
              type: 'title',
              amount: 1,
              name: 'Titre: Maître des Cases'
            }
          ]
        },
        {
          level: 8,
          xpRequired: 1750,
          freeRewards: [
            {
              type: 'case',
              amount: 1,
              name: 'Case Classified'
            }
          ],
          premiumRewards: [
            {
              type: 'case',
              amount: 1,
              name: 'Case Covert'
            },
            {
              type: 'premium_days',
              amount: 7,
              name: '7 jours Premium'
            }
          ]
        },
        {
          level: 9,
          xpRequired: 2200,
          freeRewards: [
            {
              type: 'xcoins',
              amount: 150,
              name: '150 Xcoins'
            }
          ],
          premiumRewards: [
            {
              type: 'xcoins',
              amount: 300,
              name: '300 Xcoins'
            },
            {
              type: 'badge',
              amount: 1,
              name: 'Badge: Légende'
            }
          ]
        },
        {
          level: 10,
          xpRequired: 2700,
          freeRewards: [
            {
              type: 'case',
              amount: 1,
              name: 'Case Covert'
            }
          ],
          premiumRewards: [
            {
              type: 'case',
              amount: 1,
              name: 'Case Légendaire'
            },
            {
              type: 'title',
              amount: 1,
              name: 'Titre: Légende du Battlepass'
            },
            {
              type: 'badge',
              amount: 1,
              name: 'Badge: Champion'
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
        },
        {
          id: 'weekly_cases_5',
          name: 'Ouvrir 5 cases',
          description: 'Ouvrez 5 cases cette semaine',
          type: 'weekly',
          category: 'cases',
          requirements: { casesOpened: 5 },
          xpReward: 200,
          xcoinsReward: 50
        },
        {
          id: 'weekly_servers_10',
          name: 'Rejoindre 10 serveurs',
          description: 'Rejoignez 10 serveurs différents cette semaine',
          type: 'weekly',
          category: 'servers',
          requirements: { serversJoined: 10 },
          xpReward: 150,
          xcoinsReward: 25
        },
        {
          id: 'seasonal_level_5',
          name: 'Atteindre le niveau 5',
          description: 'Atteignez le niveau 5 dans le battlepass',
          type: 'seasonal',
          category: 'progression',
          requirements: { battlepassLevel: 5 },
          xpReward: 500,
          xcoinsReward: 100
        },
        {
          id: 'seasonal_level_10',
          name: 'Atteindre le niveau 10',
          description: 'Atteignez le niveau 10 dans le battlepass',
          type: 'seasonal',
          category: 'progression',
          requirements: { battlepassLevel: 10 },
          xpReward: 1000,
          xcoinsReward: 200
        }
      ]
    });
    
    await defaultBattlepass.save();
    console.log('✅ Battlepass par défaut créé avec succès !');
    console.log(`📊 ${defaultBattlepass.tiers.length} tiers créés`);
    console.log(`🎯 ${defaultBattlepass.missions.length} missions créées`);
    
  } catch (error) {
    console.error('❌ Erreur initialisation battlepass:', error);
  }
};

// Exécuter si appelé directement
if (require.main === module) {
  // Connexion à MongoDB
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skincase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('📦 Connexion MongoDB établie');
    return initializeBattlepass();
  })
  .then(() => {
    console.log('🎉 Initialisation terminée');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erreur:', error);
    process.exit(1);
  });
}

module.exports = initializeBattlepass;
