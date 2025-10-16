# 🎯 SkinCase - CS2 Case Opening & Servers

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-18.2.0-blue)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green)](https://www.mongodb.com/)

**SkinCase** est une plateforme web professionnelle dédiée à **Counter-Strike 2** permettant aux joueurs d'ouvrir des cases authentiques, de créer des serveurs privés et de gérer leur inventaire de skins avec un skinchanger intégré.

## ✨ Fonctionnalités

### 🎮 Expérience de Jeu
- **Ouverture de cases authentiques** avec animations immersives
- **Skins réels CS2** via l'API CSGOSkins.gg
- **Skinchanger intégré** avec loadouts personnalisés
- **Serveurs CS2 privés** avec création et gestion
- **Battlepass saisonnier** avec missions et récompenses

### 💰 Système de Monétisation
- **Monnaie virtuelle Xcoins** pour toutes les transactions
- **Intégration Stripe** pour les achats réels
- **Packages premium** avec avantages exclusifs
- **Système de bonus** quotidien et parrainage

### 👥 Gestion des Utilisateurs
- **Authentification multi-providers** (Steam, Google, Email)
- **Profils complets** avec statistiques et achievements
- **Système de niveaux** et progression XP
- **Notifications in-app** et préférences

### 🛠️ Administration
- **Panel admin complet** avec statistiques en temps réel
- **Gestion des utilisateurs** et modération
- **CRUD pour cases et skins**
- **Monitoring et logs** détaillés

### 🎨 Interface Utilisateur
- **Design Dark Veil** avec effets visuels immersifs
- **Responsive design** mobile/tablet/desktop
- **Animations fluides** avec Framer Motion
- **Accessibilité complète** (ARIA, navigation clavier)

## 🚀 Démarrage Rapide

### Prérequis
- **Node.js** 18.0.0 ou supérieur
- **MongoDB** 7.0 ou supérieur
- **Redis** 7.2 ou supérieur (optionnel)
- **Git**

### Installation

1. **Cloner le repository**
```bash
git clone https://github.com/votre-username/skincase.git
cd skincase
```

2. **Configuration de l'environnement**
```bash
cp .env.example .env
# Éditer .env avec vos configurations
```

3. **Installation des dépendances**
```bash
# Backend
npm install

# Frontend
cd cs2-frontend
npm install
cd ..
```

4. **Démarrage en développement**
```bash
# Démarrer MongoDB et Redis (si installés localement)
# Puis démarrer les serveurs

# Backend
npm run dev

# Frontend (dans un autre terminal)
cd cs2-frontend
npm start
```

### Déploiement avec Docker

```bash
# Développement
docker-compose up -d

# Production
docker-compose -f docker-compose.prod.yml up -d
```

## 📁 Structure du Projet

```
skincase/
├── 📁 cs2-frontend/          # Application React
│   ├── 📁 src/
│   │   ├── 📁 components/    # Composants réutilisables
│   │   ├── 📁 pages/         # Pages de l'application
│   │   ├── 📁 hooks/         # Hooks personnalisés
│   │   ├── 📁 services/      # Services API
│   │   ├── 📁 utils/         # Utilitaires
│   │   └── 📁 i18n/          # Traductions FR/EN
│   ├── 📁 public/            # Assets statiques
│   └── package.json
├── 📁 models/                # Schémas MongoDB
├── 📁 routes/                # Routes API Express
├── 📁 middleware/            # Middlewares personnalisés
├── 📁 utils/                 # Utilitaires backend
├── 📁 scripts/               # Scripts d'initialisation
├── 📁 monitoring/            # Configuration monitoring
├── 📁 nginx/                 # Configuration Nginx
├── server.js                 # Serveur Express principal
├── package.json
├── docker-compose.yml        # Environnement de développement
├── docker-compose.prod.yml   # Environnement de production
└── README.md
```

## 🔧 Configuration

### Variables d'Environnement

Créez un fichier `.env` basé sur `.env.example` :

```env
# Backend Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/skincase

# Session Management
SESSION_SECRET=your_super_secret_session_key_here

# URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000

# OAuth Providers
STEAM_API_KEY=your_steam_api_key_here
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Email Service
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your_mailtrap_username
EMAIL_PASS=your_mailtrap_password
EMAIL_FROM=noreply@skincase.com

# Stripe Payment Gateway
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# CSGOSkins.gg API
REACT_APP_CSGOSKINS_API_KEY=your_csgoskins_api_key_here
```

### Clés API Requises

1. **Steam Web API** - [Steam Developer](https://steamcommunity.com/dev/apikey)
2. **Google OAuth** - [Google Cloud Console](https://console.cloud.google.com/)
3. **Stripe** - [Stripe Dashboard](https://dashboard.stripe.com/)
4. **CSGOSkins.gg** - [CSGOSkins API](https://csgoskins.gg/api)

## 🎮 Utilisation

### Pour les Joueurs

1. **Inscription/Connexion**
   - Créer un compte avec email, Steam ou Google
   - Vérifier l'email (si inscription par email)
   - Compléter le profil

2. **Ouverture de Cases**
   - Choisir une case dans la boutique
   - Utiliser les Xcoins pour acheter
   - Profiter de l'animation d'ouverture
   - Récupérer le skin dans l'inventaire

3. **Gestion de l'Inventaire**
   - Voir tous les skins obtenus
   - Filtrer par arme, rareté, qualité
   - Marquer les favoris
   - Voir les statistiques de valeur

4. **Skinchanger**
   - Équiper des skins par slot d'arme
   - Créer des loadouts personnalisés
   - Synchroniser avec les serveurs

5. **Serveurs CS2**
   - Créer un serveur privé
   - Rejoindre des serveurs publics
   - Configurer les paramètres de jeu

### Pour les Administrateurs

1. **Panel Admin**
   - Accéder à `/admin` (nécessite les droits admin)
   - Voir les statistiques globales
   - Gérer les utilisateurs

2. **Gestion du Contenu**
   - Créer/modifier des cases
   - Gérer les skins
   - Configurer le battlepass

3. **Modération**
   - Bannir/débannir des utilisateurs
   - Gérer les transactions
   - Voir les logs de sécurité

## 🛠️ Développement

### Scripts Disponibles

```bash
# Backend
npm run dev          # Démarrage en développement
npm run build        # Build de production
npm run start        # Démarrage en production
npm run test         # Tests unitaires

# Frontend
cd cs2-frontend
npm start            # Démarrage en développement
npm run build        # Build de production
npm test             # Tests unitaires
```

### Architecture Technique

#### Backend (Node.js + Express)
- **Framework** : Express.js
- **Base de données** : MongoDB avec Mongoose
- **Cache** : Redis (optionnel)
- **Authentification** : Passport.js (Steam, Google, Local)
- **Paiements** : Stripe
- **Sécurité** : Helmet, Rate Limiting, CSRF Protection
- **Monitoring** : Prometheus + Grafana

#### Frontend (React)
- **Framework** : React 18 avec Hooks
- **Routing** : React Router v6
- **État** : Context API + Hooks
- **Animations** : Framer Motion
- **Charts** : Recharts
- **Internationalisation** : react-i18next
- **Build** : Create React App

#### Base de Données
- **MongoDB** : Documents JSON flexibles
- **Index** : Optimisés pour les performances
- **Schémas** : Validation stricte avec Mongoose

## 🔒 Sécurité

### Mesures Implémentées
- **Rate Limiting** par endpoint et IP
- **Sanitization** des entrées utilisateur
- **Protection CSRF** avec tokens
- **Headers de sécurité** (Helmet)
- **Validation stricte** des données
- **Chiffrement** des mots de passe (bcrypt)
- **Sessions sécurisées** avec expiration

### Bonnes Pratiques
- Variables d'environnement pour les secrets
- HTTPS obligatoire en production
- Logs de sécurité détaillés
- Monitoring des tentatives d'intrusion
- Sauvegarde régulière des données

## 📊 Monitoring

### Métriques Surveillées
- **Performance** : Temps de réponse, utilisation CPU/RAM
- **Sécurité** : Tentatives d'intrusion, rate limiting
- **Business** : Utilisateurs actifs, transactions, cases ouvertes
- **Infrastructure** : État des services, connexions DB

### Outils
- **Prometheus** : Collecte des métriques
- **Grafana** : Visualisation des données
- **Logs** : Système de logging structuré
- **Health Checks** : Vérification de l'état des services

## 🚀 Déploiement

### Environnements

#### Développement
```bash
docker-compose up -d
```

#### Production
```bash
# Build
./build.sh

# Déploiement
docker-compose -f docker-compose.prod.yml up -d
```

### Hébergement Recommandé

#### Frontend
- **Vercel** (recommandé)
- **Netlify**
- **AWS S3 + CloudFront**

#### Backend
- **Railway**
- **Render**
- **AWS EC2**
- **DigitalOcean Droplet**

#### Base de Données
- **MongoDB Atlas** (recommandé)
- **AWS DocumentDB**
- **Self-hosted MongoDB**

## 🧪 Tests

### Tests Unitaires
```bash
# Backend
npm test

# Frontend
cd cs2-frontend
npm test
```

### Tests E2E
```bash
# Tests critiques (login, case opening, payment)
npm run test:e2e
```

### Tests de Performance
```bash
# Lighthouse audit
npm run lighthouse

# Load testing
npm run load-test
```

## 📚 Documentation API

### Endpoints Principaux

#### Authentification
- `POST /auth/register` - Inscription
- `POST /auth/login` - Connexion
- `GET /auth/steam` - OAuth Steam
- `GET /auth/google` - OAuth Google

#### Cases
- `GET /api/cases` - Liste des cases
- `POST /api/cases/:id/open` - Ouvrir une case

#### Utilisateurs
- `GET /api/users/me` - Profil utilisateur
- `PUT /api/users/me` - Mettre à jour le profil

#### Serveurs
- `GET /api/servers` - Liste des serveurs
- `POST /api/servers` - Créer un serveur

### Documentation Complète
Voir [API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md) pour la documentation complète de l'API.

## 🤝 Contribution

### Comment Contribuer

1. **Fork** le projet
2. **Créer** une branche feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** les changements (`git commit -m 'Add some AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrir** une Pull Request

### Standards de Code
- **ESLint** + **Prettier** pour le formatage
- **Conventional Commits** pour les messages
- **Tests** obligatoires pour les nouvelles fonctionnalités
- **Documentation** mise à jour

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🆘 Support

### Documentation
- [Guide Utilisateur](./docs/USER_GUIDE.md)
- [Guide Administrateur](./docs/ADMIN_GUIDE.md)
- [FAQ](./docs/FAQ.md)

### Contact
- **Email** : support@skincase.com
- **Discord** : [Serveur SkinCase](https://discord.gg/skincase)
- **Issues** : [GitHub Issues](https://github.com/votre-username/skincase/issues)

## 🎉 Remerciements

- **CSGOSkins.gg** pour l'API des skins
- **Steam** pour l'authentification OAuth
- **Stripe** pour les paiements
- **Communauté CS2** pour les retours et suggestions

---

**SkinCase** - *L'expérience ultime de case opening pour Counter-Strike 2* 🎮✨