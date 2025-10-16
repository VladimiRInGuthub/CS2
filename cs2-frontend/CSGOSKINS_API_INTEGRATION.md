# Intégration API CSGOSkins.gg

Ce document explique comment utiliser l'intégration de l'API CSGOSkins.gg dans l'application CS2.

## 🚀 Fonctionnalités

- **Galerie de Skins** : Affichage des skins CS2 avec données réelles
- **Recherche avancée** : Filtres par arme, rareté, couleur, prix
- **Prix en temps réel** : Données de prix actualisées
- **Cache intelligent** : Optimisation des performances
- **Mode hors ligne** : Données de fallback en cas d'erreur API

## 📋 Prérequis

1. **Compte CSGOSkins.gg** : Créer un compte sur [https://csgoskins.gg/api/](https://csgoskins.gg/api/)
2. **Abonnement** : Souscrire à un plan (Pro: 179€/mois, Business: 279€/mois)
3. **Clé API** : Générer une clé API depuis votre tableau de bord

## ⚙️ Configuration

### 1. Variables d'environnement

Créez un fichier `.env.local` dans le dossier `cs2-frontend/` :

```bash
# Clé API CSGOSkins.gg
REACT_APP_CSGOSKINS_API_KEY=votre_cle_api_ici

# URL du serveur backend (optionnel)
REACT_APP_API_URL=http://localhost:3000
```

### 2. Redémarrage de l'application

Après avoir ajouté la clé API, redémarrez l'application :

```bash
cd cs2-frontend
npm start
```

## 🎨 Utilisation

### Page Skins

Accédez à la galerie de skins via :
- **Navigation** : Menu "Skins" 🎨
- **Page Cases** : Bouton "Galerie de Skins"
- **URL directe** : `/skins`

### Fonctionnalités disponibles

#### 🔍 Recherche
- **Barre de recherche** : Recherche par nom de skin
- **Filtres avancés** :
  - Arme (AK-47, AWP, Desert Eagle, etc.)
  - Rareté (Consumer Grade à Contraband)
  - Couleur (Black, Blue, Red, etc.)
  - Prix (min/max)
  - Tri (popularité, prix, rareté, etc.)

#### 📊 Affichage
- **Images haute qualité** : Images officielles des skins
- **Informations détaillées** : Nom, arme, rareté, état, prix
- **Badges spéciaux** : StatTrak™, Souvenir
- **Pagination** : Navigation par pages

#### 🛒 Actions
- **Détails du skin** : Modal avec informations complètes
- **Ajout au panier** : Fonctionnalité d'achat (à implémenter)

## 🔧 Architecture technique

### Composants créés

1. **`csgoskinsApi.js`** : Service API principal
2. **`SkinGallery.jsx`** : Composant galerie de skins
3. **`Skins.jsx`** : Page principale des skins
4. **`apiConfig.js`** : Configuration de l'API

### Structure des données

```javascript
// Exemple de skin retourné par l'API
{
  id: "skin-id",
  name: "AK-47 | Redline",
  weapon: "AK-47",
  rarity: "Classified",
  price: 15.50,
  image: "https://...",
  exterior: "Field-Tested",
  statTrak: false,
  souvenir: false
}
```

## 🚨 Gestion d'erreurs

### Mode hors ligne
Si l'API n'est pas disponible ou non configurée :
- Affichage d'un message d'avertissement
- Utilisation de données de fallback
- Fonctionnalités limitées mais disponibles

### Cache intelligent
- **Durée** : 5 minutes par défaut
- **Nettoyage automatique** : Suppression des données expirées
- **Optimisation** : Réduction des appels API

## 📈 Performance

### Optimisations implémentées
- **Cache en mémoire** : Évite les requêtes répétées
- **Debounce de recherche** : 500ms de délai
- **Pagination** : Chargement par lots de 20 skins
- **Images lazy loading** : Chargement différé des images

### Métriques recommandées
- **Temps de réponse** : < 2 secondes
- **Cache hit ratio** : > 80%
- **Erreurs API** : < 5%

## 🔒 Sécurité

### Bonnes pratiques
- **Clé API** : Stockée dans les variables d'environnement
- **HTTPS** : Toutes les requêtes en HTTPS
- **Validation** : Vérification des données reçues
- **Rate limiting** : Respect des limites de l'API

## 🐛 Dépannage

### Problèmes courants

#### API non configurée
```
⚠️ Clé API CSGOSkins.gg non configurée. Utilisation du mode hors ligne.
```
**Solution** : Ajouter la clé API dans `.env.local`

#### Erreur 401/403
```
Erreur API: 401 - Unauthorized
```
**Solution** : Vérifier la validité de la clé API

#### Erreur de réseau
```
Erreur requête CSGOSkins API: NetworkError
```
**Solution** : Vérifier la connexion internet et l'URL de l'API

### Logs de débogage

Activez les logs détaillés dans la console du navigateur pour diagnostiquer les problèmes.

## 📚 Documentation API

- **Documentation officielle** : [https://csgoskins.gg/docs/](https://csgoskins.gg/docs/)
- **Endpoints disponibles** : Voir `apiConfig.js`
- **Limites de taux** : Vérifier votre plan d'abonnement

## 🔄 Mises à jour

### Version actuelle
- **API v1** : Version stable
- **Cache** : 5 minutes
- **Limite** : 20 skins par page

### Prochaines améliorations
- [ ] Historique des prix
- [ ] Comparaison de skins
- [ ] Favoris utilisateur
- [ ] Notifications de prix
- [ ] Export des données

## 📞 Support

Pour toute question ou problème :
1. Vérifier la documentation officielle
2. Consulter les logs de la console
3. Tester avec des données de fallback
4. Contacter le support CSGOSkins.gg si nécessaire

---

**Note** : Cette intégration nécessite un abonnement payant à l'API CSGOSkins.gg. Les données de fallback sont fournies à des fins de démonstration uniquement.


