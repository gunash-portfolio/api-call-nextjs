import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

interface Params {
  params: {
    id: string;
  };
}

export async function GET(_request: NextRequest, { params }: Params) {
  const id = params.id;
  try {
    const result = await query('SELECT * FROM movies WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Movie not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ movie: result.rows[0] });
  } catch (error) {
    console.error('Error fetching movie details', error);
    return NextResponse.json(
      { error: 'Failed to fetch movie details' },
      { status: 500 }
    );
  }
}
export async function DELETE(_request:NextRequest,{params}:Params) {
  const id = params.id;
  try{
    const result = await query('DELETE FROM movies WHERE id=$1',[id]);
    if(result.rowCount ===0){
      return NextResponse.json({error:'Movie not found'},{status:404}); 
  }
  return NextResponse.json({message:'Movie deleted successfully', movie:result.rows[0]});
  }catch(error){
    console.error('Error deleting movie',error);
    return NextResponse.json({error:'Failed to delete movie'},{status:500});
  }
}