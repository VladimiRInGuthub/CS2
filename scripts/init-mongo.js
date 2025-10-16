// Script d'initialisation MongoDB pour Docker
db = db.getSiblingDB('skincase');

// Créer un utilisateur pour l'application
db.createUser({
  user: 'skincase_user',
  pwd: 'skincase_password',
  roles: [
    {
      role: 'readWrite',
      db: 'skincase'
    }
  ]
});

// Créer les collections avec des index de base
db.createCollection('users');
db.createCollection('cases');
db.createCollection('skins');
db.createCollection('servers');
db.createCollection('transactions');
db.createCollection('notifications');
db.createCollection('battlepasses');
db.createCollection('userbattlepasses');
db.createCollection('premiums');

// Index pour les performances
db.users.createIndex({ "steamId": 1 }, { sparse: true });
db.users.createIndex({ "googleId": 1 }, { sparse: true });
db.users.createIndex({ "email": 1 }, { sparse: true });
db.users.createIndex({ "username": 1 }, { unique: true });
db.users.createIndex({ "isAdmin": 1 });
db.users.createIndex({ "isBanned": 1 });
db.users.createIndex({ "lastLogin": -1 });

db.cases.createIndex({ "isActive": 1 });
db.cases.createIndex({ "category": 1 });
db.cases.createIndex({ "rarity": 1 });
db.cases.createIndex({ "isFeatured": 1 });

db.skins.createIndex({ "weapon": 1 });
db.skins.createIndex({ "rarity": 1 });
db.skins.createIndex({ "price": 1 });
db.skins.createIndex({ "name": "text", "weapon": "text" });

db.servers.createIndex({ "owner": 1 });
db.servers.createIndex({ "isPublic": 1, "status": 1 });
db.servers.createIndex({ "mode": 1, "map": 1 });
db.servers.createIndex({ "lastActivity": -1 });

db.transactions.createIndex({ "userId": 1, "createdAt": -1 });
db.transactions.createIndex({ "type": 1 });
db.transactions.createIndex({ "referenceId": 1 }, { sparse: true });

db.notifications.createIndex({ "userId": 1, "createdAt": -1 });
db.notifications.createIndex({ "isRead": 1 });
db.notifications.createIndex({ "type": 1 });

db.battlepasses.createIndex({ "isActive": 1, "startDate": 1, "endDate": 1 });
db.battlepasses.createIndex({ "season": 1 });

db.userbattlepasses.createIndex({ "userId": 1, "battlepassId": 1 }, { unique: true });
db.userbattlepasses.createIndex({ "currentLevel": -1 });

db.premiums.createIndex({ "userId": 1 }, { unique: true });
db.premiums.createIndex({ "isActive": 1, "endDate": 1 });

print('✅ Base de données SkinCase initialisée avec succès');
print('👤 Utilisateur créé: skincase_user');
print('📊 Collections et index créés');
