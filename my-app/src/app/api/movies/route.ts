import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(){
  try{
    const results = await query('SELECT * FROM movies ORDER BY id ASC');
    return NextResponse.json({movies:results.rows});
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
    
    // Insert the new movie
    const result = await query(
      'INSERT INTO movies (title, release_date, imdb_rating) VALUES ($1, $2, $3) RETURNING *',
      [title, release_date, imdb_rating]
    );
    
    return NextResponse.json({ 
      message: 'Movie added successfully',
      movie: result.rows[0]
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding movie', error);
    return NextResponse.json(
      { error: 'Failed to add movie' },
      { status: 500 }
    );
  }
}