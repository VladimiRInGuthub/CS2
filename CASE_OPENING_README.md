# 🎁 Système d'Ouverture de Cases CS2

Ce projet implémente un système d'ouverture de cases similaire à celui de hellcase.com avec des animations et des effets visuels modernes.

## ✨ Fonctionnalités

### 🎲 Animation d'Ouverture
- **Roulette animée** : Animation fluide avec 50 items qui défilent
- **Effets visuels** : Glow, couleurs par rareté, animations CSS
- **Durée variable** : Animation de 4-6 secondes pour plus de suspense
- **Indicateur central** : Ligne de sélection claire

### 📊 Statistiques et Historique
- **Historique complet** : Toutes les ouvertures de cases
- **Statistiques détaillées** : Répartition par rareté, coûts, etc.
- **Suivi des dépenses** : Total dépensé et coût moyen par case
- **Pourcentages de rareté** : Calcul automatique des chances

### 🎯 Système de Probabilités
- **Drop rates configurables** : Chaque skin a sa propre probabilité
- **Raretés équilibrées** : Common (40%) → Legendary (2%)
- **Cases spécialisées** : Différentes cases avec différentes raretés

## 🚀 Installation et Configuration

### 1. Installation des dépendances
```bash
npm install
```

### 2. Configuration de la base de données
Créez un fichier `.env` à la racine du projet :
```env
MONGODB_URI=mongodb://localhost:27017/cs2-cases
JWT_SECRET=votre_secret_jwt
```

### 3. Seeding des données
```bash
npm run seed
```
Cela va créer :
- 16 skins de différentes raretés
- 4 cases avec différentes probabilités
- Données de test pour commencer

### 4. Démarrage du serveur
```bash
# Mode développement
npm run dev

# Mode production
npm start
```

### 5. Démarrage du frontend
```bash
cd cs2-frontend
npm install
npm start
```

## 🎮 Utilisation

### Ouverture d'une Case
1. **Sélectionner une case** : Cliquez sur une case dans la liste
2. **Confirmer l'ouverture** : Vérifiez le coût et votre solde
3. **Animation** : Regardez la roulette tourner pendant 4-6 secondes
4. **Résultat** : Découvrez votre skin avec des effets visuels

### Consultation des Statistiques
1. **Bouton Historique** : Cliquez sur "📊 Voir l'historique"
2. **Statistiques globales** : Cases ouvertes, dépenses, skins obtenus
3. **Répartition par rareté** : Pourcentages et nombres de skins
4. **Historique détaillé** : Liste des 50 dernières ouvertures

## 🎨 Design et UX

### Couleurs par Rareté
- **Common** : Gris (#666666)
- **Uncommon** : Vert (#4CAF50)
- **Rare** : Bleu (#2196F3)
- **Epic** : Violet (#9C27B0)
- **Legendary** : Orange (#FF9800)

### Effets Visuels
- **Glow effects** : Bordures lumineuses selon la rareté
- **Animations CSS** : Transitions fluides et hover effects
- **Backdrop blur** : Effet de flou en arrière-plan
- **Gradients** : Dégradés modernes pour les boutons

## 📁 Structure des Fichiers

```
CS2/
├── controllers/
│   └── caseController.js          # Logique d'ouverture des cases
├── models/
│   ├── Case.js                    # Modèle des cases
│   ├── Skin.js                    # Modèle des skins
│   └── User.js                    # Modèle utilisateur avec historique
├── routes/
│   └── cases.js                   # Routes API pour les cases
├── cs2-frontend/src/
│   ├── components/
│   │   ├── CaseOpening.jsx        # Composant d'animation d'ouverture
│   │   └── CaseHistory.jsx        # Composant d'historique
│   └── pages/
│       └── Cases.jsx              # Page principale des cases
└── utils/
    └── seedData.js                # Script de seeding des données
```

## 🔧 API Endpoints

### Cases
- `GET /api/cases` - Liste toutes les cases
- `GET /api/cases/:id` - Détails d'une case
- `POST /api/cases/open` - Ouvrir une case
- `GET /api/cases/stats` - Statistiques de l'utilisateur
- `GET /api/cases/history` - Historique des ouvertures
- `GET /api/cases/user-stats` - Statistiques détaillées

### Réponse d'ouverture de case
```json
{
  "success": true,
  "skin": {
    "name": "AK-47 | Fire Serpent",
    "weapon": "AK-47",
    "rarity": "Legendary",
    "image": "url_image",
    "price": 5000
  },
  "newBalance": 4500,
  "caseName": "Case Legendary",
  "cost": 500,
  "message": "Félicitations ! Vous avez obtenu AK-47 | Fire Serpent (Legendary)",
  "stats": {
    "totalCasesOpened": 15,
    "totalSpent": 7500,
    "totalSkinsObtained": 15,
    "rarityBreakdown": {
      "Common": 6,
      "Uncommon": 4,
      "Rare": 3,
      "Epic": 1,
      "Legendary": 1
    }
  }
}
```

## 🎯 Personnalisation

### Ajouter de nouvelles Cases
1. Modifiez `utils/seedData.js`
2. Ajoutez vos cases dans `casesData`
3. Exécutez `npm run seed`

### Modifier les Probabilités
1. Éditez les `dropRate` dans les cases
2. Les pourcentages doivent totaliser 100%
3. Redémarrez le serveur

### Changer les Couleurs
1. Modifiez les fonctions `getRarityColor()` dans les composants
2. Ajustez les couleurs selon vos préférences

## 🐛 Dépannage

### Problèmes courants
- **Base de données non connectée** : Vérifiez MONGODB_URI dans .env
- **Pas de cases affichées** : Exécutez `npm run seed`
- **Erreurs CORS** : Vérifiez la configuration du serveur
- **Animations lentes** : Vérifiez les performances du navigateur

### Logs utiles
```bash
# Voir les logs du serveur
npm run dev

# Vérifier la base de données
mongo cs2-cases
db.cases.find()
db.skins.find()
```

## 🎉 Fonctionnalités Avancées

### Futures Améliorations
- [ ] Système de trade entre utilisateurs
- [ ] Cases saisonnières et événements
- [ ] Système de paris et de défis
- [ ] Intégration Steam pour les skins réels
- [ ] Système de clans et de compétitions
- [ ] Notifications en temps réel
- [ ] Système de récompenses quotidiennes

### Optimisations Possibles
- [ ] Cache Redis pour les performances
- [ ] WebSockets pour les mises à jour en temps réel
- [ ] CDN pour les images de skins
- [ ] Compression des assets frontend
- [ ] Lazy loading des composants

---

**Développé avec ❤️ pour la communauté CS2** 