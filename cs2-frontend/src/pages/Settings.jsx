import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import GlassSurface from '../components/GlassSurface';
import DarkVeil from '../components/DarkVeil';
import './Settings.css';

const Settings = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    avatar: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/me');
        setUser(response.data);
        setEditForm({
          username: response.data.username || '',
          email: response.data.email || '',
          avatar: response.data.avatar || ''
        });
        setIsLoading(false);
      } catch (error) {
        console.error('Erreur chargement utilisateur:', error);
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:5000/auth/logout');
      navigate('/login');
    } catch (error) {
      console.error('Erreur déconnexion:', error);
      navigate('/login');
    }
  };

  const handleSaveProfile = async () => {
    try {
      const response = await axios.put('http://localhost:5000/api/users/me', editForm);
      setUser(response.data);
      setIsEditing(false);
      alert('Profil mis à jour avec succès !');
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      if (error.response?.data?.message) {
        alert(`Erreur: ${error.response.data.message}`);
      } else {
        alert('Erreur lors de la sauvegarde du profil');
      }
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profil', icon: '👤' },
    { id: 'security', label: 'Sécurité', icon: '🔒' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'appearance', label: 'Apparence', icon: '🎨' },
    { id: 'about', label: 'À propos', icon: 'ℹ️' }
  ];

  if (isLoading) {
    return (
      <div className="settings-loading">
        <div className="loading-spinner"></div>
        <p>Chargement des paramètres...</p>
      </div>
    );
  }

  return (
    <div className="settings-page">
      {/* Fond animé */}
      <div className="settings-background">
        <DarkVeil 
          hueShift={200}
          noiseIntensity={0.03}
          scanlineIntensity={0.02}
          speed={0.15}
          scanlineFrequency={0.003}
          warpAmount={0.05}
        />
      </div>

      <div className="settings-container">
        {/* En-tête */}
        <GlassSurface 
          variant="card" 
          className="settings-header"
          brightness="60%"
          saturation="1.1"
        >
          <div className="settings-header-content">
            <button 
              className="back-button"
              onClick={() => navigate('/dashboard')}
            >
              ← Retour
            </button>
            <h1>Paramètres</h1>
            <div className="user-info">
              <img 
                src={user?.avatar || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjNjY2NjY2Ii8+Cjx0ZXh0IHg9IjI1IiB5PSIzMCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmaWxsPSIjRkZGRkZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5VPC90ZXh0Pgo8L3N2Zz4='} 
                alt="Avatar" 
                className="user-avatar"
              />
              <span className="username">{user?.username}</span>
            </div>
          </div>
        </GlassSurface>

        <div className="settings-content">
          {/* Navigation des onglets */}
          <GlassSurface 
            variant="nav" 
            className="settings-tabs"
            brightness="55%"
            saturation="1.05"
          >
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </GlassSurface>

          {/* Contenu des onglets */}
          <GlassSurface 
            variant="card" 
            className="settings-panel"
            brightness="55%"
            saturation="1.05"
          >
            {activeTab === 'profile' && (
              <div className="profile-tab">
                <h2>Informations du profil</h2>
                
                                 <div className="profile-section">
                   <div className="avatar-section">
                     <img 
                       src={user?.avatar || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjNjY2NjY2Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI2MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjM2IiBmaWxsPSIjRkZGRkZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5VPC90ZXh0Pgo8L3N2Zz4='} 
                       alt="Avatar" 
                       className="profile-avatar"
                     />
                   </div>

                  <div className="profile-form">
                    <div className="form-group">
                      <label>Nom d'utilisateur</label>
                      <input
                        type="text"
                        value={editForm.username}
                        onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="profile-actions">
                      {!isEditing ? (
                        <button 
                          className="edit-btn"
                          onClick={() => setIsEditing(true)}
                        >
                          Modifier le profil
                        </button>
                      ) : (
                        <div className="edit-actions">
                          <button 
                            className="save-btn"
                            onClick={handleSaveProfile}
                          >
                            Sauvegarder
                          </button>
                          <button 
                            className="cancel-btn"
                            onClick={() => {
                              setIsEditing(false);
                              setEditForm({
                                username: user?.username || '',
                                email: user?.email || '',
                                avatar: user?.avatar || ''
                              });
                            }}
                          >
                            Annuler
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="security-tab">
                <h2>Sécurité</h2>
                <div className="security-section">
                  <div className="security-item">
                    <div className="security-info">
                      <h3>Connexion Steam</h3>
                      <p>Connecté via Steam</p>
                    </div>
                    <div className="security-status connected">
                      ✓ Connecté
                    </div>
                  </div>
                  
                  <div className="security-item">
                    <div className="security-info">
                      <h3>Authentification à deux facteurs</h3>
                      <p>Ajoutez une couche de sécurité supplémentaire</p>
                    </div>
                    <button className="enable-2fa-btn">
                      Activer
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="notifications-tab">
                <h2>Notifications</h2>
                <div className="notifications-section">
                  <div className="notification-item">
                    <div className="notification-info">
                      <h3>Notifications de cases</h3>
                      <p>Recevoir des notifications pour les nouvelles cases</p>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  
                  <div className="notification-item">
                    <div className="notification-info">
                      <h3>Notifications de gains</h3>
                      <p>Recevoir des notifications pour vos gains</p>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="appearance-tab">
                <h2>Apparence</h2>
                <div className="appearance-section">
                  <div className="theme-selector">
                    <h3>Thème</h3>
                    <div className="theme-options">
                      <button className="theme-option active">
                        <div className="theme-preview dark"></div>
                        <span>Sombre</span>
                      </button>
                      <button className="theme-option">
                        <div className="theme-preview light"></div>
                        <span>Clair</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="animation-settings">
                    <h3>Animations</h3>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                    <span>Activer les animations</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'about' && (
              <div className="about-tab">
                <h2>À propos</h2>
                <div className="about-section">
                  <div className="about-item">
                    <h3>Version</h3>
                    <p>1.0.0</p>
                  </div>
                  
                  <div className="about-item">
                    <h3>Développeur</h3>
                    <p>CS2 Drop Team</p>
                  </div>
                  
                  <div className="about-item">
                    <h3>Support</h3>
                    <p>support@cs2drop.com</p>
                  </div>
                  
                  <div className="danger-zone">
                    <h3>Zone dangereuse</h3>
                    <button 
                      className="logout-btn"
                      onClick={handleLogout}
                    >
                      Se déconnecter
                    </button>
                  </div>
                </div>
              </div>
            )}
          </GlassSurface>
        </div>
      </div>
    </div>
  );
};

export default Settings; 