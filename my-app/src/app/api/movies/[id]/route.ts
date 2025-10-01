import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface Params {
  params: {
    id: string;
  };
}

export async function GET(_request: NextRequest, { params }: Params) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);
  try {
    const movie = await prisma.movies.findUnique({
      where: { id }
    });
    
    if (!movie) {
      return NextResponse.json(
        { error: 'Movie not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ movie });
  } catch (error) {
    console.error('Error fetching movie details', error);
    return NextResponse.json(
      { error: 'Failed to fetch movie details' },
      { status: 500 }
    );
  }
}

export async function DELETE(_request:NextRequest, { params }:Params) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);
  try {
    // First find the movie to return its data after deletion
    const movie = await prisma.movies.findUnique({
      where: { id }
    });

    if (!movie) {
      return NextResponse.json({error:'Movie not found'},{status:404});
    }

    // Delete the movie
    await prisma.movies.delete({
      where: { id }
    });
    
    return NextResponse.json({message:'Movie deleted successfully', movie});
  } catch (error) {
    console.error('Error deleting movie',error);
    return NextResponse.json({error:'Failed to delete movie'},{status:500});
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);
  try {
    const data = await request.json();
    const { title, release_date, imdb_rating } = data;
    
    const movie = await prisma.movies.update({
      where: { id },
      data: {
        title,
        release_date: new Date(release_date),
        imdb_rating
      }
    });
    
    return NextResponse.json({message:'Movie updated successfully', movie});
  } catch (error) {
    console.error('Error updating movie', error);
    if ((error as any).code === 'P2025') {
      return NextResponse.json({error:'Movie not found'},{status:404});
    }
    return NextResponse.json(
      { error: 'Failed to update movie' },
      { status: 500 }
    );
  }
}