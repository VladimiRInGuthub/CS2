import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

export const useInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/inventory', { withCredentials: true });
      setInventory(res.data.inventory || []);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  return { inventory, loading, error, refetch: fetchInventory, refreshInventory: fetchInventory };
};

export default useInventory;


