'use client';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import useMovies from '@/hooks/useMovies';
import useUserFilms from '@/hooks/useUserFilms';
import MovieCard from '@/components/MovieCard';
import AddMovieCard from '@/components/AddMovieCard';
import Pagination from '@/pagination/Pagination';
import { Movie } from '@/types/movie';

export default function Home() {
  const { data: session, status } = useSession();
  const { movies, loading, error } = useMovies();
  const { isFavorite, addFavorite, removeFavorite, getFavoriteId } = useUserFilms();
  const [currentPage, setCurrentPage] = useState(0);
  const [togglingMovieId, setTogglingMovieId] = useState<number | null>(null);
  const moviesPerPage = 6;
  
  // Calculate pagination values
  const totalPages = Math.ceil(movies.length / moviesPerPage);
  const currentMovies = movies.slice(
    currentPage * moviesPerPage, 
    (currentPage + 1) * moviesPerPage
  );

  // Pagination handlers
  const goToNextPage = () => currentPage < totalPages - 1 && setCurrentPage(p => p + 1);
  const goToPreviousPage = () => currentPage > 0 && setCurrentPage(p => p - 1);
  const goToPage = (pageNumber: number) => setCurrentPage(pageNumber);

  // Favorite toggle handler
  const handleToggleFavorite = async (movieId: number) => {
    if (status !== 'authenticated') {
      alert('Please sign in to add favorites');
      return;
    }

    setTogglingMovieId(movieId);
    
    if (isFavorite(movieId)) {
      const userFilmId = getFavoriteId(movieId);
      if (userFilmId) {
        const result = await removeFavorite(userFilmId);
        if (!result.success) {
          alert(result.error || 'Failed to remove favorite');
        }
      }
    } else {
      const result = await addFavorite(movieId);
      if (!result.success) {
        alert(result.error || 'Failed to add favorite');
      }
    }
    
    setTogglingMovieId(null);
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-gray-900 via-black to-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <h2 className="text-xl font-bold text-white">
                🎬 Cinema
              </h2>
            </div>

            {/* Auth Section */}
            <div className="flex items-center gap-4">
              {status === 'loading' && (
                <span className="text-gray-400 text-sm">Loading...</span>
              )}
              
              {status === 'authenticated' && session?.user && (
                <>
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 text-gray-300 hover:text-white text-sm font-medium transition-colors duration-200"
                  >
                    Dashboard
                  </Link>
                  <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div className="flex flex-col">
                      <span className="text-sm text-white font-medium">
                        {session.user.name}
                      </span>
          
                    </div>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-lg"
                  >
                    Sign Out
                  </button>
                </>
              )}
              
              {status === 'unauthenticated' && (
                <>
                  <Link
                    href="/auth/login"
                    className="px-4 py-2 text-gray-300 hover:text-white text-sm font-medium transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="px-6 py-2 bg-white hover:bg-gray-200 text-black text-sm font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-white/20"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 px-4 sm:px-6 lg:px-8 pb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-white font-trajan">
          Christopher Nolan's Movie Collection
        </h1>
      
        {movies.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <MovieGrid 
              currentMovies={currentMovies}
              isFavorite={isFavorite}
              onToggleFavorite={handleToggleFavorite}
              togglingMovieId={togglingMovieId}
            />
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
                onNext={goToNextPage}
                onPrevious={goToPreviousPage}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

// Sub-components for better organization
const LoadingState = () => (
  <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
      <p className="text-gray-400">Loading movies...</p>
    </div>
  </div>
);

const ErrorState = ({ error }: { error: string }) => (
  <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
    <div className="text-center p-8 bg-gray-800/50 border border-gray-600 rounded-lg">
      <p className="text-gray-200 text-lg">⚠️ Error: {error}</p>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="max-w-6xl mx-auto">
    <p className="text-center text-gray-400 mb-6 text-lg">No movies found. Add your first movie!</p>
    <div className="grid grid-cols-1 gap-6 max-w-sm mx-auto">
      <AddMovieCard />
    </div>
  </div>
);

type MovieGridProps = {
  currentMovies: Movie[];
  isFavorite: (movieId: number) => boolean;
  onToggleFavorite: (movieId: number) => void;
  togglingMovieId: number | null;
};

const MovieGrid = ({ currentMovies, isFavorite, onToggleFavorite, togglingMovieId }: MovieGridProps) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
    {currentMovies.map(movie => (
      <MovieCard 
        key={movie.id} 
        movie={movie}
        isFavorite={isFavorite(movie.id)}
        onToggleFavorite={onToggleFavorite}
        isToggling={togglingMovieId === movie.id}
      />
    ))}
    <AddMovieCard />
  </div>
);