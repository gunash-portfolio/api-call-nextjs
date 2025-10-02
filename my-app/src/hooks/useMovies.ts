import { useState, useEffect } from 'react';
import { Movie } from '@/types/movie';

const useMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/movies');
        if (!response.ok) throw new Error('Failed to fetch movies');
        const data = await response.json();
        setMovies(data.movies || data);
      } catch (error) {
        console.error('Error fetching movies', error);
        setError('Failed to load movies');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovies();
  }, []);

  return { movies, loading, error };
};

export default useMovies;