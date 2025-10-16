require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
// Remplacement de express-mongo-sanitize (incompatible avec Express 5)
const morgan = require('morgan');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
require('./config/passport');



const app = express();
connectDB();

// Vérification des variables d'environnement critiques
const requiredEnv = ['SESSION_SECRET'];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
  console.warn(`Attention: ${missingEnv.join(', ')} manquante(s). Valeur de développement appliquée.`);
  process.env.SESSION_SECRET = process.env.SESSION_SECRET || 'dev_secret_change_me';
}

const config = require('./config/config');

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

app.use(compression());

const allowedOrigins = [
  config.FRONTEND_URL,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3001'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Cookie'],
  exposedHeaders: ['Set-Cookie']
}));

// Basic rate limiting for auth and API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use('/auth', authLimiter);
app.use('/api', apiLimiter);

app.use(morgan('combined'));

// Sanitize basique des entrées (correction Express 5)
const sanitizeObjectKeys = (obj) => {
  if (!obj || typeof obj !== 'object') return;
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    // Supprimer les clés potentiellement dangereuses
    if (key.startsWith('$') || key.includes('.')) {
      delete obj[key];
    } else if (value && typeof value === 'object') {
      sanitizeObjectKeys(value);
    }
  });
};

app.use((req, res, next) => {
  try {
    if (req.body) sanitizeObjectKeys(req.body);
    if (req.params) sanitizeObjectKeys(req.params);
    if (req.query) sanitizeObjectKeys(req.query);
  } catch (_) {
    // no-op: en cas d'objet non itérable
  }
  next();
});
app.use(bodyParser.json());

// En production derrière un proxy (ex: Vercel/Render/Heroku), activer trust proxy
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  store: process.env.MONGODB_URI || process.env.MONGO_URI
    ? MongoStore.create({
        mongoUrl: process.env.MONGODB_URI || process.env.MONGO_URI,
        crypto: { secret: process.env.SESSION_SECRET },
        ttl: 60 * 60 * 24 * 7
      })
    : undefined,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 jours
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
app.use('/api/skinchanger', require('./routes/skinchanger'));
app.use('/api/skins', require('./routes/skins'));
app.use('/api/admin', require('./routes/admin'));

// Not found handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route introuvable' });
});

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Erreur serveur',
    code: err.code || 'SERVER_ERROR'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

