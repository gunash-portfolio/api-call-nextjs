import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export interface FavoriteMovie {
  id: number;
  title: string;
  release_date: Date;
  imdb_rating: number;
  userFilmId: number;
  addedAt: Date;
}

export default function useUserFilms() {
  const { data: session, status } = useSession();
  const [favorites, setFavorites] = useState<FavoriteMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = async () => {
    if (status !== 'authenticated') {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/user-films');
      
      if (!response.ok) {
        throw new Error('Failed to fetch favorites');
      }
      
      const data = await response.json();
      setFavorites(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (movieId: number) => {
    try {
      const response = await fetch('/api/user-films', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add favorite');
      }

      const newFavorite = await response.json();
      setFavorites(prev => [newFavorite, ...prev]);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'An error occurred',
      };
    }
  };

  const removeFavorite = async (userFilmId: number) => {
    try {
      const response = await fetch(`/api/user-films/${userFilmId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove favorite');
      }

      setFavorites(prev => prev.filter(f => f.userFilmId !== userFilmId));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'An error occurred',
      };
    }
  };

  const isFavorite = (movieId: number) => {
    return favorites.some(f => f.id === movieId);
  };

  const getFavoriteId = (movieId: number) => {
    return favorites.find(f => f.id === movieId)?.userFilmId;
  };

  useEffect(() => {
    fetchFavorites();
  }, [status]);

  return {
    favorites,
    loading,
    error,
    addFavorite,
    removeFavorite,
    isFavorite,
    getFavoriteId,
    refetch: fetchFavorites,
  };
}

