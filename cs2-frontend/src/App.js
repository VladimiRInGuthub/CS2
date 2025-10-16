
// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import Callback from './pages/Callback';
import Dashboard from './pages/DashboardNew';
import Cases from './pages/Cases';
import Skins from './pages/Skins';
import FreeSkins from './pages/FreeSkins';
import Inventory from './pages/Inventory';
import Settings from './pages/Settings';
import Home from './pages/Home';
import Skinchanger from './pages/Skinchanger';
import Servers from './pages/Servers';
import Battlepass from './pages/Battlepass';
import Premium from './pages/Premium';
import Admin from './pages/Admin';
import './pages/Home.css';
import axios from 'axios';
import { setupAxiosAuth, logout, verifyToken } from './utils/auth';
import { BackgroundParticles, ScrollIndicator, ToastContainer } from './components/GlobalAnimations';
import './components/OrganicAnimations.css';

// Composant séparé pour gérer la route racine
const HomeRoute = ({ isAuthenticated }) => {
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Navigate to="/login" replace />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  const pushToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  };

  // Configuration d'axios et vérification de la session au démarrage
  useEffect(() => {
    setupAxiosAuth();
    
    const checkAuth = async () => {
      try {
        const isValid = await verifyToken();
        setIsAuthenticated(isValid);
      } catch (error) {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  // Gestion globale des erreurs d'authentification
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          pushToast('Session expirée. Reconnexion requise.', 'error');
          logout();
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  // Plus besoin de gérer les tokens dans l'URL avec les sessions

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="app">
        <BackgroundParticles count={20} />
        <ScrollIndicator />
        <ToastContainer toasts={toasts} />
        <Navigation isAuthenticated={isAuthenticated} />
        <main className="main-content">
          <Routes>
            <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
            <Route path="/" element={<HomeRoute isAuthenticated={isAuthenticated} />} />
            <Route path="/home" element={<Home />} />
            <Route path="/callback" element={<Callback />} />
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
            <Route path="/cases" element={isAuthenticated ? <Cases /> : <Navigate to="/login" replace />} />
            <Route path="/skins" element={isAuthenticated ? <Skins /> : <Navigate to="/login" replace />} />
            <Route path="/free-skins" element={isAuthenticated ? <FreeSkins /> : <Navigate to="/login" replace />} />
            <Route path="/inventory" element={isAuthenticated ? <Inventory /> : <Navigate to="/login" replace />} />
            <Route path="/skinchanger" element={isAuthenticated ? <Skinchanger /> : <Navigate to="/login" replace />} />
            <Route path="/servers" element={isAuthenticated ? <Servers /> : <Navigate to="/login" replace />} />
            <Route path="/battlepass" element={isAuthenticated ? <Battlepass /> : <Navigate to="/login" replace />} />
            <Route path="/premium" element={isAuthenticated ? <Premium /> : <Navigate to="/login" replace />} />
            <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" replace />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
