import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

// Hook pour les requêtes API avec cache et optimisations
export const useApi = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refetch, setRefetch] = useState(0);
  
  const {
    method = 'GET',
    body = null,
    headers = {},
    cache = true,
    cacheTime = 300000, // 5 minutes
    retry = 3,
    retryDelay = 1000,
    onSuccess = null,
    onError = null,
    enabled = true
  } = options;

  const cacheRef = useRef(new Map());
  const abortControllerRef = useRef(null);

  const fetchData = useCallback(async (isRetry = false) => {
    if (!enabled) return;

    // Annuler la requête précédente si elle existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Créer un nouveau AbortController
    abortControllerRef.current = new AbortController();

    // Vérifier le cache
    const cacheKey = `${method}:${url}:${JSON.stringify(body)}`;
    if (cache && !isRetry && cacheRef.current.has(cacheKey)) {
      const cachedData = cacheRef.current.get(cacheKey);
      if (Date.now() - cachedData.timestamp < cacheTime) {
        setData(cachedData.data);
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const config = {
        method,
        url,
        data: body,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        signal: abortControllerRef.current.signal,
        timeout: 10000, // 10 secondes de timeout
        withCredentials: true
      };

      const response = await axios(config);
      
      // Mettre en cache la réponse
      if (cache && response.status === 200) {
        cacheRef.current.set(cacheKey, {
          data: response.data,
          timestamp: Date.now()
        });
      }

      setData(response.data);
      onSuccess?.(response.data);
    } catch (err) {
      if (err.name === 'AbortError') {
        return; // Requête annulée, ne pas traiter comme une erreur
      }

      const errorMessage = err.response?.data?.message || err.message || 'Erreur inconnue';
      setError(errorMessage);
      onError?.(err);

      // Retry automatique
      if (retry > 0 && !isRetry) {
        setTimeout(() => {
          fetchData(true);
        }, retryDelay);
      }
    } finally {
      setLoading(false);
    }
  }, [url, method, body, headers, cache, cacheTime, retry, retryDelay, onSuccess, onError, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refetch]);

  // Nettoyer le cache périodiquement
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      for (const [key, value] of cacheRef.current.entries()) {
        if (now - value.timestamp > cacheTime) {
          cacheRef.current.delete(key);
        }
      }
    }, 60000); // Nettoyage toutes les minutes

    return () => {
      clearInterval(cleanup);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [cacheTime]);

  const refetchData = useCallback(() => {
    setRefetch(prev => prev + 1);
  }, []);

  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: refetchData,
    clearCache
  };
};

// Hook pour les requêtes POST/PUT/DELETE
export const useMutation = (url, options = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const {
    method = 'POST',
    headers = {},
    onSuccess = null,
    onError = null,
    invalidateCache = true
  } = options;

  const mutate = useCallback(async (body) => {
    setLoading(true);
    setError(null);

    try {
      const config = {
        method,
        url,
        data: body,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        withCredentials: true,
        timeout: 15000 // 15 secondes pour les mutations
      };

      const response = await axios(config);
      setData(response.data);
      onSuccess?.(response.data);

      // Invalider le cache si nécessaire
      if (invalidateCache) {
        // Ici on pourrait implémenter une logique d'invalidation de cache
        // Par exemple, vider le cache des utilisateurs après une modification
      }

      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Erreur inconnue';
      setError(errorMessage);
      onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, method, headers, onSuccess, onError, invalidateCache]);

  return {
    mutate,
    loading,
    error,
    data
  };
};

// Hook pour les requêtes avec pagination
export const usePaginatedApi = (url, options = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const {
    limit = 20,
    cache = true,
    ...apiOptions
  } = options;

  const { data: responseData, loading: apiLoading, error: apiError, refetch } = useApi(
    `${url}?page=${page}&limit=${limit}`,
    {
      ...apiOptions,
      cache,
      onSuccess: (response) => {
        if (page === 1) {
          setData(response.data || response);
        } else {
          setData(prev => [...prev, ...(response.data || response)]);
        }
        setHasMore(response.pagination ? page < response.pagination.pages : false);
      }
    }
  );

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [loading, hasMore]);

  const reset = useCallback(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
    refetch();
  }, [refetch]);

  return {
    data,
    loading: apiLoading,
    error: apiError,
    hasMore,
    loadMore,
    reset,
    refetch
  };
};

// Hook pour les requêtes en temps réel (polling)
export const useRealtimeApi = (url, options = {}) => {
  const {
    interval = 30000, // 30 secondes par défaut
    enabled = true,
    ...apiOptions
  } = options;

  const { data, loading, error, refetch } = useApi(url, {
    ...apiOptions,
    cache: false // Pas de cache pour les données temps réel
  });

  useEffect(() => {
    if (!enabled) return;

    const intervalId = setInterval(() => {
      refetch();
    }, interval);

    return () => clearInterval(intervalId);
  }, [enabled, interval, refetch]);

  return {
    data,
    loading,
    error,
    refetch
  };
};

// Hook pour optimiser les performances des listes
export const useVirtualizedList = (items, options = {}) => {
  const {
    itemHeight = 60,
    containerHeight = 400,
    overscan = 5
  } = options;

  const [scrollTop, setScrollTop] = useState(0);

  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + overscan,
    items.length
  );

  const visibleItems = items.slice(visibleStart, visibleEnd);
  const totalHeight = items.length * itemHeight;
  const offsetY = visibleStart * itemHeight;

  const onScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    offsetY,
    onScroll,
    containerHeight
  };
};

export default useApi;
