const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

// 🔗 Steam
passport.use(new SteamStrategy({
  returnURL: 'http://localhost:5000/auth/steam/return',
  realm: 'http://localhost:5000/',
  apiKey: process.env.STEAM_API_KEY
}, async (identifier, profile, done) => {
  const steamId = profile.id;
  let user = await User.findOne({ steamId });
  if (!user) {
    user = await new User({
      steamId,
      username: profile.displayName,
      avatar: profile?.photos?.[2]?.value || ''
    }).save();
  }
  done(null, user);
}));

// 🟢 Google (optionnel)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    const googleId = profile.id;
    let user = await User.findOne({ googleId });
    if (!user) {
      user = await new User({
        googleId,
        username: profile.displayName,
        avatar: profile.photos[0].value
      }).save();
    }
    done(null, user);
  }));
}
