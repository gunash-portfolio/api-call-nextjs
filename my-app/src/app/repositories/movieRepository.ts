import getPool from '@/lib/db'; // Correctly imports the function
import { loadQuery } from '@/lib/loadQuery';
import { Movie, MovieData } from '@/types/movie';

// --- THIS IS THE FIX ---
// Call the function to get the actual Pool object and store it in a constant.
const pool = getPool(); 
// --------------------

// Load all movie-related queries once
const queries = {
  createMovie: loadQuery('movie', 'createMovie'),
  findAllMovies: loadQuery('movie', 'findAllMovies'),
  findMovieById: loadQuery('movie', 'findMovieById'),
  findMovieByTitle: loadQuery('movie', 'findMovieByTitle'),
  updateMovie: loadQuery('movie', 'updateMovie'),
  deleteMovie: loadQuery('movie', 'deleteMovie'),
};

export class MovieRepository {
  async createMovie(data: MovieData): Promise<Movie> {
    const values = [data.title, data.release_year, data.rating];
    // Now 'pool' is the correct object, and pool.query will work perfectly.
    const result = await pool.query(queries.createMovie, values);
    return result.rows[0];
  }

  async findAllMovies(): Promise<Movie[]> {
    const result = await pool.query(queries.findAllMovies);
    return result.rows;
  }

  async findMovieById(id: number): Promise<Movie | null> {
    const result = await pool.query(queries.findMovieById, [id]);
    return result.rows[0] || null;
  }

  async findMovieByTitle(title: string): Promise<Movie | null> {
    const result = await pool.query(queries.findMovieByTitle, [title]);
    return result.rows[0] || null;
  }

  async updateMovie(
    id: number,
    data: Partial<MovieData>
  ): Promise<Movie | null> {
    const values = [id, data.title, data.release_year, data.rating];
    const result = await pool.query(queries.updateMovie, values);
    return result.rows[0] || null;
  }

  async deleteMovie(id: number): Promise<Movie | null> {
    const result = await pool.query(queries.deleteMovie, [id]);
    return result.rows[0] || null;
  }
}