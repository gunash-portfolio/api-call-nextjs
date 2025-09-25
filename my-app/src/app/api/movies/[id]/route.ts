import { NextRequest, NextResponse } from 'next/server';
import { MovieService } from '@/app/services/movieService';

const movieService = new MovieService();

interface Params {
  id: string;
}

// Handler for GET /api/movies/[id]
export async function GET(req: NextRequest, context: { params: Params }) {
  try {
    const movieId = Number(context.params.id);
    if (isNaN(movieId)) {
      return NextResponse.json({ error: 'Movie ID must be a number.' }, { status: 400 });
    }
    const movie = await movieService.getMovieById(movieId);
    return NextResponse.json(movie, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error.';
    const statusCode = errorMessage.includes('not found') ? 404 : 500;
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}

// Handler for PUT /api/movies/[id]
export async function PUT(req: NextRequest, context: { params: Params }) {
    try {
        const movieId = Number(context.params.id);
        if (isNaN(movieId)) {
            return NextResponse.json({ error: 'Movie ID must be a number.' }, { status: 400 });
        }
        const body = await req.json();
        const updatedMovie = await movieService.updateMovie(movieId, body);
        return NextResponse.json(updatedMovie, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal server error.';
        const statusCode = errorMessage.includes('not found') ? 404 : 500;
        return NextResponse.json({ error: errorMessage }, { status: statusCode });
    }
}

// Handler for DELETE /api/movies/[id]
export async function DELETE(req: NextRequest, context: { params: Params }) {
    try {
        const movieId = Number(context.params.id);
        if (isNaN(movieId)) {
            return NextResponse.json({ error: 'Movie ID must be a number.' }, { status: 400 });
        }
        const deletedMovie = await movieService.deleteMovie(movieId);
        return NextResponse.json(deletedMovie, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal server error.';
        const statusCode = errorMessage.includes('not found') ? 404 : 500;
        return NextResponse.json({ error: errorMessage }, { status: statusCode });
    }
}