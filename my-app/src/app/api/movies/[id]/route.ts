import { NextRequest, NextResponse } from "next/server";
import { MovieService } from "@/services/movieService";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(_request: NextRequest, { params }: Params) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);
  
  const result = await MovieService.getMovieById(id);
  
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  
  return NextResponse.json({ movie: result.data }, { status: result.status });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);
  
  const result = await MovieService.deleteMovie(id);
  
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  
  return NextResponse.json(
    { message: result.message, movie: result.data },
    { status: result.status }
  );
}

export async function PUT(request: NextRequest, { params }: Params) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);
  
  const data = await request.json();
  const { title, release_date, imdb_rating } = data;
  
  const result = await MovieService.updateMovie(id, {
    title,
    release_date,
    imdb_rating
  });
  
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  
  return NextResponse.json(
    { message: 'Movie updated successfully', movie: result.data },
    { status: result.status }
  );
}