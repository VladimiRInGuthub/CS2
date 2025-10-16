const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const config = require('./config');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// 🔗 Steam Strategy
if (config.STEAM_API_KEY) {
  passport.use(new SteamStrategy({
    returnURL: `${config.BACKEND_URL}/auth/steam/return`,
    realm: `${config.BACKEND_URL}/`,
    apiKey: config.STEAM_API_KEY
  }, async (identifier, profile, done) => {
    try {
      const steamId = profile.id;
      let user = await User.findOne({ steamId });
      
      if (!user) {
        // Créer un nouvel utilisateur Steam
        user = new User({
          steamId,
          username: profile.displayName,
          displayName: profile.displayName,
          avatar: profile?.photos?.[2]?.value || '',
          emailVerified: true, // Steam est considéré comme vérifié
          preferences: {
            language: 'fr',
            theme: 'dark',
            notifications: {
              email: true,
              push: true,
              cases: true,
              servers: true,
              achievements: true
            }
          }
        });
        await user.save();
        console.log(`✅ Nouvel utilisateur Steam créé: ${user.username}`);
      } else {
        // Mettre à jour les informations Steam
        user.username = profile.displayName;
        user.displayName = profile.displayName;
        user.avatar = profile?.photos?.[2]?.value || user.avatar;
        user.lastLogin = new Date();
        await user.save();
      }
      
      done(null, user);
    } catch (error) {
      console.error('Erreur Steam auth:', error);
      done(error, null);
    }
  }));
} else {
  console.warn('⚠️ Steam API Key non configurée - Authentification Steam désactivée');
}

// 🟢 Google Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${config.BACKEND_URL}/auth/google/callback`
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const googleId = profile.id;
      let user = await User.findOne({ googleId });
      
      if (!user) {
        // Vérifier si un utilisateur avec cet email existe déjà
        const existingUser = await User.findOne({ email: profile.emails[0].value });
        
        if (existingUser) {
          // Lier le compte Google à l'utilisateur existant
          existingUser.googleId = googleId;
          existingUser.emailVerified = true;
          await existingUser.save();
          user = existingUser;
          console.log(`✅ Compte Google lié à l'utilisateur existant: ${user.username}`);
        } else {
          // Créer un nouvel utilisateur Google
          user = new User({
            googleId,
            email: profile.emails[0].value,
            username: profile.displayName,
            displayName: profile.displayName,
            avatar: profile.photos[0].value,
            emailVerified: true,
            preferences: {
              language: 'fr',
              theme: 'dark',
              notifications: {
                email: true,
                push: true,
                cases: true,
                servers: true,
                achievements: true
              }
            }
          });
          await user.save();
          console.log(`✅ Nouvel utilisateur Google créé: ${user.username}`);
        }
      } else {
        // Mettre à jour les informations Google
        user.email = profile.emails[0].value;
        user.username = profile.displayName;
        user.displayName = profile.displayName;
        user.avatar = profile.photos[0].value;
        user.lastLogin = new Date();
        await user.save();
      }
      
      done(null, user);
    } catch (error) {
      console.error('Erreur Google auth:', error);
      done(error, null);
    }
  }));
} else {
  console.warn('⚠️ Google OAuth non configuré - Authentification Google désactivée');
}
