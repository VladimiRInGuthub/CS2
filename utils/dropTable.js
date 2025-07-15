const skins = [
  { name: 'USP-S | Dark Water', image: 'usp-darkwater.png', rarity: 'common' },
  { name: 'AK-47 | Redline', image: 'ak-redline.png', rarity: 'rare' },
  { name: 'AWP | Asiimov', image: 'awp-asiimov.png', rarity: 'epic' },
  { name: 'M4A1-S | Knight', image: 'm4a1s-knight.png', rarity: 'legendary' }
];

const dropTable = [
  { rarity: 'common', weight: 60 },
  { rarity: 'rare', weight: 25 },
  { rarity: 'epic', weight: 10 },
  { rarity: 'legendary', weight: 5 }
];

function getRandomSkin() {
  const rand = Math.random() * 100;
  let cumulative = 0;
  let selectedRarity = dropTable[0].rarity;
  for (const entry of dropTable) {
    cumulative += entry.weight;
    if (rand < cumulative) {
      selectedRarity = entry.rarity;
      break;
    }
  }
  const choices = skins.filter(s => s.rarity === selectedRarity);
  return choices[Math.floor(Math.random() * choices.length)];
}

module.exports = getRandomSkin;
