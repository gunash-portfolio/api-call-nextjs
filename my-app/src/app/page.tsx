'use client';
import { useEffect, useState } from 'react';
import { Movie } from '@/types/movie';
import Link from 'next/link';

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/movies');
        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }
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

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">Error: {error}</div>;

  return (
    <main className="min-h-screen p-8 md:p-12 lg:p-24">
<h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-white-900 font-trajan">Christopher Nolan's Movie Collection</h1>      
      
      {movies.length === 0 ? (
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-gray-700 mb-6">No movies found</p>
          
          <div className="grid grid-cols-1 gap-6 max-w-sm mx-auto">
            <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105">
              <Link href="/movies/add" className="block">
                <div className="h-48 bg-blue-100 flex items-center justify-center overflow-hidden">
                  <div className="text-blue-600 flex flex-col items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-bold text-gray-900 hover:text-blue-600 text-center">Add New Movie</h2>
                </div>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {movies. map((movie) => (
            <div key={movie.id} className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105">
              <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                {movie.id === 1 ? (
                  <img 
                    src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQkUywIUXDjHSQJIaNHYVs08osgBpF5Ot-xmB_omyEZeeRP9Xug" 
                    alt={`${movie.title} poster`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="text-gray-400 flex flex-col items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h18M3 16h18" />
                    </svg>
                    <span>No Poster</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <Link href={`/movies/${movie.id}`} className="block">
                  <h2 className="text-xl font-bold text-gray-900 hover:text-blue-600">{movie.title}</h2>
                </Link>
                <div className="mt-2 text-sm text-gray-700">
                  <p>Released: {new Date(movie.release_date).toLocaleDateString()}</p>
                  <p className="mt-1">Rating: <span className="font-bold">{movie.imdb_rating}/10</span></p>
                </div>
              </div>
            </div>
          ))}
          
          <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105">
            <Link href="/movies/add" className="block">
              <div className="h-48 bg-blue-100 flex items-center justify-center overflow-hidden">
                <div className="text-blue-600 flex flex-col items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              </div>
              <div className="p-4">
                <h2 className="text-xl font-bold text-gray-900 hover:text-blue-600 text-center">Add New Movie</h2>
              </div>
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
