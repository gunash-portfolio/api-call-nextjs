'use client'
import {useSession, signOut} from 'next-auth/react';
import Link from 'next/link';

export default function Dashboard(){
    const {data: session,status} = useSession();

    if(status === 'loading'){
        return <LoadingState/>
    }

    if(status === 'unauthenticated'){
        return <UnauthenticatedState/>
    }

    return(
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
            <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-gray-900 via-black to-gray-900 border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <h2 className="text-xl font-bold text-white">
                                Dashboard
                            </h2>
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
                <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-white">
                    Dashboard
                </h1>
                <div className="max-w-6xl mx-auto bg-gray-800/30 rounded-lg p-6 border border-gray-700">
                <p className="text-gray-200">Welcome to your dashboard, {session?.user?.name}</p>

                </div>
            </main>
        </div> 
    );
}
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



