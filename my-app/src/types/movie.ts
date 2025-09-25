export interface Movie{
    id: number;
    title: string;
    release_date: string;
    imdb_rating: number;
}

export interface MovieData {
    title: string;
    release_year?: number;
    rating?: number;
  }