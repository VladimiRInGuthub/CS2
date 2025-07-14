const mongoose = require('mongoose');

const SkinSchema = new mongoose.Schema({
  name: String,
  image: String,
  rarity: String, // 'common', 'rare', 'epic', 'legendary'
});

module.exports = mongoose.model('Skin', SkinSchema);
