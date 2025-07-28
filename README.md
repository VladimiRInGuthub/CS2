# 🎮 CS2 Project - Plateforme de Cases et Skins

Une plateforme moderne de cases CS2 avec système d'authentification Steam, ouverture de cases, inventaire et interface utilisateur avancée.

## ✨ Fonctionnalités

### 🔐 Authentification
- **Connexion Steam** via OAuth
- **Connexion Google** (optionnelle)
- **Système JWT** sécurisé
- **Gestion des sessions** automatique

### 🎁 Système de Cases
- **3 types de cases** : Standard, Premium, Legendary
- **Système de probabilités** équilibré
- **Animations d'ouverture** avec modal de résultat
- **Prix variables** selon la rareté

### 🎨 Système de Skins
- **5 niveaux de rareté** : Common, Uncommon, Rare, Epic, Legendary
- **14 skins différents** avec images
- **Système de wear** (Factory New, Field-Tested, etc.)
- **Prix de marché** intégrés

### 💰 Économie Virtuelle
- **Système de coins** (monnaie virtuelle)
- **Solde utilisateur** en temps réel
- **Déduction automatique** lors de l'ouverture
- **1000 coins** de départ par utilisateur

### 🎒 Inventaire
- **Affichage des skins** obtenus
- **Filtrage par rareté**
- **Tri par date/rareté/arme**
- **Statistiques détaillées**

### 🎨 Interface Utilisateur
- **Design moderne** avec thème sombre
- **Animations fluides** et effets visuels
- **Responsive design** (mobile/desktop)
- **Effet DarkVeil** en arrière-plan

## 🚀 Installation

### Prérequis
- Node.js (v16+)
- MongoDB
- Compte Steam Developer (pour l'API)

### 1. Cloner le projet
```bash
git clone <votre-repo>
cd CS2
```

### 2. Installer les dépendances
```bash
# Backend
npm install

# Frontend
cd cs2-frontend
npm install
```

### 3. Configuration
Créer un fichier `.env` à la racine :
```env
MONGODB_URI=mongodb://localhost:27017/cs2
JWT_SECRET=votre_secret_jwt_super_securise
STEAM_API_KEY=votre_cle_api_steam
GOOGLE_CLIENT_ID=votre_client_id_google
GOOGLE_CLIENT_SECRET=votre_client_secret_google
```

### 4. Initialiser la base de données
```bash
node utils/initDatabase.js
```

### 5. Démarrer l'application
```bash
# Terminal 1 - Backend
npm start

# Terminal 2 - Frontend
cd cs2-frontend
npm start
```

## 📁 Structure du Projet

```
CS2/
├── config/
│   ├── db.js              # Configuration MongoDB
│   └── passport.js        # Configuration Passport
├── controllers/
│   └── caseController.js  # Logique des cases
├── cs2-frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── DarkVeil.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Cases.jsx
│   │   │   └── Inventory.jsx
│   │   └── App.js
│   └── package.json
├── models/
│   ├── User.js           # Modèle utilisateur
│   ├── Case.js           # Modèle case
│   └── Skin.js           # Modèle skin
├── routes/
│   ├── auth.js           # Routes authentification
│   ├── cases.js          # Routes cases
│   └── user.js           # Routes utilisateur
├── utils/
│   ├── authMiddleware.js # Middleware JWT
│   └── initDatabase.js   # Script d'initialisation
└── server.js             # Serveur principal
```

## 🎯 API Endpoints

### Authentification
- `GET /auth/steam` - Connexion Steam
- `GET /auth/steam/return` - Callback Steam
- `GET /auth/google` - Connexion Google
- `GET /auth/google/callback` - Callback Google

### Cases
- `GET /api/cases` - Liste des cases
- `GET /api/cases/:id` - Détails d'une case
- `POST /api/cases/open` - Ouvrir une case
- `GET /api/cases/stats` - Statistiques

### Utilisateur
- `GET /api/users/me` - Profil utilisateur

## 🎨 Design System

### Couleurs par Rareté
- **Common** : `#666666` (Gris)
- **Uncommon** : `#4CAF50` (Vert)
- **Rare** : `#2196F3` (Bleu)
- **Epic** : `#9C27B0` (Violet)
- **Legendary** : `#FF9800` (Orange)

### Thème
- **Fond** : Thème sombre avec effet DarkVeil
- **Accents** : Violet/Purple (`#a259ff`)
- **Textes** : Blanc et gris clair
- **Effets** : Glows et ombres

## 🔧 Technologies Utilisées

### Backend
- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **Passport.js** (Steam/Google OAuth)
- **JWT** (authentification)
- **CORS** (cross-origin)

### Frontend
- **React** (hooks, context)
- **React Router** (navigation)
- **Axios** (API calls)
- **CSS-in-JS** (styling)

## 🎮 Utilisation

### 1. Connexion
- Cliquer sur "Connectez-vous avec Steam"
- Autoriser l'application
- Redirection automatique vers le dashboard

### 2. Ouverture de Cases
- Aller dans la section "Cases"
- Choisir une case (Standard/Premium/Legendary)
- Cliquer sur "Ouvrir la case"
- Voir le résultat dans le modal

### 3. Inventaire
- Accéder à "Inventaire" depuis le dashboard
- Filtrer par rareté ou trier par date
- Voir les statistiques de collection

## 🚀 Roadmap

### Phase 1 ✅ (Terminée)
- [x] Authentification Steam
- [x] Système de cases basique
- [x] Inventaire utilisateur
- [x] Interface moderne

### Phase 2 🔄 (En cours)
- [ ] Marketplace (achat/vente)
- [ ] Animations 3D avancées
- [ ] Système de trade
- [ ] Notifications temps réel

### Phase 3 📋 (Prévue)
- [ ] Serveurs privés
- [ ] Système de tournois
- [ ] Chat intégré
- [ ] Système VIP

### Phase 4 🎯 (Futur)
- [ ] Intégration Discord
- [ ] API publique
- [ ] Mobile app
- [ ] Système de clans

## 🔒 Sécurité

- **JWT tokens** sécurisés
- **Validation des données** côté serveur
- **Protection CORS** configurée
- **Rate limiting** (à implémenter)
- **Input sanitization** (à renforcer)

## 📊 Statistiques

- **14 skins** différents
- **3 types de cases**
- **5 niveaux de rareté**
- **Système de probabilités** équilibré

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Contacter l'équipe de développement
- Consulter la documentation API

---

**🎮 Bonne chance pour vos ouvertures de cases ! 🎁**
