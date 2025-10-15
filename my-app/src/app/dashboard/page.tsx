'use client'
import {useSession, signOut} from 'next-auth/react';
import Link from 'next/link';
import useUserFilms, { FavoriteMovie } from '@/hooks/useUserFilms';
import { useState } from 'react';

export default function Dashboard(){
    const {data: session,status} = useSession();
    const { favorites, loading: favoritesLoading, removeFavorite } = useUserFilms();
    const [removingId, setRemovingId] = useState<number | null>(null);

    if(status === 'loading' || favoritesLoading){
        return <LoadingState/>
    }

    if(status === 'unauthenticated'){
        return <UnauthenticatedState/>
    }

    const handleRemoveFavorite = async (userFilmId: number) => {
        setRemovingId(userFilmId);
        const result = await removeFavorite(userFilmId);
        if (!result.success) {
            alert(result.error || 'Failed to remove favorite');
        }
        setRemovingId(null);
    };

    return(
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
            <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-gray-900 via-black to-gray-900 border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-4">
                            <h2 className="text-xl font-bold text-white">
                                🎬 Dashboard
                            </h2>
                            <Link
                                href="/"
                                className="px-4 py-2 text-gray-300 hover:text-white text-sm font-medium transition-colors duration-200"
                            >
                                Home
                            </Link>
                        </div>
                        <div className='flex items-center gap-4'>
                            {session?.user && (
                                <>
                                <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700">
                                <div className="flex flex-col">
                                    <span className="text-sm text-white font-medium">
                                        {session.user.name}
                                    </span>
                                </div>
                                </div>
                                <button onClick={()=>signOut()}
                                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-lg">

                                    Sign Out
                                </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
            <main className="pt-24 px-4 sm:px-6 lg:px-8 pb-12">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-white">
                    My Favorite Films
                </h1>
                <p className="text-center text-gray-400 mb-8">
                    Welcome back, {session?.user?.name}! Here are your favorite movies.
                </p>
                
                {favorites.length === 0 ? (
                    <div className="max-w-2xl mx-auto bg-gray-800/30 rounded-lg p-12 border border-gray-700 text-center">
                        <div className="text-6xl mb-4">🎬</div>
                        <h3 className="text-xl font-semibold text-white mb-2">No favorite films yet</h3>
                        <p className="text-gray-400 mb-6">
                            Start adding your favorite movies from the home page!
                        </p>
                        <Link
                            href="/"
                            className="inline-block px-6 py-3 bg-white hover:bg-gray-200 text-black text-sm font-semibold rounded-lg transition-all duration-200 shadow-lg"
                        >
                            Browse Movies
                        </Link>
                    </div>
                ) : (
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {favorites.map((movie) => (
                                <FavoriteMovieCard
                                    key={movie.userFilmId}
                                    movie={movie}
                                    onRemove={handleRemoveFavorite}
                                    isRemoving={removingId === movie.userFilmId}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div> 
    );
}
// Favorite Movie Card Component
interface FavoriteMovieCardProps {
    movie: FavoriteMovie;
    onRemove: (userFilmId: number) => void;
    isRemoving: boolean;
}

const FavoriteMovieCard = ({ movie, onRemove, isRemoving }: FavoriteMovieCardProps) => {
    const releaseYear = new Date(movie.release_date).getFullYear();
    
    return (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-all duration-200 hover:shadow-lg hover:shadow-white/10">
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-white flex-1">{movie.title}</h3>
                <button
                    onClick={() => onRemove(movie.userFilmId)}
                    disabled={isRemoving}
                    className="ml-2 text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                    title="Remove from favorites"
                >
                    {isRemoving ? '...' : '❌'}
                </button>
            </div>
            
            <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                    <span className="text-gray-500">📅</span>
                    <span>{releaseYear}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-300">
                    <span className="text-gray-500">⭐</span>
                    <span className="font-semibold text-yellow-400">{movie.imdb_rating}</span>
                    <span className="text-gray-500">/ 10</span>
                </div>

                <div className="flex items-center gap-2 text-gray-400 text-xs pt-2 border-t border-gray-700">
                    <span>Added {new Date(movie.addedAt).toLocaleDateString()}</span>
                </div>
            </div>

            <Link
                href={`/movies/${movie.id}`}
                className="mt-4 block w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-all duration-200 text-center"
            >
                View Details
            </Link>
        </div>
    );
};

const LoadingState = () =>(
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-gray-400">Loading...</p>
        </div>
    </div>
);
const UnauthenticatedState = () => {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-center p-8 bg-gray-800/50 border border-gray-600 rounded-lg max-w-md mx-auto">
        <h2 className="text-xl font-bold text-white mb-4">Authentication Required</h2>
        <p className="text-gray-300 mb-6">You must be signed in to view this dashboard.</p>
        <div className="flex justify-center gap-4">
            <Link href="/auth/login" className="px-6 py-2 bg-white hover:bg-gray-200 text-black text-sm font-semibold rounded-lg trannsition-all duration-200 shadow-lg">
            Sign In
            </Link>
        </div>
        </div>
    </div>
    );
}



