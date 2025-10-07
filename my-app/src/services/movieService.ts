import prisma from "@/lib/prisma";

/**
 * Movie Service
 * Handles all business logic for movie operations
 */

export class MovieService {
  /**
   * Get a single movie by ID
   */
  static async getMovieById(id: number) {
    try {
      const movie = await prisma.movies.findUnique({
        where: { id }
      });
      
      if (!movie) {
        return { success: false, error: 'Movie not found', status: 404 };
      }

      return { success: true, data: movie, status: 200 };
    } catch (error) {
      console.error('Error fetching movie details', error);
      return { success: false, error: 'Failed to fetch movie details', status: 500 };
    }
  }

  /**
   * Get all movies
   */
  static async getAllMovies() {
    try {
      const movies = await prisma.movies.findMany({
        orderBy: {
          id: 'asc'
        }
      });

      return { success: true, data: movies, status: 200 };
    } catch (error) {
      console.error('Error fetching movies', error);
      return { success: false, error: 'Failed to fetch movies', status: 500 };
    }
  }

  /**
   * Create a new movie
   */
  static async createMovie(data: { title: string; release_date: Date; imdb_rating: number }) {
    try {
      const movie = await prisma.movies.create({
        data: {
          title: data.title,
          release_date: new Date(data.release_date),
          imdb_rating: data.imdb_rating
        }
      });

      return { success: true, data: movie, status: 201 };
    } catch (error) {
      console.error('Error creating movie', error);
      
      // Handle unique constraint violation
      if ((error as any).code === 'P2002') {
        return { success: false, error: 'Movie with this title, date, or rating already exists', status: 409 };
      }

      return { success: false, error: 'Failed to create movie', status: 500 };
    }
  }

  /**
   * Update an existing movie
   */
  static async updateMovie(id: number, data: { title?: string; release_date?: Date; imdb_rating?: number }) {
    try {
      // Build update data object dynamically
      const updateData: any = {};
      
      if (data.title) {
        updateData.title = data.title;
      }
      
      if (data.release_date) {
        updateData.release_date = new Date(data.release_date);
      }
      
      if (data.imdb_rating !== undefined) {
        updateData.imdb_rating = data.imdb_rating;
      }

      const movie = await prisma.movies.update({
        where: { id },
        data: updateData
      });

      return { success: true, data: movie, status: 200 };
    } catch (error) {
      console.error('Error updating movie', error);
      
      // Handle movie not found
      if ((error as any).code === 'P2025') {
        return { success: false, error: 'Movie not found', status: 404 };
      }

      return { success: false, error: 'Failed to update movie', status: 500 };
    }
  }

  /**
   * Delete a movie
   */
  static async deleteMovie(id: number) {
    try {
      // First check if movie exists
      const movie = await prisma.movies.findUnique({
        where: { id }
      });

      if (!movie) {
        return { success: false, error: 'Movie not found', status: 404 };
      }

      // Delete the movie
      await prisma.movies.delete({
        where: { id }
      });

      return { success: true, data: movie, message: 'Movie deleted successfully', status: 200 };
    } catch (error) {
      console.error('Error deleting movie', error);
      return { success: false, error: 'Failed to delete movie', status: 500 };
    }
  }
}

