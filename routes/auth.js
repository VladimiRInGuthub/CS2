const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

// ✅ STEAM LOGIN
router.get('/steam', passport.authenticate('steam'));

// ✅ STEAM CALLBACK avec redirection + JWT
router.get('/steam/return', (req, res, next) => {
  passport.authenticate('steam', { session: false }, (err, user) => {
    if (err || !user) return res.redirect('http://localhost:3000/login');

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Redirection avec le token JWT dans l'URL
    res.redirect(`http://localhost:3000/?token=${token}`);
  })(req, res, next);
});

// ✅ GOOGLE LOGIN
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

// ✅ GOOGLE CALLBACK avec redirection + JWT
router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user) => {
    if (err || !user) return res.redirect('http://localhost:3000/login');

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.redirect(`http://localhost:3000/?token=${token}`);
  })(req, res, next);
});

module.exports = router;
