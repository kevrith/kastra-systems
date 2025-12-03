import { useState, useEffect, useCallback } from 'react';
import { get } from '../services/api';

//  Custom hook for data fetching
//  Provides loading, error, and data states with automatic fetching
 
const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    initialData = null,
    skip = false, // Skip initial fetch
    onSuccess,
    onError,
    dependencies = []
  } = options;

  // Set initial data if provided
  useEffect(() => {
    if (initialData) {
      setData(initialData);
      setLoading(false);
    }
  }, [initialData]);

  // Fetch data function
  const fetchData = useCallback(async () => {
    if (skip || !url) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await get(url);
      setData(response);

      if (onSuccess) {
        onSuccess(response);
      }

      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch data';
      setError(errorMessage);

      if (onError) {
        onError(err);
      }

      return null;
    } finally {
      setLoading(false);
    }
  }, [url, skip, onSuccess, onError]);

  // Fetch on mount and when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  // Refetch function
  const refetch = () => {
    return fetchData();
  };

  // Reset function
  const reset = () => {
    setData(initialData);
    setError(null);
    setLoading(false);
  };

  return {
    data,
    loading,
    error,
    refetch,
    reset,
    setData
  };
};

// Custom hook for manual data fetching
// Only fetches when explicitly called
 
export const useLazyFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);

      const queryString = new URLSearchParams(params).toString();
      const fullUrl = queryString ? `${url}?${queryString}` : url;
      
      const response = await get(fullUrl);
      setData(response);

      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch data';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [url]);

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  return {
    data,
    loading,
    error,
    execute,
    reset
  };
};

// Custom hook for paginated data fetching
 
export const usePaginatedFetch = (url, itemsPerPage = 10) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchPage = useCallback(async (pageNumber) => {
    try {
      setLoading(true);
      setError(null);

      const response = await get(`${url}?page=${pageNumber}&limit=${itemsPerPage}`);
      
      // Adjust based on your API response structure
      const items = Array.isArray(response) ? response : response.data || [];
      const total = response.total || items.length;
      
      setData(items);
      setTotalItems(total);
      setTotalPages(Math.ceil(total / itemsPerPage));
      setPage(pageNumber);

      return items;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch data';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, [url, itemsPerPage]);

  useEffect(() => {
    fetchPage(page);
  }, [fetchPage, page]);

  const nextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setPage(pageNumber);
    }
  };

  const refetch = () => {
    return fetchPage(page);
  };

  return {
    data,
    loading,
    error,
    page,
    totalPages,
    totalItems,
    nextPage,
    prevPage,
    goToPage,
    refetch,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
};

/**
 * Custom hook for infinite scroll data fetching
 */
export const useInfiniteFetch = (url, itemsPerPage = 10) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchMore = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      setError(null);

      const response = await get(`${url}?page=${page}&limit=${itemsPerPage}`);
      const newItems = Array.isArray(response) ? response : response.data || [];

      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setData(prev => [...prev, ...newItems]);
        setPage(prev => prev + 1);
      }

      return newItems;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch data';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, [url, page, loading, hasMore, itemsPerPage]);

  useEffect(() => {
    fetchMore();
  }, []); // Only fetch on mount

  const reset = () => {
    setData([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  };

  return {
    data,
    loading,
    error,
    hasMore,
    fetchMore,
    reset
  };
};

export default useFetch;