import { NextRequest, NextResponse } from 'next/server';
import { MovieService } from '@/app/services/movieService';

const movieService = new MovieService();

// Handler for GET /api/movies
export async function GET(req: NextRequest) {
  try {
    const movies = await movieService.getAllMovies();
    return NextResponse.json(movies, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// Handler for POST /api/movies
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is a required field.' }, { status: 400 });
    }
    
    const newMovie = await movieService.createMovie(body);
    return NextResponse.json(newMovie, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error.';
    const statusCode = errorMessage.includes('already exists') ? 409 : 500;
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}