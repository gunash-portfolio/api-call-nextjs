import Link from 'next/link';
import { Movie } from '@/types/movie';
import { useSession } from 'next-auth/react';

interface MovieCardProps {
  movie: Movie;
  isFavorite?: boolean;
  onToggleFavorite?: (movieId: number) => void;
  isToggling?: boolean;
}

export default function MovieCard({ movie, isFavorite = false, onToggleFavorite, isToggling = false }: MovieCardProps) {
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105 relative">
      {/* Favorite Button - Only show when authenticated */}
      {isAuthenticated && onToggleFavorite && (
        <button
          onClick={() => onToggleFavorite(movie.id)}
          disabled={isToggling}
          className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all duration-200 flex items-center justify-center disabled:opacity-50"
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isToggling ? (
            <span className="text-xl">⏳</span>
          ) : (
            <span className={`text-xl ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}>
              {isFavorite ? '❤️' : '🤍'}
            </span>
          )}
        </button>
      )}
      
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
  );
}