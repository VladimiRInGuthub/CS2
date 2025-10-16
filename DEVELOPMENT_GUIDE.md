# 🚀 Guide de Développement - SkinCase

## Architecture du Projet

Le projet SkinCase utilise une architecture **full-stack** avec deux serveurs séparés :

- **Backend** (Node.js/Express) : Port 5000 - API et authentification
- **Frontend** (React) : Port 3000 - Interface utilisateur

## 🛠️ Démarrage Rapide

### Option 1 : Démarrage automatique (Recommandé)
```bash
npm run dev:full
```
Cette commande démarre automatiquement les deux serveurs.

### Option 2 : Démarrage manuel
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
npm run frontend
```

## 🌐 URLs d'Accès

- **Frontend (Interface)** : http://localhost:3000
- **Backend (API)** : http://localhost:5000
- **Page de connexion** : http://localhost:3000/login
- **Dashboard** : http://localhost:3000/dashboard

## 🔧 Configuration

### Variables d'Environnement
Créez un fichier `.env` à la racine du projet :

```env
# Base de données
MONGODB_URI=mongodb://localhost:27017/skincase

# Sessions
SESSION_SECRET=votre_secret_session_ici

# URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000

# APIs optionnelles
STEAM_API_KEY=votre_cle_steam
GOOGLE_CLIENT_ID=votre_google_client_id
STRIPE_SECRET_KEY=votre_cle_stripe
CSGOSKINS_API_KEY=votre_cle_csgoskins
```

### Frontend React
Le frontend utilise les variables d'environnement avec le préfixe `REACT_APP_` :

```env
# Dans cs2-frontend/.env.local
REACT_APP_API_URL=http://localhost:5000
REACT_APP_CSGOSKINS_API_KEY=votre_cle_api
```

## 🗄️ Base de Données

### Initialisation
```bash
# Créer un utilisateur admin
npm run create-admin

# Peupler la base avec des données de test
npm run seed
```

## 🚨 Résolution des Problèmes

### "Cannot GET /login" sur le port 5000
**Problème** : Vous accédez à `http://localhost:5000/login` au lieu de `http://localhost:3000/login`

**Solution** : 
- Utilisez `http://localhost:3000/login` pour l'interface
- Ou utilisez `http://localhost:5000/login` qui redirige automatiquement vers le frontend

### CORS Errors
**Problème** : Erreurs de CORS entre frontend et backend

**Solution** : Vérifiez que les URLs dans `.env` sont correctes :
```env
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
```

### Session non persistante
**Problème** : Déconnexion automatique

**Solution** : Vérifiez que `withCredentials: true` est configuré dans les appels API

## 📁 Structure des Dossiers

```
CS2/
├── server.js                 # Serveur backend principal
├── start-dev.js             # Script de démarrage automatique
├── config/                  # Configuration backend
├── routes/                  # Routes API
├── models/                  # Modèles MongoDB
├── middleware/              # Middlewares Express
├── cs2-frontend/           # Application React
│   ├── src/
│   │   ├── components/     # Composants React
│   │   ├── pages/          # Pages de l'application
│   │   ├── config/         # Configuration frontend
│   │   └── utils/          # Utilitaires
│   └── public/
└── utils/                  # Utilitaires backend
```

## 🔄 Workflow de Développement

1. **Démarrer les serveurs** : `npm run dev:full`
2. **Développer** : Modifiez les fichiers selon vos besoins
3. **Tester** : Accédez à http://localhost:3000
4. **Debug** : Consultez les logs dans les terminaux

## 🚀 Déploiement

### Build de Production
```bash
# Build du frontend
npm run frontend:build

# Démarrage en production
npm start
```

### Docker
```bash
# Build et démarrage avec Docker
docker-compose up --build
```

## 📞 Support

En cas de problème :
1. Vérifiez que MongoDB est démarré
2. Vérifiez les variables d'environnement
3. Consultez les logs des serveurs
4. Redémarrez les serveurs si nécessaire
