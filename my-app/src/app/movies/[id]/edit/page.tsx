'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditMovie() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    release_date: '',
    imdb_rating: 0
  });

  // Fetch current movie data
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/movies/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch movie details');
        }
        const data = await response.json();
        
        // Format the date to YYYY-MM-DD for the date input
        const movie = data.movie;
        const formattedDate = new Date(movie.release_date).toISOString().split('T')[0];
        
        setFormData({
          title: movie.title,
          release_date: formattedDate,
          imdb_rating: movie.imdb_rating
        });
      } catch (error) {
        console.error('Error fetching movie details', error);
        setError('Failed to load movie details');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchMovie();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'imdb_rating' ? (value === '' ? 0 : parseFloat(value) || 0) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title || !formData.release_date || formData.imdb_rating <= 0) {
      setError('Please fill out all fields correctly');
      return;
    }

    try {
      setError(null);
      setIsSubmitting(true);
      
      const response = await fetch(`/api/movies/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update movie');
      }

      // Redirect to the movie detail page
      router.push(`/movies/${id}`);
      router.refresh();
    } catch (err) {
      console.error('Error updating movie:', err);
      setError('Failed to update movie. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">Loading...</div>;
  if (error && isLoading) return <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-gray-300">Error: {error}</div>;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8 md:p-12 lg:p-24">
      <div className="max-w-2xl mx-auto">
        <Link href={`/movies/${id}`} className="text-white hover:text-gray-300 mb-6 inline-block">
          &larr; Back to movie details
        </Link>
        
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-6 text-white">Edit Movie</h1>
          
          {error && (
            <div className="bg-gray-800 border border-gray-600 text-gray-300 px-4 py-3 rounded mb-4" role="alert">
              <p>⚠️ {error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                Movie Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-700 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-white focus:border-transparent"
                placeholder="Enter movie title"
                required
              />
            </div>
            
            <div>
              <label htmlFor="release_date" className="block text-sm font-medium text-gray-300 mb-2">
                Release Date
              </label>
              <input
                type="date"
                id="release_date"
                name="release_date"
                value={formData.release_date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-700 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-white focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label htmlFor="imdb_rating" className="block text-sm font-medium text-gray-300 mb-2">
                IMDB Rating (0-10)
              </label>
              <input
                type="number"
                id="imdb_rating"
                name="imdb_rating"
                min="0"
                max="10"
                step="0.1"
                value={formData.imdb_rating}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-700 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-white focus:border-transparent"
                placeholder="Enter IMDB rating"
                required
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 bg-white text-black rounded-lg transition-all duration-200 ${
                  isSubmitting 
                    ? 'opacity-70 cursor-not-allowed' 
                    : 'hover:bg-gray-200 active:scale-95'
                }`}
              >
                {isSubmitting ? 'Saving...' : 'Update Movie'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}