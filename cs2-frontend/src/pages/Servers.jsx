import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import DarkVeil from '../components/DarkVeil';
import CoinIcon from '../components/CoinIcon';
import './Servers.css';

const Servers = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMode, setSelectedMode] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newServer, setNewServer] = useState({
    name: '',
    description: '',
    gameMode: 'deathmatch',
    map: 'de_dust2',
    maxPlayers: 16,
    rounds: 30,
    duration: 30,
    bots: 0,
    password: '',
    isPublic: true,
    region: 'Europe'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });
  const navigate = useNavigate();

  const gameModes = [
    { id: 'all', name: t('servers.allModes'), icon: '🎮' },
    { id: 'deathmatch', name: t('servers.deathmatch'), icon: '⚔️' },
    { id: 'retake', name: t('servers.retake'), icon: '🔄' },
    { id: 'surf', name: t('servers.surf'), icon: '🏄' },
    { id: 'bhop', name: t('servers.bhop'), icon: '🦘' },
    { id: 'duel', name: t('servers.duel'), icon: '⚡' },
    { id: 'aim', name: t('servers.aim'), icon: '🎯' },
    { id: 'kz', name: t('servers.kz'), icon: '🧗' },
    { id: 'competitive', name: t('servers.competitive'), icon: '🏆' },
    { id: 'casual', name: t('servers.casual'), icon: '😎' }
  ];

  const regions = [
    { id: 'all', name: t('servers.allRegions') },
    { id: 'Europe', name: t('servers.europe') },
    { id: 'North America', name: t('servers.northAmerica') },
    { id: 'Asia', name: t('servers.asia') },
    { id: 'South America', name: t('servers.southAmerica') },
    { id: 'Oceania', name: t('servers.oceania') }
  ];

  const maps = [
    'de_dust2', 'de_mirage', 'de_inferno', 'de_cache', 'de_overpass',
    'de_train', 'de_nuke', 'de_vertigo', 'de_ancient', 'de_anubis'
  ];

  const mockServers = [
    {
      id: 1,
      name: 'Deathmatch Pro #1',
      mode: 'deathmatch',
      map: 'de_dust2',
      players: 12,
      maxPlayers: 16,
      ping: 15,
      region: 'Europe',
      status: 'online',
      description: 'Serveur Deathmatch professionnel avec skins personnalisés'
    },
    {
      id: 2,
      name: 'Retake Training #2',
      mode: 'retake',
      map: 'de_mirage',
      players: 8,
      maxPlayers: 10,
      ping: 22,
      region: 'Europe',
      status: 'online',
      description: 'Entraînement Retake avec équipes équilibrées'
    },
    {
      id: 3,
      name: 'Surf Paradise',
      mode: 'surf',
      map: 'surf_beginner',
      players: 6,
      maxPlayers: 20,
      ping: 18,
      region: 'Europe',
      status: 'online',
      description: 'Serveur Surf pour débutants et experts'
    },
    {
      id: 4,
      name: 'BHop Masters',
      mode: 'bhop',
      map: 'bhop_easy',
      players: 4,
      maxPlayers: 12,
      ping: 25,
      region: 'Europe',
      status: 'online',
      description: 'Défis BHop avec classements'
    },
    {
      id: 5,
      name: 'Aim Training Elite',
      mode: 'aim',
      map: 'aim_map',
      players: 10,
      maxPlayers: 16,
      ping: 12,
      region: 'Europe',
      status: 'online',
      description: 'Perfectionnement de la précision'
    },
    {
      id: 6,
      name: 'Duel Arena',
      mode: 'duel',
      map: 'de_cache',
      players: 2,
      maxPlayers: 2,
      ping: 20,
      region: 'Europe',
      status: 'online',
      description: 'Duels 1v1 avec skins exclusifs'
    }
  ];

  useEffect(() => {
    loadData();
    
    // Mise à jour automatique toutes les 30 secondes
    const interval = setInterval(loadServers, 30000);
    
    return () => clearInterval(interval);
  }, [selectedMode, selectedRegion, pagination.page]);

  const loadData = async () => {
    try {
      await Promise.all([
        loadUser(),
        loadServers()
      ]);
    } catch (error) {
      console.error('Erreur chargement données:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUser = async () => {
    try {
      const response = await axios.get('/auth/me', { withCredentials: true });
      setUser(response.data);
    } catch (error) {
      console.error('Erreur chargement utilisateur:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const loadServers = async () => {
    try {
      const params = new URLSearchParams({
        gameMode: selectedMode === 'all' ? '' : selectedMode,
        region: selectedRegion === 'all' ? '' : selectedRegion,
        page: pagination.page,
        limit: pagination.limit
      });

      const response = await axios.get(`/api/servers?${params}`, { 
        withCredentials: true 
      });
      
      setServers(response.data.servers);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Erreur chargement serveurs:', error);
    }
  };

  const getModeIcon = (mode) => {
    const modeData = gameModes.find(m => m.id === mode);
    return modeData ? modeData.icon : '🎮';
  };

  const getModeName = (mode) => {
    const modeData = gameModes.find(m => m.id === mode);
    return modeData ? modeData.name : mode;
  };

  const getStatusColor = (status) => {
    const colors = {
      'online': '#4CAF50',
      'offline': '#f44336',
      'starting': '#FF9800',
      'stopping': '#FF5722'
    };
    return colors[status] || '#888';
  };

  const getPingColor = (ping) => {
    if (ping < 50) return '#4CAF50';
    if (ping < 100) return '#FF9800';
    return '#f44336';
  };

  const connectToServer = (server) => {
    if (server.status !== 'online') {
      alert(t('servers.serverOffline'));
      return;
    }

    if (server.currentPlayers >= server.maxPlayers) {
      alert(t('servers.serverFull'));
      return;
    }

    // Générer la commande de connexion Steam
    const connectionString = server.getConnectionString ? 
      server.getConnectionString() : 
      `steam://connect/${server._id}.skincase.gg`;
    
    // Copier dans le presse-papiers
    navigator.clipboard.writeText(connectionString).then(() => {
      alert(`${t('servers.serverJoined')}\n\n${connectionString}`);
    }).catch(() => {
      alert(`${t('servers.serverJoined')}\n\n${connectionString}`);
    });
  };

  const createServer = async () => {
    try {
      const response = await axios.post('/api/servers', newServer, {
        withCredentials: true
      });
      
      if (response.data.server) {
        setServers(prev => [response.data.server, ...prev]);
        setShowCreateModal(false);
        setNewServer({
          name: '',
          description: '',
          gameMode: 'deathmatch',
          map: 'de_dust2',
          maxPlayers: 16,
          rounds: 30,
          duration: 30,
          bots: 0,
          password: '',
          isPublic: true,
          region: 'Europe'
        });
      }
    } catch (error) {
      console.error('Erreur création serveur:', error);
      alert(error.response?.data?.error || t('errors.generic'));
    }
  };

  const startServer = async (serverId) => {
    try {
      await axios.post(`/api/servers/${serverId}/start`, {}, {
        withCredentials: true
      });
      loadServers(); // Recharger la liste
    } catch (error) {
      console.error('Erreur démarrage serveur:', error);
      alert(error.response?.data?.error || t('errors.generic'));
    }
  };

  const stopServer = async (serverId) => {
    try {
      await axios.post(`/api/servers/${serverId}/stop`, {}, {
        withCredentials: true
      });
      loadServers(); // Recharger la liste
    } catch (error) {
      console.error('Erreur arrêt serveur:', error);
      alert(error.response?.data?.error || t('errors.generic'));
    }
  };

  if (loading) {
    return (
      <div className="servers-loading">
        <div className="loading-spinner"></div>
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="servers-page">
      {/* Fond animé */}
      <div className="background-animation">
        <DarkVeil hueShift={180} noiseIntensity={0.05} scanlineIntensity={0.03} speed={0.2} />
      </div>

      {/* Header */}
      <div className="servers-header">
        <h1>{t('servers.title')}</h1>
        <p>{t('servers.availableServers')}</p>
        {user && (
          <div className="user-info">
            <CoinIcon size={18} />
            <span>{user.xcoins} Xcoins</span>
            <button 
              className="create-server-btn"
              onClick={() => setShowCreateModal(true)}
            >
              ➕ {t('servers.createServer')}
            </button>
          </div>
        )}
      </div>

      {/* Filtres */}
      <div className="servers-filters">
        <div className="filter-section">
          <h3>{t('servers.gameMode')}</h3>
          <div className="filter-buttons">
            {gameModes.map((mode) => (
              <button
                key={mode.id}
                className={`filter-btn ${selectedMode === mode.id ? 'active' : ''}`}
                onClick={() => setSelectedMode(mode.id)}
              >
                <span>{mode.icon}</span>
                <span>{mode.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <h3>{t('servers.region')}</h3>
          <div className="filter-buttons">
            {regions.map((region) => (
              <button
                key={region.id}
                className={`filter-btn ${selectedRegion === region.id ? 'active' : ''}`}
                onClick={() => setSelectedRegion(region.id)}
              >
                <span>{region.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Liste des serveurs */}
      <div className="servers-list">
        <AnimatePresence>
          {servers.map((server, index) => (
            <motion.div
              key={server._id}
              className="server-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="server-header">
                <div className="server-info">
                  <h3>
                    {getModeIcon(server.gameMode)} {server.name}
                    {server.isOfficial && (
                      <span className="official-badge">⭐ {t('servers.officialServer')}</span>
                    )}
                  </h3>
                  <p>{getModeName(server.gameMode)} • {server.map}</p>
                </div>
                <div className="server-status">
                  <div 
                    className="status-indicator"
                    style={{ backgroundColor: getStatusColor(server.status) }}
                  />
                  <span>{t(`servers.${server.status}`)}</span>
                </div>
              </div>

              <div className="server-stats">
                <div className="stat">
                  <span className="stat-value">{server.currentPlayers}/{server.maxPlayers}</span>
                  <span className="stat-label">{t('servers.players')}</span>
                </div>
                <div className="stat">
                  <span 
                    className="stat-value"
                    style={{ color: getPingColor(server.ping) }}
                  >
                    {server.ping}ms
                  </span>
                  <span className="stat-label">{t('servers.ping')}</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{server.region}</span>
                  <span className="stat-label">{t('servers.region')}</span>
                </div>
              </div>

              {server.description && (
                <p className="server-description">{server.description}</p>
              )}

              <div className="server-actions">
                {server.status === 'online' ? (
                  <button
                    className="connect-btn"
                    onClick={() => connectToServer(server)}
                    disabled={server.currentPlayers >= server.maxPlayers}
                  >
                    🎮 {t('servers.joinServer')}
                  </button>
                ) : server.status === 'offline' ? (
                  <button
                    className="start-btn"
                    onClick={() => startServer(server._id)}
                  >
                    ▶️ {t('servers.startServer')}
                  </button>
                ) : (
                  <button className="starting-btn" disabled>
                    ⏳ {t('servers.starting')}
                  </button>
                )}

                {server.owner._id === user?._id && (
                  <button
                    className="stop-btn"
                    onClick={() => stopServer(server._id)}
                  >
                    ⏹️ {t('servers.stopServer')}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="pagination">
          <button 
            className="page-btn"
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
            disabled={pagination.page <= 1}
          >
            ← {t('common.previous')}
          </button>
          
          <span className="page-info">
            {t('common.page')} {pagination.page} / {pagination.pages}
          </span>
          
          <button 
            className="page-btn"
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            disabled={pagination.page >= pagination.pages}
          >
            {t('common.next')} →
          </button>
        </div>
      )}

      {/* Modal de création de serveur */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateServerModal
            newServer={newServer}
            setNewServer={setNewServer}
            maps={maps}
            gameModes={gameModes}
            regions={regions}
            onCreate={createServer}
            onClose={() => setShowCreateModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Composant modal pour créer un serveur
const CreateServerModal = ({ newServer, setNewServer, maps, gameModes, regions, onCreate, onClose }) => {
  const { t } = useTranslation();

  const handleInputChange = (field, value) => {
    setNewServer(prev => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div
      className="create-server-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="create-server-modal"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{t('servers.createServer')}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-content">
          <div className="form-group">
            <label>{t('servers.serverName')}:</label>
            <input
              type="text"
              value={newServer.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder={t('servers.serverNamePlaceholder')}
            />
          </div>

          <div className="form-group">
            <label>{t('servers.serverDescription')}:</label>
            <textarea
              value={newServer.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder={t('servers.serverDescriptionPlaceholder')}
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t('servers.gameMode')}:</label>
              <select
                value={newServer.gameMode}
                onChange={(e) => handleInputChange('gameMode', e.target.value)}
              >
                {gameModes.filter(mode => mode.id !== 'all').map(mode => (
                  <option key={mode.id} value={mode.id}>
                    {mode.icon} {mode.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>{t('servers.serverMap')}:</label>
              <select
                value={newServer.map}
                onChange={(e) => handleInputChange('map', e.target.value)}
              >
                {maps.map(map => (
                  <option key={map} value={map}>{map}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t('servers.maxPlayers')}:</label>
              <input
                type="number"
                min="2"
                max="32"
                value={newServer.maxPlayers}
                onChange={(e) => handleInputChange('maxPlayers', parseInt(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label>{t('servers.region')}:</label>
              <select
                value={newServer.region}
                onChange={(e) => handleInputChange('region', e.target.value)}
              >
                {regions.filter(region => region.id !== 'all').map(region => (
                  <option key={region.id} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t('servers.rounds')}:</label>
              <input
                type="number"
                min="1"
                max="100"
                value={newServer.rounds}
                onChange={(e) => handleInputChange('rounds', parseInt(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label>{t('servers.duration')} (min):</label>
              <input
                type="number"
                min="5"
                max="120"
                value={newServer.duration}
                onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="form-group">
            <label>{t('servers.bots')}:</label>
            <input
              type="number"
              min="0"
              max="16"
              value={newServer.bots}
              onChange={(e) => handleInputChange('bots', parseInt(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label>{t('servers.password')} (optionnel):</label>
            <input
              type="password"
              value={newServer.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder={t('servers.passwordPlaceholder')}
            />
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={newServer.isPublic}
                onChange={(e) => handleInputChange('isPublic', e.target.checked)}
              />
              <span>{t('servers.publicServer')}</span>
            </label>
          </div>
        </div>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button 
            className="create-btn"
            onClick={onCreate}
            disabled={!newServer.name.trim()}
          >
            {t('servers.createServer')}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Servers;
