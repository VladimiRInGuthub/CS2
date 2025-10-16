const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Route de base
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SkinCase - CS2 Case Opening & Servers</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #14141e 0%, #1e1e2d 100%);
                color: #fff;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .container {
                text-align: center;
                max-width: 800px;
                padding: 40px 20px;
            }
            .logo {
                font-size: 4rem;
                font-weight: 700;
                background: linear-gradient(45deg, #a259ff, #3f2b96);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                margin-bottom: 20px;
            }
            .subtitle {
                font-size: 1.5rem;
                color: rgba(255, 255, 255, 0.8);
                margin-bottom: 40px;
            }
            .features {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin-bottom: 40px;
            }
            .feature {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 16px;
                padding: 30px 20px;
                backdrop-filter: blur(10px);
            }
            .feature-icon {
                font-size: 3rem;
                margin-bottom: 15px;
            }
            .feature h3 {
                color: #a259ff;
                margin-bottom: 10px;
            }
            .feature p {
                color: rgba(255, 255, 255, 0.7);
                line-height: 1.5;
            }
            .cta {
                margin-top: 40px;
            }
            .btn {
                display: inline-block;
                background: linear-gradient(45deg, #a259ff, #3f2b96);
                color: #fff;
                padding: 15px 30px;
                border-radius: 12px;
                text-decoration: none;
                font-weight: 600;
                font-size: 1.1rem;
                transition: all 0.3s ease;
                margin: 0 10px;
            }
            .btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(162, 89, 255, 0.3);
            }
            .btn-secondary {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            .btn-secondary:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            .status {
                margin-top: 30px;
                padding: 20px;
                background: rgba(40, 167, 69, 0.1);
                border: 1px solid rgba(40, 167, 69, 0.3);
                border-radius: 12px;
            }
            .status h3 {
                color: #28a745;
                margin-bottom: 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1 class="logo">SkinCase</h1>
            <p class="subtitle">CS2 Case Opening & Servers</p>
            
            <div class="features">
                <div class="feature">
                    <div class="feature-icon">📦</div>
                    <h3>Cases Authentiques</h3>
                    <p>Ouvrez des cases CS2 avec des skins réels et des animations immersives</p>
                </div>
                
                <div class="feature">
                    <div class="feature-icon">🖥️</div>
                    <h3>Serveurs Privés</h3>
                    <p>Créez et rejoignez des serveurs CS2 avec skinchanger intégré</p>
                </div>
                
                <div class="feature">
                    <div class="feature-icon">🎯</div>
                    <h3>Battlepass</h3>
                    <p>Progressez dans le battlepass et débloquez des récompenses exclusives</p>
                </div>
                
                <div class="feature">
                    <div class="feature-icon">💰</div>
                    <h3>Xcoins</h3>
                    <p>Système de monnaie virtuelle pour toutes vos transactions</p>
                </div>
            </div>
            
            <div class="cta">
                <a href="/login" class="btn">Se Connecter</a>
                <a href="/register" class="btn btn-secondary">S'inscrire</a>
            </div>
            
            <div class="status">
                <h3>✅ Site Opérationnel</h3>
                <p>Backend: http://localhost:5000 | Frontend: http://localhost:3000</p>
                <p>Compte Admin: admin@skincase.com / admin123</p>
            </div>
        </div>
    </body>
    </html>
  `);
});

// Routes pour les pages principales
app.get('/login', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Connexion - SkinCase</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #14141e 0%, #1e1e2d 100%);
                color: #fff;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .login-container {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                padding: 40px;
                backdrop-filter: blur(20px);
                max-width: 400px;
                width: 100%;
            }
            .logo {
                text-align: center;
                font-size: 2.5rem;
                font-weight: 700;
                background: linear-gradient(45deg, #a259ff, #3f2b96);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                margin-bottom: 30px;
            }
            .form-group {
                margin-bottom: 20px;
            }
            .form-group label {
                display: block;
                margin-bottom: 8px;
                color: rgba(255, 255, 255, 0.8);
            }
            .form-group input {
                width: 100%;
                padding: 12px 16px;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 8px;
                color: #fff;
                font-size: 1rem;
            }
            .form-group input::placeholder {
                color: rgba(255, 255, 255, 0.5);
            }
            .btn {
                width: 100%;
                background: linear-gradient(45deg, #a259ff, #3f2b96);
                color: #fff;
                padding: 12px 20px;
                border: none;
                border-radius: 8px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(162, 89, 255, 0.3);
            }
            .links {
                text-align: center;
                margin-top: 20px;
            }
            .links a {
                color: #a259ff;
                text-decoration: none;
                margin: 0 10px;
            }
            .admin-info {
                margin-top: 30px;
                padding: 20px;
                background: rgba(255, 193, 7, 0.1);
                border: 1px solid rgba(255, 193, 7, 0.3);
                border-radius: 12px;
                text-align: center;
            }
            .admin-info h3 {
                color: #ffc107;
                margin-bottom: 10px;
            }
        </style>
    </head>
    <body>
        <div class="login-container">
            <h1 class="logo">SkinCase</h1>
            
            <form>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" placeholder="votre@email.com" required>
                </div>
                
                <div class="form-group">
                    <label>Mot de passe</label>
                    <input type="password" placeholder="Votre mot de passe" required>
                </div>
                
                <button type="submit" class="btn">Se Connecter</button>
            </form>
            
            <div class="links">
                <a href="/">Retour à l'accueil</a>
                <a href="/register">S'inscrire</a>
            </div>
            
            <div class="admin-info">
                <h3>🔧 Compte Administrateur</h3>
                <p><strong>Email:</strong> admin@skincase.com</p>
                <p><strong>Mot de passe:</strong> admin123</p>
            </div>
        </div>
    </body>
    </html>
  `);
});

