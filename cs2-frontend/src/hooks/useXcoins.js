import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

export const useXcoins = () => {
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCoins = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/users/me', { withCredentials: true });
      setCoins(res.data.coins || 0);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoins();
  }, [fetchCoins]);

  const mutateCoins = (delta) => setCoins((c) => Math.max(0, c + delta));

  return { coins, loading, error, refetch: fetchCoins, mutateCoins };
};

export default useXcoins;


