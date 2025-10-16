import React, { useState, useEffect } from 'react';
import GlassSurface from '../components/GlassSurface';
import './Admin.css';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminToken, setAdminToken] = useState(null);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [skins, setSkins] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // États pour les formulaires
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [giveCoinsForm, setGiveCoinsForm] = useState({ userId: '', amount: '' });
  const [giveSkinForm, setGiveSkinForm] = useState({ userId: '', skinId: '' });
  const [searchUser, setSearchUser] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setAdminToken(token);
      setIsAuthenticated(true);
      fetchAdminData();
    }
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, skinsRes] = await Promise.all([
        fetch('/api/admin/stats', {
          headers: { 'Authorization': `Bearer ${adminToken}` }
        }),
        fetch('/api/admin/users', {
          headers: { 'Authorization': `Bearer ${adminToken}` }
        }),
        fetch('/api/skins', {
          headers: { 'Authorization': `Bearer ${adminToken}` }
        })
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.users);
      }

      if (skinsRes.ok) {
        const skinsData = await skinsRes.json();
        setSkins(skinsData);
      }
    } catch (error) {
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('adminToken', data.token);
        setAdminToken(data.token);
        setIsAuthenticated(true);
        fetchAdminData();
      } else {
        setError(data.error || 'Erreur de connexion');
      }
    } catch (error) {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setAdminToken(null);
    setIsAuthenticated(false);
    setStats(null);
    setUsers([]);
    setSkins([]);
  };

  const handleGiveCoins = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/give-coins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          userId: giveCoinsForm.userId,
          amount: parseInt(giveCoinsForm.amount)
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert(`✅ ${data.message}`);
        setGiveCoinsForm({ userId: '', amount: '' });
        fetchAdminData(); // Rafraîchir les données
      } else {
        setError(data.error || 'Erreur lors du give');
      }
    } catch (error) {
      setError('Erreur lors du give');
    } finally {
      setLoading(false);
    }
  };

  const handleGiveSkin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/give-skin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          userId: giveSkinForm.userId,
          skinId: giveSkinForm.skinId
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert(`✅ ${data.message}`);
        setGiveSkinForm({ userId: '', skinId: '' });
        fetchAdminData(); // Rafraîchir les données
      } else {
        setError(data.error || 'Erreur lors du give');
      }
    } catch (error) {
      setError('Erreur lors du give');
    } finally {
      setLoading(false);
    }
  };

  const toggleAdminStatus = async (userId, currentStatus) => {
    const password = prompt(`Entrez un mot de passe admin pour ${currentStatus ? 'retirer' : 'donner'} le statut admin:`);
    if (!password) return;

    try {
      const response = await fetch(`/api/admin/toggle-admin/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (response.ok) {
        alert(`✅ ${data.message}`);
        fetchAdminData();
      } else {
        setError(data.error || 'Erreur lors du changement de statut');
      }
    } catch (error) {
      setError('Erreur lors du changement de statut');
    }
  };

  const deleteUser = async (userId, username) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${username} ?`)) return;

    try {
      const response = await fetch(`/api/admin/user/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });

      const data = await response.json();

      if (response.ok) {
        alert(`✅ ${data.message}`);
        fetchAdminData();
      } else {
        setError(data.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      setError('Erreur lors de la suppression');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login-container">
        <GlassSurface
          width={400}
          height={300}
          borderRadius={25}
          className="admin-login-glass"
        >
          <div className="admin-login-content">
            <h2 className="admin-title">🔐 Panel Admin</h2>
            <form onSubmit={handleLogin} className="admin-login-form">
              <div className="form-group">
                <label>Nom d'utilisateur</label>
                <input
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Mot de passe</label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                />
              </div>
              {error && <div className="error-message">{error}</div>}
              <button type="submit" disabled={loading} className="admin-login-btn">
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>
          </div>
        </GlassSurface>
      </div>
    );
  }

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <div className="admin-container">
      <div className="admin-header">
        <GlassSurface
          width="100%"
          height={80}
          borderRadius={20}
          className="admin-header-glass"
        >
          <div className="admin-header-content">
            <h1 className="admin-main-title">🎮 Panel Admin CS2</h1>
            <button onClick={handleLogout} className="admin-logout-btn">
              Déconnexion
            </button>
          </div>
        </GlassSurface>
      </div>

      <div className="admin-tabs">
        {['dashboard', 'users', 'give'].map(tab => (
          <button
            key={tab}
            className={`admin-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'dashboard' && '📊 Tableau de bord'}
            {tab === 'users' && '👥 Utilisateurs'}
            {tab === 'give' && '🎁 Give Items'}
          </button>
        ))}
      </div>

      <div className="admin-content">
        {activeTab === 'dashboard' && (
          <div className="admin-dashboard">
            {stats && (
              <>
                <div className="stats-grid">
                  <GlassSurface width={200} height={120} borderRadius={15} className="stat-card">
                    <div className="stat-content">
                      <h3>👥 Utilisateurs</h3>
                      <div className="stat-number">{stats.totalUsers}</div>
                    </div>
                  </GlassSurface>
                  <GlassSurface width={200} height={120} borderRadius={15} className="stat-card">
                    <div className="stat-content">
                      <h3>🎨 Skins</h3>
                      <div className="stat-number">{stats.totalSkins}</div>
                    </div>
                  </GlassSurface>
                  <GlassSurface width={200} height={120} borderRadius={15} className="stat-card">
                    <div className="stat-content">
                      <h3>📦 Cases</h3>
                      <div className="stat-number">{stats.totalCases}</div>
                    </div>
                  </GlassSurface>
                  <GlassSurface width={200} height={120} borderRadius={15} className="stat-card">
                    <div className="stat-content">
                      <h3>💰 Coins</h3>
                      <div className="stat-number">{stats.totalCoinsInCirculation.toLocaleString()}</div>
                    </div>
                  </GlassSurface>
                </div>

                <div className="dashboard-sections">
                  <GlassSurface width="100%" height={300} borderRadius={20} className="dashboard-section">
                    <div className="section-content">
                      <h3>🏆 Top Utilisateurs</h3>
                      <div className="top-users">
                        {stats.topUsers.map((user, index) => (
                          <div key={user._id} className="top-user-item">
                            <span className="rank">#{index + 1}</span>
                            <span className="username">{user.username}</span>
                            <span className="coins">{user.coins.toLocaleString()} coins</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </GlassSurface>

                  <GlassSurface width="100%" height={300} borderRadius={20} className="dashboard-section">
                    <div className="section-content">
                      <h3>🆕 Utilisateurs Récents</h3>
                      <div className="recent-users">
                        {stats.recentUsers.map(user => (
                          <div key={user._id} className="recent-user-item">
                            <span className="username">{user.username}</span>
                            <span className="date">{new Date(user.createdAt).toLocaleDateString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </GlassSurface>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="admin-users">
            <GlassSurface width="100%" height={600} borderRadius={20} className="users-section">
              <div className="section-content">
                <div className="users-header">
                  <h3>👥 Gestion des Utilisateurs</h3>
                  <input
                    type="text"
                    placeholder="Rechercher un utilisateur..."
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                    className="user-search"
                  />
                </div>
                <div className="users-list">
                  {filteredUsers.map(user => (
                    <div key={user._id} className="user-item">
                      <div className="user-info">
                        <span className="username">{user.username}</span>
                        <span className="coins">{user.coins.toLocaleString()} coins</span>
                        <span className={`admin-badge ${user.isAdmin ? 'admin' : 'user'}`}>
                          {user.isAdmin ? '👑 Admin' : '👤 User'}
                        </span>
                      </div>
                      <div className="user-actions">
                        <button
                          onClick={() => toggleAdminStatus(user._id, user.isAdmin)}
                          className={`action-btn ${user.isAdmin ? 'remove-admin' : 'make-admin'}`}
                        >
                          {user.isAdmin ? 'Retirer Admin' : 'Donner Admin'}
                        </button>
                        <button
                          onClick={() => deleteUser(user._id, user.username)}
                          className="action-btn delete"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </GlassSurface>
          </div>
        )}

        {activeTab === 'give' && (
          <div className="admin-give">
            <div className="give-forms">
              <GlassSurface width={400} height={300} borderRadius={20} className="give-form-glass">
                <div className="section-content">
                  <h3>💰 Donner des Coins</h3>
                  <form onSubmit={handleGiveCoins} className="give-form">
                    <div className="form-group">
                      <label>ID Utilisateur</label>
                      <input
                        type="text"
                        value={giveCoinsForm.userId}
                        onChange={(e) => setGiveCoinsForm({ ...giveCoinsForm, userId: e.target.value })}
                        placeholder="ID de l'utilisateur"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Montant</label>
                      <input
                        type="number"
                        value={giveCoinsForm.amount}
                        onChange={(e) => setGiveCoinsForm({ ...giveCoinsForm, amount: e.target.value })}
                        placeholder="Nombre de coins"
                        min="1"
                        required
                      />
                    </div>
                    <button type="submit" disabled={loading} className="give-btn">
                      {loading ? 'Envoi...' : 'Donner Coins'}
                    </button>
                  </form>
                </div>
              </GlassSurface>

              <GlassSurface width={400} height={400} borderRadius={20} className="give-form-glass">
                <div className="section-content">
                  <h3>🎨 Donner un Skin</h3>
                  <form onSubmit={handleGiveSkin} className="give-form">
                    <div className="form-group">
                      <label>ID Utilisateur</label>
                      <input
                        type="text"
                        value={giveSkinForm.userId}
                        onChange={(e) => setGiveSkinForm({ ...giveSkinForm, userId: e.target.value })}
                        placeholder="ID de l'utilisateur"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Skin</label>
                      <select
                        value={giveSkinForm.skinId}
                        onChange={(e) => setGiveSkinForm({ ...giveSkinForm, skinId: e.target.value })}
                        required
                      >
                        <option value="">Sélectionner un skin</option>
                        {skins.map(skin => (
                          <option key={skin._id} value={skin._id}>
                            {skin.name} ({skin.rarity})
                          </option>
                        ))}
                      </select>
                    </div>
                    <button type="submit" disabled={loading} className="give-btn">
                      {loading ? 'Envoi...' : 'Donner Skin'}
                    </button>
                  </form>
                </div>
              </GlassSurface>
            </div>
            {error && <div className="error-message">{error}</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
