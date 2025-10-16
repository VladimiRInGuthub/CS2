import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

// Configuration d'axios avec credentials pour les sessions
export const setupAxiosAuth = () => {
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = API_BASE_URL;
};

// Vérifier si l'utilisateur est authentifié (session)
export const isAuthenticated = async () => {
  try {
    const response = await axios.get(`/auth/me`);
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

// Déconnecter l'utilisateur
export const logout = async () => {
  try {
    await axios.get(`/auth/logout`);
  } catch (error) {
    console.error('Logout error:', error);
  }
  window.location.href = '/login';
};

// Vérifier la validité de la session
export const verifyToken = async () => {
  try {
    const response = await axios.get(`/auth/me`);
    return response.status === 200;
  } catch (error) {
    return false;
  }
};