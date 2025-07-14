const CASE_PRICE = 250;

exports.openCase = async (req, res) => {
  const userId = req.user.id;
  const skin = getRandomSkin();

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });

    if (user.coins < CASE_PRICE) {
      return res.status(400).json({ error: 'Pas assez de coins' });
    }

    const alreadyOwned = user.inventory.some(
      item => item.skinId === skin.name.toLowerCase().replace(/\s/g, '-')
    );
    if (alreadyOwned) {
      return res.status(400).json({ error: 'Skin déjà obtenu' });
    }

    user.coins -= CASE_PRICE;
    user.inventory.push({
      skinId: skin.name.toLowerCase().replace(/\s/g, '-'),
      rarity: skin.rarity,
      name: skin.name
    });
    await user.save();

    res.json({
      message: 'Caisse ouverte avec succès !',
      skin,
      coins: user.coins
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
