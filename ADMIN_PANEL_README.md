# 🔐 Panel Admin CS2 - Guide d'Utilisation

## 📋 Vue d'ensemble

Le panel admin est une interface sécurisée permettant de gérer les utilisateurs, donner des items et consulter les statistiques de la plateforme CS2.

## 🚀 Installation et Configuration

### 1. Installation des dépendances

```bash
npm install
```

### 2. Création du premier administrateur

```bash
npm run create-admin
```

Suivez les instructions pour créer votre compte admin :
- Nom d'utilisateur admin
- Mot de passe admin

### 3. Démarrage du serveur

```bash
npm start
```

### 4. Accès au panel admin

Rendez-vous sur : `http://localhost:3000/admin`

## 🎨 Interface Utilisateur

### Design Liquid Glass
- Interface moderne avec effet de verre liquide
- Animations fluides et transitions
- Design responsive (mobile/desktop)
- Thème sombre avec accents colorés

### Sections principales :
1. **📊 Tableau de bord** - Statistiques générales
2. **👥 Utilisateurs** - Gestion des comptes
3. **🎁 Give Items** - Distribution d'items

## 🔧 Fonctionnalités

### 📊 Tableau de Bord
- Nombre total d'utilisateurs
- Nombre de skins et cases
- Coins en circulation
- Top utilisateurs par coins
- Utilisateurs récents

### 👥 Gestion des Utilisateurs
- Liste paginée des utilisateurs
- Recherche par nom d'utilisateur
- Donner/retirer le statut admin
- Suppression d'utilisateurs
- Affichage des coins et statut

### 🎁 Give Items
- **Donner des coins** : Spécifiez l'ID utilisateur et le montant
- **Donner des skins** : Sélectionnez l'utilisateur et le skin
- Validation automatique des données
- Confirmation des actions

## 🔒 Sécurité

### Authentification
- Connexion par nom d'utilisateur/mot de passe
- Tokens JWT avec expiration (24h)
- Hachage bcrypt des mots de passe
- Protection CSRF

### Autorisation
- Vérification du statut admin
- Middleware de protection des routes
- Validation des permissions

### Sécurité des données
- Sanitisation des entrées
- Validation des paramètres
- Protection contre l'injection

## 📡 API Endpoints

### Authentification
- `POST /api/admin/login` - Connexion admin
- `POST /api/admin/setup` - Création premier admin

### Statistiques
- `GET /api/admin/stats` - Statistiques générales

### Gestion utilisateurs
- `GET /api/admin/users` - Liste des utilisateurs
- `PUT /api/admin/toggle-admin/:userId` - Changer statut admin
- `DELETE /api/admin/user/:userId` - Supprimer utilisateur

### Give Items
- `POST /api/admin/give-coins` - Donner des coins
- `POST /api/admin/give-skin` - Donner un skin

## 🛠️ Utilisation

### Première connexion
1. Créez votre compte admin avec `npm run create-admin`
2. Accédez à `http://localhost:3000/admin`
3. Connectez-vous avec vos identifiants

### Donner des coins
1. Allez dans l'onglet "🎁 Give Items"
2. Remplissez le formulaire "Donner des Coins"
3. Entrez l'ID utilisateur et le montant
4. Cliquez sur "Donner Coins"

### Donner un skin
1. Dans l'onglet "🎁 Give Items"
2. Remplissez le formulaire "Donner un Skin"
3. Sélectionnez l'utilisateur et le skin
4. Cliquez sur "Donner Skin"

### Gérer les utilisateurs
1. Allez dans l'onglet "👥 Utilisateurs"
2. Recherchez un utilisateur si nécessaire
3. Utilisez les boutons d'action :
   - **Donner Admin** : Donne le statut admin
   - **Retirer Admin** : Retire le statut admin
   - **Supprimer** : Supprime l'utilisateur

## ⚠️ Notes Importantes

### Sécurité
- Gardez vos identifiants admin en sécurité
- Ne partagez jamais vos mots de passe
- Déconnectez-vous après utilisation

### Limitations
- Un seul admin peut être créé via le script
- Les autres admins doivent être créés via l'interface
- Les suppressions d'utilisateurs sont définitives

### Performance
- La liste des utilisateurs est paginée (20 par page)
- Les statistiques sont mises à jour en temps réel
- Les actions sont optimisées pour de gros volumes

## 🔧 Dépannage

### Problèmes de connexion
- Vérifiez que le serveur backend est démarré
- Vérifiez vos identifiants admin
- Vérifiez la connexion à la base de données

### Erreurs d'API
- Vérifiez les logs du serveur
- Vérifiez la validité des tokens
- Vérifiez les permissions admin

### Interface
- Videz le cache du navigateur
- Vérifiez la console pour les erreurs JavaScript
- Testez sur un autre navigateur

## 📝 Logs et Monitoring

### Logs serveur
- Connexions admin
- Actions de give
- Erreurs d'authentification
- Suppressions d'utilisateurs

### Monitoring
- Statistiques en temps réel
- Top utilisateurs
- Activité récente
- Coins en circulation

## 🚀 Déploiement

### Variables d'environnement
```env
MONGODB_URI=mongodb://localhost:27017/cs2freecase
JWT_SECRET=votre_secret_jwt_tres_securise
SESSION_SECRET=votre_secret_session_securise
```

### Production
- Utilisez HTTPS
- Configurez un proxy reverse
- Activez les logs de sécurité
- Surveillez les accès admin

---

**🎮 Panel Admin CS2 - Interface moderne et sécurisée pour la gestion de votre plateforme !**
