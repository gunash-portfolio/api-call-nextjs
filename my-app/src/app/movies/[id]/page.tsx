'use client';

import { useEffect, useState } from 'react';
import { Movie } from '@/types/movie';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function MovieDetail() {
  const params = useParams();
  const { id } = params;
  const router = useRouter();
  
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async() =>{
    if(!window.confirm("Delete movie?")){
      return;
    }
    try{
      const response=await fetch(`/api/movies/${id}`,{
        method:'DELETE',
      });
      if (response.ok){
        router.push('/');
      }else{
        setError('Failed to delete movie');
      }
    } catch(error){
      console.error('Error deleting movie',error);
      setError('While deleting movie some error occurred');
    }
  };
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/movies/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch movie details');
        }
        const data = await response.json();
        setMovie(data.movie);
      } catch (error) {
        console.error('Error fetching movie details', error);
        setError('Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchMovie();
    }
  }, [id]);

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">Error: {error}</div>;
  if (!movie) return <div className="flex justify-center items-center min-h-screen">Movie not found</div>;

  return (
    <main className="min-h-screen p-8 md:p-12 lg:p-24">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-blue-500 hover:text-blue-700 mb-6 inline-block">
          &larr; Back to all movies
        </Link>
        
        <div className="bg-white rounded-lg overflow-hidden shadow-lg p-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">{movie.title}</h1>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3">
              {movie.id === 1 ? (
                <img 
                  src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQkUywIUXDjHSQJIaNHYVs08osgBpF5Ot-xmB_omyEZeeRP9Xug" 
                  alt={`${movie.title} poster`}
                  className="w-full rounded-lg shadow-md"
                />
              ) : (
                <div className="bg-gray-200 h-80 flex items-center justify-center rounded-lg">
                  <div className="text-gray-400 flex flex-col items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h18M3 16h18" />
                    </svg>
                    <span>No Poster</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="w-full md:w-2/3">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2 text-black">Details</h2>
                <p className="text-gray-700"><span className="font-medium">Released:</span> {new Date(movie.release_date).toLocaleDateString()}</p>
                <p className="text-gray-700 mt-2"><span className="font-medium">IMDB Rating:</span> <span className="font-bold">{movie.imdb_rating}/10</span></p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end space-x-4">
            <button 
              onClick={handleDelete} 
              className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all duration-200 active:scale-95 active:bg-red-800"
            >
              Delete Movie
            </button>
            <Link href={`/movies/${id}/edit`}>
              <button 
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200 active:scale-95 active:bg-blue-800"
              >
                Edit Movie
              </button>
            </Link>
          </div>
        </div>
      </div>
      
    </main>
  );
}
