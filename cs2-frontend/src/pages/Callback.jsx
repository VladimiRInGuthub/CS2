import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } else {
      navigate('/login'); // si pas de token
    }
  }, [navigate]);

  return <p style={{ color: '#fff', textAlign: 'center' }}>Connexion en cours...</p>;
};

export default Callback;