app.get('/register', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Inscription - SkinCase</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #14141e 0%, #1e1e2d 100%);
                color: #fff;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .register-container {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                padding: 40px;
                backdrop-filter: blur(20px);
                max-width: 400px;
                width: 100%;
            }
            .logo {
                text-align: center;
                font-size: 2.5rem;
                font-weight: 700;
                background: linear-gradient(45deg, #a259ff, #3f2b96);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                margin-bottom: 30px;
            }
            .form-group {
                margin-bottom: 20px;
            }
            .form-group label {
                display: block;
                margin-bottom: 8px;
                color: rgba(255, 255, 255, 0.8);
            }
            .form-group input {
                width: 100%;
                padding: 12px 16px;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 8px;
                color: #fff;
                font-size: 1rem;
            }
            .form-group input::placeholder {
                color: rgba(255, 255, 255, 0.5);
            }
            .btn {
                width: 100%;
                background: linear-gradient(45deg, #a259ff, #3f2b96);
                color: #fff;
                padding: 12px 20px;
                border: none;
                border-radius: 8px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(162, 89, 255, 0.3);
            }
            .links {
                text-align: center;
                margin-top: 20px;
            }
            .links a {
                color: #a259ff;
                text-decoration: none;
                margin: 0 10px;
            }
        </style>
    </head>
    <body>
        <div class="register-container">
            <h1 class="logo">SkinCase</h1>
            
            <form>
                <div class="form-group">
                    <label>Nom d'utilisateur</label>
                    <input type="text" placeholder="Votre nom d'utilisateur" required>
                </div>
                
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" placeholder="votre@email.com" required>
                </div>
                
                <div class="form-group">
                    <label>Mot de passe</label>
                    <input type="password" placeholder="Votre mot de passe" required>
                </div>
                
                <div class="form-group">
                    <label>Confirmer le mot de passe</label>
                    <input type="password" placeholder="Confirmez votre mot de passe" required>
                </div>
                
                <button type="submit" class="btn">S'inscrire</button>
            </form>
            
            <div class="links">
                <a href="/">Retour à l'accueil</a>
                <a href="/login">Se connecter</a>
            </div>
        </div>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`🚀 Frontend SkinCase démarré sur le port ${PORT}`);
  console.log(`🌐 Site: http://localhost:${PORT}`);
  console.log(`🔧 Backend: http://localhost:5000`);
});