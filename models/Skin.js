const mongoose = require('mongoose');

const SkinSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  weapon: {
    type: String,
    required: true,
    enum: ['AK-47', 'M4A4', 'M4A1-S', 'AWP', 'Desert Eagle', 'USP-S', 'Glock-18', 'P250', 'Tec-9', 'Five-SeveN', 'CZ75-Auto', 'P90', 'MP9', 'MAC-10', 'UMP-45', 'PP-Bizon', 'MP7', 'MP5-SD', 'FAMAS', 'Galil AR', 'SG 553', 'AUG', 'SSG 08', 'SCAR-20', 'G3SG1', 'M249', 'Negev', 'Nova', 'XM1014', 'MAG-7', 'Sawed-Off', 'M249', 'Negev', 'Knife', 'Gloves']
  },
  rarity: {
    type: String,
    enum: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'],
    required: true
  },
  image: {
    type: String,
    required: true
  },
  model3D: {
    type: String,
    default: null
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  tradeable: {
    type: Boolean,
    default: true
  },
  wear: {
    type: String,
    enum: ['Factory New', 'Minimal Wear', 'Field-Tested', 'Well-Worn', 'Battle-Scarred'],
    default: 'Field-Tested'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Skin', SkinSchema);
