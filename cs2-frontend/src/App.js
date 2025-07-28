
// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import Callback from './pages/Callback';
import Dashboard from './pages/Dashboard';
import Cases from './pages/Cases';
import Inventory from './pages/Inventory';
import Settings from './pages/Settings';
import Home from './pages/Home';
import './pages/Home.css';
import axios from 'axios';
import { setupAxiosAuth, isAuthenticated as checkIsAuthenticated, logout, verifyToken } from './utils/auth';
import { RouteTransitionWrapper, BackgroundParticles, ScrollIndicator } from './components/GlobalAnimations';
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

  // Configuration d'axios et vérification de la session au démarrage
  useEffect(() => {
    setupAxiosAuth();
    
    const checkAuth = async () => {
      console.log('Checking authentication...');
      
      try {
        const isValid = await verifyToken();
        console.log('Session verification result:', isValid);
        setIsAuthenticated(isValid);
      } catch (error) {
        console.log('Session check failed, setting isAuthenticated to false');
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
    <Router>
      <div className="app">
        <BackgroundParticles count={20} />
        <ScrollIndicator />
        <Navigation isAuthenticated={isAuthenticated} />
        <main className="main-content">
          <Routes>
            <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
            <Route path="/" element={<HomeRoute isAuthenticated={isAuthenticated} />} />
            <Route path="/home" element={<Home />} />
            <Route path="/callback" element={<Callback />} />
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
            <Route path="/cases" element={isAuthenticated ? <Cases /> : <Navigate to="/login" replace />} />
            <Route path="/inventory" element={isAuthenticated ? <Inventory /> : <Navigate to="/login" replace />} />
            <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
