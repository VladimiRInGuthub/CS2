# 🔧 Guide de Résolution des Problèmes

## Erreurs 500 sur les endpoints d'historique

### Problème
Les endpoints `/api/cases/history` et `/api/cases/user-stats` retournent des erreurs 500.

### Solutions

#### 1. Vérifier l'authentification
Assurez-vous que vous êtes connecté et que le token JWT est valide :

```javascript
// Dans la console du navigateur
console.log('Token:', localStorage.getItem('token'));
```

#### 2. Vérifier la base de données
Assurez-vous que MongoDB est en cours d'exécution et que les données sont présentes :

```bash
# Démarrer MongoDB (si pas déjà fait)
mongod

# Dans un autre terminal, vérifier les données
mongo cs2freecase
db.cases.find()
db.users.find()
```

#### 3. Redémarrer le serveur
```bash
# Arrêter le serveur (Ctrl+C)
# Puis redémarrer
npm run dev
```

#### 4. Re-seeder les données
```bash
npm run seed
```

#### 5. Vérifier les variables d'environnement
Assurez-vous que le fichier `.env` contient :

```env
MONGODB_URI=mongodb://localhost:27017/cs2freecase
JWT_SECRET=votre_secret_jwt
PORT=5000
```

## Problèmes courants

### Le serveur ne démarre pas
1. Vérifiez que Node.js est installé : `node --version`
2. Installez les dépendances : `npm install`
3. Vérifiez les erreurs dans la console

### Les cases ne s'affichent pas
1. Exécutez le seeding : `npm run seed`
2. Vérifiez la connexion à la base de données
3. Vérifiez les logs du serveur

### Erreurs d'authentification
1. Déconnectez-vous et reconnectez-vous
2. Vérifiez que le token JWT est présent dans localStorage
3. Vérifiez que le JWT_SECRET est configuré

### Animations qui ne fonctionnent pas
1. Vérifiez que le navigateur supporte les animations CSS
2. Désactivez les extensions qui pourraient interférer
3. Essayez un autre navigateur

## Debug

### Activer les logs détaillés
Dans `controllers/caseController.js`, décommentez les lignes de debug :

```javascript
// Décommentez ces lignes pour voir les logs
console.log('getCaseHistory called, req.user:', req.user);
console.log('getUserStats called, req.user:', req.user);
```



## Solutions temporaires

Si les problèmes persistent, les endpoints d'historique retournent maintenant des données par défaut au lieu d'erreurs 500 :

- `/api/cases/history` retourne un tableau vide `[]`
- `/api/cases/user-stats` retourne des statistiques par défaut

Cela permet au frontend de fonctionner même si l'authentification ou la base de données ont des problèmes.

## Support

Si les problèmes persistent :
1. Vérifiez les logs du serveur
2. Vérifiez la console du navigateur
3. Vérifiez que MongoDB est en cours d'exécution
4. Redémarrez le serveur et le frontend 