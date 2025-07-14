const express = require('express');
const router = express.Router();
const steam = require('../utils/steamAuth');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Redirection vers Steam
router.get('/login', steam.middleware);

// Steam callback
router.get('/verify', steam.middleware, async (req, res) => {
  const profile = req.user;

  const steamId = profile.id;
  const username = profile.displayName;
  const avatar = profile.photos[2].value;

  let user = await User.findOne({ steamId });
  if (!user) {
    user = new User({ steamId, username, avatar });
    await user.save();
  }

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.redirect(`http://localhost:3000/?token=${token}`);
});

module.exports = router;
