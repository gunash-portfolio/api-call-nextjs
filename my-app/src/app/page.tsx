'use client';
import { useState } from 'react';
import useMovies from '@/hooks/useMovies';
import MovieCard from '@/components/MovieCard';
import AddMovieCard from '@/components/AddMovieCard';
import Pagination from '@/pagination/Pagination';
import { Movie } from '@/types/movie';
export default function Home() {
  const { movies, loading, error } = useMovies();
  const [currentPage, setCurrentPage] = useState(0);
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

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <main className="min-h-screen p-8 md:p-12 lg:p-24">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-white-900 font-trajan">
        Christopher Nolan's Movie Collection
      </h1>
      
      {movies.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <MovieGrid currentMovies={currentMovies} />
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
  );
}

// Sub-components for better organization
const LoadingState = () => (
  <div className="flex justify-center items-center min-h-screen">Loading...</div>
);

const ErrorState = ({ error }: { error: string }) => (
  <div className="flex justify-center items-center min-h-screen text-red-500">
    Error: {error}
  </div>
);

const EmptyState = () => (
  <div className="max-w-6xl mx-auto">
    <p className="text-center text-gray-700 mb-6">No movies found</p>
    <div className="grid grid-cols-1 gap-6 max-w-sm mx-auto">
      <AddMovieCard />
    </div>
  </div>
);

type MovieGridProps = {
  currentMovies: Movie[];
};

const MovieGrid = ({ currentMovies }: MovieGridProps) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
    {currentMovies.map(movie => (
      <MovieCard key={movie.id} movie={movie} />
    ))}
    <AddMovieCard />
  </div>
);