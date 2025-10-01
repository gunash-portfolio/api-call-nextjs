'use client';
import { useEffect, useState } from 'react';
import { Movie } from '@/types/movie';
import Link from 'next/link';
import MovieCard from '@/components/MovieCard';
import AddMovieCard from '@/components/AddMovieCard';
export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const moviesPerPage = 6;

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

  // Calculate total pages
  const totalPages = Math.ceil(movies.length / moviesPerPage);
  
  // Get current page movies
  const currentMovies = movies.slice(
    currentPage * moviesPerPage, 
    (currentPage + 1) * moviesPerPage
  );

  // Page change handlers
  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (error) return <div className="lex justify-center items-center min-h-screen text-red-500">Error: {error}</div>;

  return (
    <main className="min-h-screen p-8 md:p-12 lg:p-24">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-white-900 font-trajan">Christopher Nolan's Movie Collection</h1>      
      
      {movies.length === 0 ? (
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-gray-700 mb-6">No movies found</p>
          
          <div className="grid grid-cols-1 gap-6 max-w-sm mx-auto">
            <AddMovieCard/>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {currentMovies.map((movie) => (
             <MovieCard key={movie.id} movie={movie}/>
            ))}
            
            <AddMovieCard/>
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="inline-flex rounded-md shadow">
                <button 
                  onClick={goToPreviousPage}
                  disabled={currentPage === 0}
                  className={`px-4 py-2 text-sm font-medium rounded-l-md transition-all duration-200 
                    ${currentPage === 0 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-inner active:bg-gray-200 active:scale-95 active:shadow-inner'
                    } border border-gray-300`}
                >
                  Previous
                </button>
                
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToPage(index)}
                    className={`px-4 py-2 text-sm font-medium border-t border-b border-gray-300 transition-all duration-200
                      ${currentPage === index
                        ? 'bg-black-600 text-white shadow-inner'
                        : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-inner active:bg-gray-200 active:scale-95 active:shadow-inner'
                      }`}
                  >
                    {index + 1}
                  </button>
                ))}
                
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages - 1}
                  className={`px-4 py-2 text-sm font-medium rounded-r-md transition-all duration-200
                    ${currentPage === totalPages - 1
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-inner active:bg-gray-200 active:scale-95 active:shadow-inner'
                    } border border-gray-300`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </main>
  );
}