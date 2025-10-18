import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET - Get all favorite films for the logged-in user
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get all favorite films for this user
    const userFilms = await prisma.userFilms.findMany({
      where: { userId: user.id },
      include: {
        movie: true,
      },
      orderBy: {
        addedAt: 'desc',
      },
    });

    // Return just the movies with the userFilmId for deletion
    const favorites = userFilms.map(uf => ({
      ...uf.movie,
      userFilmId: uf.id,
      addedAt: uf.addedAt,
    }));

    return NextResponse.json(favorites);
  } catch (error) {
    console.error('Error fetching user films:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorite films' },
      { status: 500 }
    );
  }
}

// POST - Add a movie to favorites
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { movieId } = await request.json();

    if (!movieId) {
      return NextResponse.json(
        { error: 'Movie ID is required' },
        { status: 400 }
      );
    }

    // Get user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if movie exists
    const movie = await prisma.movies.findUnique({
      where: { id: movieId },
    });

    if (!movie) {
      return NextResponse.json(
        { error: 'Movie not found' },
        { status: 404 }
      );
    }

    // Check if already favorited
    const existing = await prisma.userFilms.findFirst({
      where: {
        userId: user.id,
        movieId: movieId,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Movie already in favorites' },
        { status: 400 }
      );
    }

    // Add to favorites
    const userFilm = await prisma.userFilms.create({
      data: {
        userId: user.id,
        movieId: movieId,
      },
      include: {
        movie: true,
      },
    });

    return NextResponse.json({
      ...userFilm.movie,
      userFilmId: userFilm.id,
      addedAt: userFilm.addedAt,
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding film to favorites:', error);
    return NextResponse.json(
      { error: 'Failed to add film to favorites' },
      { status: 500 }
    );
  }
}

