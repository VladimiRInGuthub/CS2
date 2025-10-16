import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { API_CONFIG } from '../config/apiConfig';
import './Skinchanger.css';

const Skinchanger = () => {
  const { t } = useTranslation();
  const [inventory, setInventory] = useState([]);
  const [loadouts, setLoadouts] = useState([]);
  const [equippedSkins, setEquippedSkins] = useState({});
  const [selectedLoadout, setSelectedLoadout] = useState(null);
  const [selectedWeapon, setSelectedWeapon] = useState(null);
  const [availableSkins, setAvailableSkins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLoadoutModal, setShowLoadoutModal] = useState(false);
  const [newLoadoutName, setNewLoadoutName] = useState('');

  const weaponSlots = [
    { id: 'ak47', name: 'AK-47', category: 'rifle', icon: '🔫' },
    { id: 'm4a4', name: 'M4A4', category: 'rifle', icon: '🔫' },
    { id: 'm4a1s', name: 'M4A1-S', category: 'rifle', icon: '🔫' },
    { id: 'awp', name: 'AWP', category: 'sniper', icon: '🎯' },
    { id: 'deagle', name: 'Desert Eagle', category: 'pistol', icon: '🔫' },
    { id: 'usp', name: 'USP-S', category: 'pistol', icon: '🔫' },
    { id: 'glock', name: 'Glock-18', category: 'pistol', icon: '🔫' },
    { id: 'knife', name: 'Knife', category: 'knife', icon: '🔪' },
    { id: 'gloves', name: 'Gloves', category: 'gloves', icon: '🧤' }
  ];

  const loadoutTypes = [
    { id: 'competitive', name: t('skinchanger.competitiveLoadout'), icon: '🏆' },
    { id: 'casual', name: t('skinchanger.casualLoadout'), icon: '😎' },
    { id: 'fun', name: t('skinchanger.funLoadout'), icon: '🎉' },
    { id: 'custom', name: t('skinchanger.customLoadout'), icon: '⚙️' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await Promise.all([
        loadInventory(),
        loadLoadouts(),
        loadEquippedSkins()
      ]);
    } catch (error) {
      console.error('Erreur chargement données:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadInventory = async () => {
    try {
      const response = await fetch('/api/inventory', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setInventory(data.inventory || []);
      }
    } catch (error) {
      console.error('Erreur chargement inventaire:', error);
    }
  };

  const loadLoadouts = async () => {
    try {
      const response = await fetch('/api/skinchanger/loadouts', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setLoadouts(data.loadouts || []);
      }
    } catch (error) {
      console.error('Erreur chargement loadouts:', error);
    }
  };

  const loadEquippedSkins = async () => {
    try {
      const response = await fetch('/api/skinchanger/equipped', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setEquippedSkins(data.equippedSkins || {});
      }
    } catch (error) {
      console.error('Erreur chargement skins équipés:', error);
    }
  };

  const getSkinsForWeapon = (weaponType) => {
    return inventory.filter(item => {
      const skin = item.skin;
      if (!skin) return false;
      
      // Mapping des types d'armes
      const weaponMapping = {
        'ak47': 'AK-47',
        'm4a4': 'M4A4',
        'm4a1s': 'M4A1-S',
        'awp': 'AWP',
        'deagle': 'Desert Eagle',
        'usp': 'USP-S',
        'glock': 'Glock-18',
        'knife': 'Knife',
        'gloves': 'Gloves'
      };

      return skin.weapon === weaponMapping[weaponType];
    });
  };

  const equipSkin = async (weaponType, skinId) => {
    try {
      const response = await fetch('/api/skinchanger/equip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          weaponType,
          skinId
        })
      });

      if (response.ok) {
        // Mettre à jour l'état local
        setEquippedSkins(prev => ({
          ...prev,
          [weaponType]: skinId
        }));
      }
    } catch (error) {
      console.error('Erreur équipement skin:', error);
    }
  };

  const unequipSkin = async (weaponType) => {
    try {
      const response = await fetch('/api/skinchanger/unequip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          weaponType
        })
      });

      if (response.ok) {
        // Mettre à jour l'état local
        setEquippedSkins(prev => {
          const newState = { ...prev };
          delete newState[weaponType];
          return newState;
        });
      }
    } catch (error) {
      console.error('Erreur déséquipement skin:', error);
    }
  };

  const saveLoadout = async (loadoutName, loadoutType = 'custom') => {
    try {
      const response = await fetch('/api/skinchanger/loadouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          name: loadoutName,
          type: loadoutType,
          skins: equippedSkins
        })
      });

      if (response.ok) {
        const data = await response.json();
        setLoadouts(prev => [...prev, data.loadout]);
        setShowLoadoutModal(false);
        setNewLoadoutName('');
      }
    } catch (error) {
      console.error('Erreur sauvegarde loadout:', error);
    }
  };

  const loadLoadout = async (loadoutId) => {
    try {
      const response = await fetch(`/api/skinchanger/loadouts/${loadoutId}/load`, {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setEquippedSkins(data.skins);
        setSelectedLoadout(loadoutId);
      }
    } catch (error) {
      console.error('Erreur chargement loadout:', error);
    }
  };

  const deleteLoadout = async (loadoutId) => {
    try {
      const response = await fetch(`/api/skinchanger/loadouts/${loadoutId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setLoadouts(prev => prev.filter(loadout => loadout._id !== loadoutId));
        if (selectedLoadout === loadoutId) {
          setSelectedLoadout(null);
        }
      }
    } catch (error) {
      console.error('Erreur suppression loadout:', error);
    }
  };

  const syncWithServers = async () => {
    try {
      const response = await fetch('/api/skinchanger/sync', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        // Afficher un message de succès
        console.log('Synchronisation réussie');
      }
    } catch (error) {
      console.error('Erreur synchronisation:', error);
    }
  };

  const selectWeapon = (weaponType) => {
    setSelectedWeapon(weaponType);
    const skins = getSkinsForWeapon(weaponType);
    setAvailableSkins(skins);
  };

  const getRarityColor = (rarity) => {
    return API_CONFIG.RARITY_CONFIG[rarity]?.color || '#b0b3b8';
  };

  if (loading) {
    return (
      <div className="skinchanger-loading">
        <div className="loading-spinner"></div>
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="skinchanger-page">
      {/* Header */}
      <div className="skinchanger-header">
        <h1>{t('skinchanger.title')}</h1>
        <p>{t('skinchanger.equipSkins')}</p>
        <button 
          className="sync-btn"
          onClick={syncWithServers}
        >
          🔄 {t('skinchanger.syncWithServers')}
        </button>
      </div>

      <div className="skinchanger-content">
        {/* Weapon Slots */}
        <div className="weapon-slots">
          <h2>{t('skinchanger.weaponSlots')}</h2>
          <div className="slots-grid">
            {weaponSlots.map(weapon => (
              <motion.div
                key={weapon.id}
                className={`weapon-slot ${selectedWeapon === weapon.id ? 'selected' : ''}`}
                onClick={() => selectWeapon(weapon.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="weapon-icon">{weapon.icon}</div>
                <div className="weapon-name">{weapon.name}</div>
                {equippedSkins[weapon.id] && (
                  <div className="equipped-indicator">✓</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Selected Weapon Skins */}
        {selectedWeapon && (
          <motion.div
            className="weapon-skins"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3>
              {weaponSlots.find(w => w.id === selectedWeapon)?.name} - {t('skinchanger.availableSkins')}
            </h3>
            
            {availableSkins.length > 0 ? (
              <div className="skins-grid">
                {availableSkins.map(skin => (
                  <motion.div
                    key={skin._id}
                    className={`skin-item ${equippedSkins[selectedWeapon] === skin.skin._id ? 'equipped' : ''}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="skin-image">
                      <img src={skin.skin.image} alt={skin.skin.name} />
                      <div 
                        className="rarity-border"
                        style={{ borderColor: getRarityColor(skin.skin.rarity) }}
                      />
                    </div>
                    
                    <div className="skin-info">
                      <h4>{skin.skin.name}</h4>
                      <p 
                        className="skin-rarity"
                        style={{ color: getRarityColor(skin.skin.rarity) }}
                      >
                        {skin.skin.rarity}
                      </p>
                      <p className="skin-wear">{skin.skin.wear}</p>
                    </div>

                    <div className="skin-actions">
                      {equippedSkins[selectedWeapon] === skin.skin._id ? (
                        <button 
                          className="unequip-btn"
                          onClick={() => unequipSkin(selectedWeapon)}
                        >
                          {t('skinchanger.unequipSkin')}
                        </button>
                      ) : (
                        <button 
                          className="equip-btn"
                          onClick={() => equipSkin(selectedWeapon, skin.skin._id)}
                        >
                          {t('skinchanger.equipSkin')}
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="no-skins">
                <p>{t('skinchanger.noSkinsForWeapon')}</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Loadouts */}
        <div className="loadouts-section">
          <div className="loadouts-header">
            <h2>{t('skinchanger.loadouts')}</h2>
            <button 
              className="save-loadout-btn"
              onClick={() => setShowLoadoutModal(true)}
            >
              💾 {t('skinchanger.saveLoadout')}
            </button>
          </div>

          <div className="loadouts-grid">
            {loadouts.map(loadout => (
              <motion.div
                key={loadout._id}
                className={`loadout-card ${selectedLoadout === loadout._id ? 'selected' : ''}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="loadout-header">
                  <div className="loadout-type">
                    {loadoutTypes.find(t => t.id === loadout.type)?.icon}
                  </div>
                  <h3>{loadout.name}</h3>
                  <div className="loadout-actions">
                    <button 
                      className="load-btn"
                      onClick={() => loadLoadout(loadout._id)}
                    >
                      📂 {t('skinchanger.loadLoadout')}
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => deleteLoadout(loadout._id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                
                <div className="loadout-skins">
                  {Object.keys(loadout.skins).map(weaponType => {
                    const skinId = loadout.skins[weaponType];
                    const skin = inventory.find(item => item.skin._id === skinId);
                    if (!skin) return null;
                    
                    return (
                      <div key={weaponType} className="loadout-skin">
                        <img src={skin.skin.image} alt={skin.skin.name} />
                        <span>{weaponSlots.find(w => w.id === weaponType)?.name}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Save Loadout Modal */}
      <AnimatePresence>
        {showLoadoutModal && (
          <motion.div
            className="loadout-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLoadoutModal(false)}
          >
            <motion.div
              className="loadout-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>{t('skinchanger.saveLoadout')}</h3>
              
              <div className="modal-content">
                <div className="input-group">
                  <label>{t('skinchanger.loadoutName')}:</label>
                  <input
                    type="text"
                    value={newLoadoutName}
                    onChange={(e) => setNewLoadoutName(e.target.value)}
                    placeholder={t('skinchanger.loadoutNamePlaceholder')}
                  />
                </div>

                <div className="loadout-types">
                  {loadoutTypes.map(type => (
                    <button
                      key={type.id}
                      className="loadout-type-btn"
                      onClick={() => saveLoadout(newLoadoutName, type.id)}
                    >
                      {type.icon} {type.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  className="cancel-btn"
                  onClick={() => setShowLoadoutModal(false)}
                >
                  {t('common.cancel')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Skinchanger;