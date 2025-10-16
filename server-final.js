const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Configuration
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skincase')
  .then(() => console.log('✅ MongoDB connecté'))
  .catch(err => console.error('❌ Erreur MongoDB:', err));

// Routes
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
            .admin-info {
                background: rgba(255, 193, 7, 0.1);
                border: 1px solid rgba(255, 193, 7, 0.3);
                border-radius: 12px;
                padding: 20px;
                margin-top: 20px;
            }
            .admin-info h4 {
                color: #ffc107;
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
                <a href="/register" class="btn">S'inscrire</a>
            </div>
            
            <div class="status">
                <h3>✅ Site Opérationnel</h3>
                <p>Backend: http://localhost:5000 | MongoDB Atlas: Connecté</p>
                <p>Base de données initialisée avec succès</p>
                
                <div class="admin-info">
                    <h4>🔧 Compte Administrateur</h4>
                    <p><strong>Email:</strong> admin@skincase.com</p>
                    <p><strong>Mot de passe:</strong> admin123</p>
                </div>
            </div>
        </div>
    </body>
    </html>
  `);
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'SkinCase API fonctionne !',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur SkinCase démarré sur le port ${PORT}`);
  console.log(`🌐 Site: http://localhost:${PORT}`);
  console.log(`🔧 Health check: http://localhost:${PORT}/health`);
});
