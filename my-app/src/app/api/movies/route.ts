import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(){
  try{
    const movies = await prisma.movies.findMany({
      orderBy: { id: 'asc' }
    });
    return NextResponse.json({movies});
  } catch (error){
    console.error('Error fetching movies', error);
    return NextResponse.json({error: 'Failed to fetch movies'}, {status: 500});
  }
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
    
    // Insert the new movie using Prisma
    const movie = await prisma.movies.create({
      data: {
        title,
        release_date: new Date(release_date),
        imdb_rating
      }
    });
    
    return NextResponse.json({ 
      message: 'Movie added successfully',
      movie
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding movie', error);
    return NextResponse.json(
      { error: 'Failed to add movie' },
      { status: 500 }
    );
  }
}