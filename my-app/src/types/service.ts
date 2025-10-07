/**
 * Service Response Types
 * Standard response format for all service methods
 */

export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  status: number;
}

export interface MovieData {
  id: number;
  title: string;
  release_date: Date;
  imdb_rating: number;
}

export interface CreateMovieInput {
  title: string;
  release_date: Date;
  imdb_rating: number;
}

export interface UpdateMovieInput {
  title?: string;
  release_date?: Date;
  imdb_rating?: number;
}

