import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import CoinIcon from '../components/CoinIcon';
import SkinStats from '../components/SkinStats';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import './DashboardNew.css';

const DashboardNew = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const userRes = await axios.get('/api/users/me', { withCredentials: true });
        setUser(userRes.data);
        
        // Mock stats pour la démonstration
        setStats({
          totalCasesOpened: 25,
          totalSkinsObtained: 18,
          favoriteWeapon: 'AK-47',
          currentLevel: 15,
          xpToNext: 250,
          isPremium: false,
          recentActivity: [
            { type: 'case_opened', item: 'AK-47 | Redline', time: '2 min' },
            { type: 'skin_applied', item: 'AWP | Dragon Lore', time: '5 min' },
            { type: 'server_joined', item: 'Deathmatch Pro #1', time: '10 min' }
          ]
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Erreur chargement:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      }
    };

    loadData();
  }, [navigate]);

  const quickActions = [
    { 
      title: 'Ouvrir des Cases', 
      icon: '📦', 
      description: 'Découvrez de nouveaux skins',
      link: '/cases',
      color: '#4a90e2'
    },
    { 
      title: 'Mon Inventaire', 
      icon: '🎒', 
      description: 'Gérez vos skins',
      link: '/inventory',
      color: '#10b981'
    },
    { 
      title: 'Serveurs', 
      icon: '🖥️', 
      description: 'Rejoignez des parties',
      link: '/servers',
      color: '#f59e0b'
    },
    { 
      title: 'Skinchanger', 
      icon: '🎨', 
      description: 'Changez vos skins',
      link: '/skinchanger',
      color: '#8b5cf6'
    }
  ];

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Chargement du Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">
          Bienvenue dans votre espace de jeu personnel
        </p>
      </div>

      <div className="dashboard-grid">
        {/* Profil utilisateur */}
        <Card variant="glass" className="profile-card">
          <div className="profile-header">
            <h3 className="card-title">👤 Profil</h3>
          </div>
          
          <div className="profile-info">
            <img
              src={user.avatar || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjNjY2NjY2Ii8+Cjx0ZXh0IHg9IjMwIiB5PSIzNSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjRkZGRkZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5VPC90ZXh0Pgo8L3N2Zz4='}
              alt="Avatar"
              className="profile-avatar"
            />
            <div className="profile-details">
              <h4 className="profile-name">{user.username}</h4>
              <p className="profile-date">
                Joueur depuis {new Date(user.createdAt).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>

          <div className="coins-display">
            <CoinIcon size={20} />
            <span className="coins-amount">{user.coins} coins</span>
          </div>

          {stats && (
            <div className="profile-stats">
              <h4 className="stats-title">📊 Statistiques</h4>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-value">{stats.totalCasesOpened}</div>
                  <div className="stat-label">Cases ouvertes</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{stats.totalSkinsObtained}</div>
                  <div className="stat-label">Skins obtenus</div>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Actions rapides */}
        <Card variant="glass" className="quick-actions-card">
          <div className="card-header">
            <h3 className="card-title">⚡ Actions Rapides</h3>
          </div>
          <div className="quick-actions-grid">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.link} className="quick-action-item">
                <div className="action-icon" style={{ color: action.color }}>
                  {action.icon}
                </div>
                <div className="action-content">
                  <h4 className="action-title">{action.title}</h4>
                  <p className="action-description">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        {/* Activité récente */}
        <Card variant="glass" className="activity-card">
          <div className="card-header">
            <h3 className="card-title">📈 Activité Récente</h3>
          </div>
          <div className="activity-list">
            {stats?.recentActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">
                  {activity.type === 'case_opened' && '📦'}
                  {activity.type === 'skin_applied' && '🎨'}
                  {activity.type === 'server_joined' && '🖥️'}
                </div>
                <div className="activity-content">
                  <p className="activity-text">{activity.item}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Statistiques détaillées */}
        <Card variant="glass" className="stats-card">
          <div className="card-header">
            <h3 className="card-title">📊 Statistiques Détaillées</h3>
          </div>
          <SkinStats />
        </Card>

        {/* Niveau et progression */}
        <Card variant="glass" className="level-card">
          <div className="card-header">
            <h3 className="card-title">🏆 Niveau & Progression</h3>
          </div>
          <div className="level-content">
            <div className="level-info">
              <div className="level-number">Niveau {stats?.currentLevel}</div>
              <div className="level-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${((stats?.currentLevel * 100) / (stats?.currentLevel + 1))}%` }}
                  ></div>
                </div>
                <div className="progress-text">
                  {stats?.xpToNext} XP jusqu'au niveau suivant
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Premium Status */}
        <Card variant="glass" className="premium-card">
          <div className="card-header">
            <h3 className="card-title">⭐ Statut Premium</h3>
          </div>
          <div className="premium-content">
            {stats?.isPremium ? (
              <div className="premium-active">
                <div className="premium-icon">👑</div>
                <div className="premium-text">
                  <h4>Premium Actif</h4>
                  <p>Profitez de tous les avantages premium</p>
                </div>
              </div>
            ) : (
              <div className="premium-inactive">
                <div className="premium-icon">⭐</div>
                <div className="premium-text">
                  <h4>Passer à Premium</h4>
                  <p>Débloquez des avantages exclusifs</p>
                </div>
                <Link to="/premium">
                  <Button variant="primary" size="small">
                    Découvrir
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardNew;