'use client';
import { useEffect, useState } from 'react';
import {Movie} from '@/types/movie';


export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() =>{
    const fetchMovies = async () => {
      try{
        setLoading(true);
        const response = await fetch('/api/movies');
        if (!response.ok){
          throw new Error('Failed to fetch movies');
        }
        const data = await response.json();
        setMovies(data.movies);
      }catch(error){
        console.error('Error fetching movies', error);
        setError('Failed to load movies'); 
      } finally{
        setLoading(false);
      }

    };
    fetchMovies();
  },[]);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
    <div className='z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex'>
      <h1 className='text-4xl font-bold mb-6'>Movie List</h1>
      {movies.length===0 ? (
        <p>No movie</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-black">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white-900 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white-900 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white-900 uppercase tracking-wider">Release Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white-900 uppercase tracking-wider">IMDB Rating</th>
                </tr>
              </thead>
              <tbody className="bg-black divide-y divide-gray-200">
                {movies.map((movie) => (
                  <tr key={movie.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-white-900">{movie.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-white-900">{movie.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-white-900">
                      {new Date(movie.release_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-white-900">{movie.imdb_rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      )}
    </div>
    </main>
  );
}
