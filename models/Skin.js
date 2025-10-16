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
  weaponType: {
    type: String,
    required: true,
    enum: ['ak47', 'm4a4', 'm4a1s', 'awp', 'deagle', 'usp', 'glock', 'p250', 'tec9', 'fiveseven', 'cz75', 'p90', 'mp9', 'mac10', 'ump45', 'ppbizon', 'mp7', 'mp5sd', 'famas', 'galil', 'sg553', 'aug', 'ssg08', 'scar20', 'g3sg1', 'm249', 'negev', 'nova', 'xm1014', 'mag7', 'sawedoff', 'knife', 'gloves']
  },
  category: {
    type: String,
    enum: ['Rifle', 'Pistol', 'Sniper', 'SMG', 'Shotgun', 'LMG', 'Knife', 'Gloves'],
    required: true
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
