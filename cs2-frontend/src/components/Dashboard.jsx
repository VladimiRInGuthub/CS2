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
import './Dashboard.css';

const Dashboard = ({ userId }) => {
  const { t } = useTranslation();
  const [userStats, setUserStats] = useState(null);
  const [globalStats, setGlobalStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchStats();
  }, [userId, timeRange]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      const [userResponse, globalResponse] = await Promise.all([
        userId ? axios.get(`/api/stats/user/${userId}`) : Promise.resolve({ data: null }),
        axios.get('/api/stats/global')
      ]);

      setUserStats(userResponse.data);
      setGlobalStats(globalResponse.data);
    } catch (error) {
      console.error('Erreur récupération stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRarityColor = (rarity) => {
    const colors = {
      'Consumer Grade': '#b0b3b8',
      'Industrial Grade': '#5e98d9',
      'Mil-Spec Grade': '#4b69ff',
      'Restricted': '#8847ff',
      'Classified': '#d32ce6',
      'Covert': '#eb4b4b',
      'Contraband': '#e4ae39'
    };
    return colors[rarity] || '#b0b3b8';
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
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>{t('common.loading', 'Chargement...')}</p>
      </div>
    );
  }

  // Données pour les graphiques
  const progressionData = userStats ? [
    { level: 1, xp: 0 },
    { level: 5, xp: userStats.progression.xp * 0.2 },
    { level: 10, xp: userStats.progression.xp * 0.4 },
    { level: 15, xp: userStats.progression.xp * 0.6 },
    { level: 20, xp: userStats.progression.xp * 0.8 },
    { level: userStats.progression.level, xp: userStats.progression.xp }
  ] : [];

  const rarityData = userStats ? Object.entries(userStats.rarityBreakdown).map(([rarity, count]) => ({
    name: rarity,
    value: count,
    color: getRarityColor(rarity)
  })) : [];

  const weaponData = userStats ? Object.entries(userStats.weaponDistribution).map(([weapon, count]) => ({
    weapon,
    count
  })).slice(0, 10) : [];

  const activityData = userStats ? userStats.recentActivity.map((activity, index) => ({
    day: `J-${6-index}`,
    cases: Math.floor(Math.random() * 5) + 1, // Simulation
    skins: Math.floor(Math.random() * 3) + 1
  })) : [];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>{t('dashboard.title', 'Tableau de bord')}</h1>
        <div className="time-range-selector">
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <option value="7d">{t('dashboard.last7Days', '7 derniers jours')}</option>
            <option value="30d">{t('dashboard.last30Days', '30 derniers jours')}</option>
            <option value="90d">{t('dashboard.last90Days', '90 derniers jours')}</option>
            <option value="all">{t('dashboard.allTime', 'Tout le temps')}</option>
          </select>
        </div>
      </div>

      {/* Statistiques globales */}
      {globalStats && (
        <div className="global-stats">
          <h2>{t('dashboard.globalStats', 'Statistiques globales')}</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <div className="stat-value">{formatNumber(globalStats.users.total)}</div>
                <div className="stat-label">{t('dashboard.totalUsers', 'Utilisateurs totaux')}</div>
                <div className="stat-sub">{formatNumber(globalStats.users.active)} actifs</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🎁</div>
              <div className="stat-content">
                <div className="stat-value">{formatNumber(globalStats.cases.totalOpened)}</div>
                <div className="stat-label">{t('dashboard.totalCases', 'Cases ouvertes')}</div>
                <div className="stat-sub">{formatNumber(globalStats.cases.totalSkinsObtained)} skins</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🖥️</div>
              <div className="stat-content">
                <div className="stat-value">{formatNumber(globalStats.servers.total)}</div>
                <div className="stat-label">{t('dashboard.totalServers', 'Serveurs totaux')}</div>
                <div className="stat-sub">{formatNumber(globalStats.servers.online)} en ligne</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Statistiques utilisateur */}
      {userStats && (
        <div className="user-stats">
          <h2>{t('dashboard.yourStats', 'Vos statistiques')}</h2>
          
          <div className="stats-overview">
            <div className="overview-card">
              <div className="overview-icon">📊</div>
              <div className="overview-content">
                <div className="overview-value">{userStats.progression.level}</div>
                <div className="overview-label">{t('dashboard.level', 'Niveau')}</div>
                <div className="overview-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${(userStats.progression.xp / (userStats.progression.level * 1000)) * 100}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">
                    {userStats.progression.xp.toLocaleString()} / {(userStats.progression.level * 1000).toLocaleString()} XP
                  </span>
                </div>
              </div>
            </div>

            <div className="overview-card">
              <div className="overview-icon">🎁</div>
              <div className="overview-content">
                <div className="overview-value">{userStats.cases.totalOpened}</div>
                <div className="overview-label">{t('dashboard.casesOpened', 'Cases ouvertes')}</div>
                <div className="overview-sub">{formatCurrency(userStats.cases.totalSpent)} dépensé</div>
              </div>
            </div>

            <div className="overview-card">
              <div className="overview-icon">✨</div>
              <div className="overview-content">
                <div className="overview-value">{userStats.inventory.totalSkins}</div>
                <div className="overview-label">{t('dashboard.skinsObtained', 'Skins obtenus')}</div>
                <div className="overview-sub">{formatCurrency(userStats.inventory.totalValue)} valeur</div>
              </div>
            </div>

            <div className="overview-card">
              <div className="overview-icon">🏆</div>
              <div className="overview-content">
                <div className="overview-value">{userStats.achievements.length}</div>
                <div className="overview-label">{t('dashboard.achievements', 'Achievements')}</div>
                <div className="overview-sub">{userStats.inventory.favorites} favoris</div>
              </div>
            </div>
          </div>

          {/* Graphiques */}
          <div className="charts-grid">
            {/* Progression XP */}
            <div className="chart-card">
              <h3>{t('dashboard.xpProgression', 'Progression XP')}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={progressionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="level" stroke="rgba(255,255,255,0.6)" />
                  <YAxis stroke="rgba(255,255,255,0.6)" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(20, 20, 30, 0.95)',
                      border: '1px solid rgba(162, 89, 255, 0.3)',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="xp" 
                    stroke="#a259ff" 
                    fill="url(#xpGradient)"
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a259ff" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#a259ff" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Répartition des raretés */}
            <div className="chart-card">
              <h3>{t('dashboard.rarityDistribution', 'Répartition des raretés')}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={rarityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {rarityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(20, 20, 30, 0.95)',
                      border: '1px solid rgba(162, 89, 255, 0.3)',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Distribution des armes */}
            <div className="chart-card">
              <h3>{t('dashboard.weaponDistribution', 'Distribution des armes')}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weaponData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="weapon" stroke="rgba(255,255,255,0.6)" />
                  <YAxis stroke="rgba(255,255,255,0.6)" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(20, 20, 30, 0.95)',
                      border: '1px solid rgba(162, 89, 255, 0.3)',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="count" fill="#a259ff" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Activité récente */}
            <div className="chart-card">
              <h3>{t('dashboard.recentActivity', 'Activité récente')}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.6)" />
                  <YAxis stroke="rgba(255,255,255,0.6)" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(20, 20, 30, 0.95)',
                      border: '1px solid rgba(162, 89, 255, 0.3)',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="cases" 
                    stroke="#a259ff" 
                    strokeWidth={2}
                    name={t('dashboard.cases', 'Cases')}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="skins" 
                    stroke="#3f2b96" 
                    strokeWidth={2}
                    name={t('dashboard.skins', 'Skins')}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
