import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Plus de token: la session est gérée par cookie httpOnly côté serveur
const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/dashboard');
  }, [navigate]);

  return <p style={{ color: '#fff', textAlign: 'center' }}>Connexion en cours...</p>;
};

export default Callback;
