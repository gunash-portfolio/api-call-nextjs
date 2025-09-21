'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddMovie() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    release_date: '',
    imdb_rating: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'imdb_rating' ? parseFloat(value) : value
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
      
      const response = await fetch('/api/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add movie');
      }

      // Get the newly created movie data from the response
      const data = await response.json();
      
      // Redirect to the new movie's detail page instead of the homepage
      if (data.movie && data.movie.id) {
        router.push(`/movies/${data.movie.id}`);
      } else {
        // Fallback to homepage if we don't get the movie ID for some reason
        router.push('/');
      }
      router.refresh();
    } catch (err) {
      console.error('Error adding movie:', err);
      setError('Failed to add movie. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen p-8 md:p-12 lg:p-24">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-blue-500 hover:text-blue-700 mb-6 inline-block">
          &larr; Back to all movies
        </Link>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-6 text-gray-900">Add New Movie</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Movie Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                placeholder="Enter movie title"
                required
              />
            </div>
            
            <div>
              <label htmlFor="release_date" className="block text-sm font-medium text-gray-700 mb-1">
                Release Date
              </label>
              <input
                type="date"
                id="release_date"
                name="release_date"
                value={formData.release_date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                required
              />
            </div>
            
            <div>
              <label htmlFor="imdb_rating" className="block text-sm font-medium text-gray-700 mb-1">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                placeholder="Enter IMDB rating"
                required
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 bg-blue-600 text-white rounded-md transition-all duration-200 ${
                  isSubmitting 
                    ? 'opacity-70 cursor-not-allowed' 
                    : 'hover:bg-blue-700 active:scale-95 active:bg-blue-800 active:shadow-inner'
                }`}
              >
                {isSubmitting ? 'Saving...' : 'Add Movie'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}