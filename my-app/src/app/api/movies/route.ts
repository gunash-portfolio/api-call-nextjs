import { NextResponse } from "next/server";
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