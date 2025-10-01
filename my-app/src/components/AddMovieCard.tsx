import Link from 'next/link';

export default function AddMovieCard() {
  return (
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
  );
}