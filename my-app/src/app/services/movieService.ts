import { Movie, MovieData } from '@/types/movie';
import {MovieRepository} from '@/app/repositories/movieRepository';

export class MovieService {
  private movieRepository: MovieRepository;

  constructor() {
    this.movieRepository = new MovieRepository();
  }

  async createMovie(data: MovieData): Promise<Movie> {
    // Business logic: ensure the movie title doesn't already exist.
    const existingMovie = await this.movieRepository.findMovieByTitle(data.title);
    if (existingMovie) {
      throw new Error('A movie with this title already exists.');
    }
    return this.movieRepository.createMovie(data);
  }

  async getAllMovies(): Promise<Movie[]> {
    return this.movieRepository.findAllMovies();
  }

  async getMovieById(id: number): Promise<Movie> {
    const movie = await this.movieRepository.findMovieById(id);
    if (!movie) {
      throw new Error('Movie not found.');
    }
    return movie;
  }

  async updateMovie(id: number, data: Partial<MovieData>): Promise<Movie| null> {
    await this.getMovieById(id); // Check if the movie exists first.
    return this.movieRepository.updateMovie(id, data);
  }

  async deleteMovie(id: number): Promise<Movie | null> {
    const movie = await this.getMovieById(id); // Check if the movie exists first.
    return this.movieRepository.deleteMovie(id);
  }
}