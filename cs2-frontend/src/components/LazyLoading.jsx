import React, { Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import './LazyLoading.css';

// Composant de chargement
const LoadingSpinner = () => {
  const { t } = useTranslation();
  
  return (
    <div className="lazy-loading">
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
        <p className="loading-text">{t('common.loading', 'Chargement...')}</p>
      </div>
    </div>
  );
};

// HOC pour le lazy loading avec Suspense
const withLazyLoading = (Component) => {
  return (props) => (
    <Suspense fallback={<LoadingSpinner />}>
      <Component {...props} />
    </Suspense>
  );
};

// Composants lazy loadés
export const LazyHome = withLazyLoading(lazy(() => import('../pages/Home')));
export const LazyDashboard = withLazyLoading(lazy(() => import('../pages/Dashboard')));
export const LazyCases = withLazyLoading(lazy(() => import('../pages/Cases')));
export const LazySkins = withLazyLoading(lazy(() => import('../pages/Skins')));
export const LazyInventory = withLazyLoading(lazy(() => import('../pages/Inventory')));
export const LazySkinchanger = withLazyLoading(lazy(() => import('../pages/Skinchanger')));
export const LazyServers = withLazyLoading(lazy(() => import('../pages/Servers')));
export const LazyBattlepass = withLazyLoading(lazy(() => import('../pages/Battlepass')));
export const LazyPremium = withLazyLoading(lazy(() => import('../pages/Premium')));
export const LazySettings = withLazyLoading(lazy(() => import('../pages/Settings')));
export const LazyAdmin = withLazyLoading(lazy(() => import('../pages/Admin')));
export const LazyLogin = withLazyLoading(lazy(() => import('../pages/Login')));

// Composants de fonctionnalités avancées
export const LazyDashboardComponent = withLazyLoading(lazy(() => import('../components/Dashboard')));
export const LazyLeaderboard = withLazyLoading(lazy(() => import('../components/Leaderboard')));
export const LazyAchievements = withLazyLoading(lazy(() => import('../components/Achievements')));
export const LazyBattlepassComponent = withLazyLoading(lazy(() => import('../components/Battlepass')));
export const LazyPremiumComponent = withLazyLoading(lazy(() => import('../components/Premium')));
export const LazyAdminComponent = withLazyLoading(lazy(() => import('../components/Admin')));

export default LoadingSpinner;
