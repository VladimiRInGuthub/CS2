
const steam = require('steam-login');

const steamMiddleware = steam.middleware({
  realm: process.env.BASE_URL,
  verify: process.env.BASE_URL + '/api/auth/verify',
  apiKey: process.env.STEAM_API_KEY,
});

module.exports = {
  middleware: steamMiddleware
};
