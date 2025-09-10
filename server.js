require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const session = require('express-session');
const passport = require('passport');
require('./config/passport');



const app = express();
connectDB();

// Vérification des variables d'environnement critiques
const requiredEnv = ['JWT_SECRET', 'STEAM_API_KEY'];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
  console.error(`Erreur: Variables d'environnement manquantes: ${missingEnv.join(', ')}`);
  process.exit(1);
}

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Cookie'],
  exposedHeaders: ['Set-Cookie']
}));

app.use(bodyParser.json());

app.use(session({
    secret: 'super-secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Mettre à true en production avec HTTPS
      httpOnly: true,
      sameSite: 'lax'
    }
  }));

  app.use(passport.initialize());
  app.use(passport.session());
  


// Routes
app.use('/auth', require('./routes/auth'));
app.use('/api/cases', require('./routes/cases'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/users', require('./routes/user'));
app.use('/api/rooms', require('./routes/room'));
app.use('/api/shop', require('./routes/shop'));




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

