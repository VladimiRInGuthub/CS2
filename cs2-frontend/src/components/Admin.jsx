import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import './Admin.css';

const Admin = () => {
  const { t } = useTranslation();
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [cases, setCases] = useState([]);
  const [servers, setServers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userSearch, setUserSearch] = useState('');
  const [userFilter, setUserFilter] = useState('all');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'cases') {
      fetchCases();
    } else if (activeTab === 'servers') {
      fetchServers();
    } else if (activeTab === 'transactions') {
      fetchTransactions();
    }
  }, [activeTab]);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/admin/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Erreur récupération dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`/api/admin/users?search=${userSearch}&filter=${userFilter}`);
      setUsers(response.data);
    } catch (error) {
      console.error('Erreur récupération utilisateurs:', error);
    }
  };

  const fetchCases = async () => {
    try {
      const response = await axios.get('/api/admin/cases');
      setCases(response.data);
    } catch (error) {
      console.error('Erreur récupération cases:', error);
    }
  };

  const fetchServers = async () => {
    try {
      const response = await axios.get('/api/admin/servers');
      setServers(response.data);
    } catch (error) {
      console.error('Erreur récupération serveurs:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('/api/admin/transactions');
      setTransactions(response.data);
    } catch (error) {
      console.error('Erreur récupération transactions:', error);
    }
  };

  const handleUserAction = async (userId, action, data = {}) => {
    try {
      await axios.put(`/api/admin/users/${userId}`, { action, ...data });
      await fetchUsers();
      alert('Action effectuée avec succès');
    } catch (error) {
      console.error('Erreur action utilisateur:', error);
      alert(error.response?.data?.message || 'Erreur lors de l\'action');
    }
  };

  const handleServerAction = async (serverId, action, data = {}) => {
    try {
      await axios.put(`/api/admin/servers/${serverId}`, { action, ...data });
      await fetchServers();
      alert('Action effectuée avec succès');
    } catch (error) {
      console.error('Erreur action serveur:', error);
      alert(error.response?.data?.message || 'Erreur lors de l\'action');
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>{t('common.loading', 'Chargement...')}</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>{t('admin.title', 'Panel Administrateur')}</h1>
        <div className="admin-tabs">
          <button 
            className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 {t('admin.dashboard', 'Tableau de bord')}
          </button>
          <button 
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 {t('admin.users', 'Utilisateurs')}
          </button>
          <button 
            className={`tab-btn ${activeTab === 'cases' ? 'active' : ''}`}
            onClick={() => setActiveTab('cases')}
          >
            📦 {t('admin.cases', 'Cases')}
          </button>
          <button 
            className={`tab-btn ${activeTab === 'servers' ? 'active' : ''}`}
            onClick={() => setActiveTab('servers')}
          >
            🖥️ {t('admin.servers', 'Serveurs')}
          </button>
          <button 
            className={`tab-btn ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveTab('transactions')}
          >
            💳 {t('admin.transactions', 'Transactions')}
          </button>
        </div>
      </div>

      <div className="admin-content">
        {activeTab === 'dashboard' && dashboardData && (
          <div className="dashboard-tab">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <div className="stat-value">{formatNumber(dashboardData.users.totalUsers)}</div>
                  <div className="stat-label">{t('admin.totalUsers', 'Utilisateurs totaux')}</div>
                  <div className="stat-sub">{formatNumber(dashboardData.users.activeUsers)} actifs</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">📦</div>
                <div className="stat-content">
                  <div className="stat-value">{formatNumber(dashboardData.cases.totalOpened)}</div>
                  <div className="stat-label">{t('admin.casesOpened', 'Cases ouvertes')}</div>
                  <div className="stat-sub">{formatNumber(dashboardData.cases.activeCases)} actives</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">🖥️</div>
                <div className="stat-content">
                  <div className="stat-value">{formatNumber(dashboardData.servers.online || 0)}</div>
                  <div className="stat-label">{t('admin.serversOnline', 'Serveurs en ligne')}</div>
                  <div className="stat-sub">{formatNumber(dashboardData.servers.offline || 0)} hors ligne</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-content">
                  <div className="stat-value">{formatNumber(dashboardData.users.totalXcoins)}</div>
                  <div className="stat-label">{t('admin.totalXcoins', 'Xcoins totaux')}</div>
                  <div className="stat-sub">{formatNumber(dashboardData.premium.activeSubscriptions)} premium</div>
                </div>
              </div>
            </div>

            <div className="charts-section">
              <div className="chart-card">
                <h3>{t('admin.transactionTypes', 'Types de transactions')}</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dashboardData.transactions.map(t => ({
                        name: t._id,
                        value: t.count
                      }))}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {dashboardData.transactions.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 50%)`} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-tab">
            <div className="users-filters">
              <input
                type="text"
                placeholder={t('admin.searchUsers', 'Rechercher des utilisateurs...')}
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && fetchUsers()}
              />
              <select
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
              >
                <option value="all">{t('admin.allUsers', 'Tous les utilisateurs')}</option>
                <option value="premium">{t('admin.premiumUsers', 'Utilisateurs premium')}</option>
                <option value="banned">{t('admin.bannedUsers', 'Utilisateurs bannis')}</option>
                <option value="active">{t('admin.activeUsers', 'Utilisateurs actifs')}</option>
                <option value="inactive">{t('admin.inactiveUsers', 'Utilisateurs inactifs')}</option>
              </select>
              <button onClick={fetchUsers}>{t('admin.search', 'Rechercher')}</button>
            </div>

            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>{t('admin.username', 'Nom d\'utilisateur')}</th>
                    <th>{t('admin.email', 'Email')}</th>
                    <th>{t('admin.level', 'Niveau')}</th>
                    <th>{t('admin.xcoins', 'Xcoins')}</th>
                    <th>{t('admin.status', 'Statut')}</th>
                    <th>{t('admin.actions', 'Actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.users?.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div className="user-info">
                          <img 
                            src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=random&color=fff`}
                            alt={user.username}
                            className="user-avatar"
                          />
                          <span>{user.username}</span>
                        </div>
                      </td>
                      <td>{user.email || 'N/A'}</td>
                      <td>{user.stats?.level || 1}</td>
                      <td>{formatNumber(user.xcoins || 0)}</td>
                      <td>
                        <div className="status-badges">
                          {user.isPremium && <span className="badge premium">Premium</span>}
                          {user.isBanned && <span className="badge banned">Banni</span>}
                          {user.isAdmin && <span className="badge admin">Admin</span>}
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons">
                          {!user.isBanned ? (
                            <button 
                              className="ban-btn"
                              onClick={() => handleUserAction(user._id, 'ban', { reason: 'Bannissement par admin' })}
                            >
                              {t('admin.ban', 'Bannir')}
                            </button>
                          ) : (
                            <button 
                              className="unban-btn"
                              onClick={() => handleUserAction(user._id, 'unban')}
                            >
                              {t('admin.unban', 'Débannir')}
                            </button>
                          )}
                          <button 
                            className="xcoins-btn"
                            onClick={() => {
                              const amount = prompt('Montant de Xcoins à ajouter:');
                              if (amount && !isNaN(amount)) {
                                handleUserAction(user._id, 'add_xcoins', { xcoins: parseInt(amount) });
                              }
                            }}
                          >
                            {t('admin.addXcoins', 'Ajouter Xcoins')}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'cases' && (
          <div className="cases-tab">
            <div className="cases-actions">
              <button className="create-btn">
                {t('admin.createCase', 'Créer une case')}
              </button>
            </div>

            <div className="cases-grid">
              {cases.map((caseItem) => (
                <div key={caseItem._id} className="case-card">
                  <div className="case-header">
                    <h3>{caseItem.name}</h3>
                    <div className="case-status">
                      {caseItem.isActive ? (
                        <span className="status active">{t('admin.active', 'Actif')}</span>
                      ) : (
                        <span className="status inactive">{t('admin.inactive', 'Inactif')}</span>
                      )}
                    </div>
                  </div>
                  <div className="case-info">
                    <p>{caseItem.description}</p>
                    <div className="case-stats">
                      <span>{t('admin.price', 'Prix')}: {caseItem.price} Xcoins</span>
                      <span>{t('admin.opened', 'Ouvertes')}: {caseItem.stats?.totalOpened || 0}</span>
                    </div>
                  </div>
                  <div className="case-actions">
                    <button className="edit-btn">{t('admin.edit', 'Modifier')}</button>
                    <button className="delete-btn">{t('admin.delete', 'Supprimer')}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'servers' && (
          <div className="servers-tab">
            <div className="servers-table">
              <table>
                <thead>
                  <tr>
                    <th>{t('admin.serverName', 'Nom du serveur')}</th>
                    <th>{t('admin.owner', 'Propriétaire')}</th>
                    <th>{t('admin.mode', 'Mode')}</th>
                    <th>{t('admin.status', 'Statut')}</th>
                    <th>{t('admin.players', 'Joueurs')}</th>
                    <th>{t('admin.actions', 'Actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {servers.map((server) => (
                    <tr key={server._id}>
                      <td>{server.name}</td>
                      <td>
                        <div className="user-info">
                          <img 
                            src={server.owner?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(server.owner?.username || 'Unknown')}&background=random&color=fff`}
                            alt={server.owner?.username}
                            className="user-avatar"
                          />
                          <span>{server.owner?.username}</span>
                        </div>
                      </td>
                      <td>{server.mode}</td>
                      <td>
                        <span className={`status ${server.status}`}>
                          {t(`admin.serverStatus.${server.status}`, server.status)}
                        </span>
                      </td>
                      <td>{server.currentPlayers}/{server.maxPlayers}</td>
                      <td>
                        <div className="action-buttons">
                          {server.isBanned ? (
                            <button 
                              className="unban-btn"
                              onClick={() => handleServerAction(server._id, 'unban')}
                            >
                              {t('admin.unban', 'Débannir')}
                            </button>
                          ) : (
                            <button 
                              className="ban-btn"
                              onClick={() => handleServerAction(server._id, 'ban', { reason: 'Serveur banni par admin' })}
                            >
                              {t('admin.ban', 'Bannir')}
                            </button>
                          )}
                          {server.isOfficial ? (
                            <button 
                              className="remove-official-btn"
                              onClick={() => handleServerAction(server._id, 'remove_official')}
                            >
                              {t('admin.removeOfficial', 'Retirer officiel')}
                            </button>
                          ) : (
                            <button 
                              className="set-official-btn"
                              onClick={() => handleServerAction(server._id, 'set_official')}
                            >
                              {t('admin.setOfficial', 'Rendre officiel')}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="transactions-tab">
            <div className="transactions-table">
              <table>
                <thead>
                  <tr>
                    <th>{t('admin.user', 'Utilisateur')}</th>
                    <th>{t('admin.type', 'Type')}</th>
                    <th>{t('admin.amount', 'Montant')}</th>
                    <th>{t('admin.status', 'Statut')}</th>
                    <th>{t('admin.date', 'Date')}</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.transactions?.map((transaction) => (
                    <tr key={transaction._id}>
                      <td>
                        <div className="user-info">
                          <img 
                            src={transaction.userId?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(transaction.userId?.username || 'Unknown')}&background=random&color=fff`}
                            alt={transaction.userId?.username}
                            className="user-avatar"
                          />
                          <span>{transaction.userId?.username}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`transaction-type ${transaction.type}`}>
                          {t(`admin.transactionTypes.${transaction.type}`, transaction.type)}
                        </span>
                      </td>
                      <td>{formatNumber(transaction.amount)} {transaction.currency}</td>
                      <td>
                        <span className={`status ${transaction.status}`}>
                          {t(`admin.transactionStatus.${transaction.status}`, transaction.status)}
                        </span>
                      </td>
                      <td>{new Date(transaction.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
