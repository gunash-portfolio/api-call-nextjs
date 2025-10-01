import Link from 'next/link';
import { Movie } from '@/types/movie';

export default function MovieCard({ movie }: { movie: Movie }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105">
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