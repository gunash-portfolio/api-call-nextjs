import { NextRequest, NextResponse } from "next/server";
import { MovieService } from "@/services/movieService";

export async function GET(){
  const result = await MovieService.getAllMovies();
  
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  
  return NextResponse.json({ movies: result.data }, { status: result.status });
}

export async function POST(request: NextRequest) {
  try {
    const { title, release_date, imdb_rating } = await request.json();
    
    // Validate input
    if (!title || !release_date || typeof imdb_rating !== 'number') {
      return NextResponse.json(
        { error: 'Missing or invalid required fields' },
        { status: 400 }
      );
    }
    
    const result = await MovieService.createMovie({
      title,
      release_date,
      imdb_rating
    });
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    
    return NextResponse.json({ 
      message: 'Movie added successfully',
      movie: result.data
    }, { status: result.status });
  } catch (error) {
    console.error('Error adding movie', error);
    return NextResponse.json(
      { error: 'Failed to add movie' },
      { status: 500 }
    );
  }
}