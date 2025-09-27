import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();


export async function createMovie(title: string, releaseDate: Date, imdbRating: number) {
  return prisma.movies.create({
    data: {
      title,
      release_date: releaseDate,
      imdb_rating: imdbRating
    }
  });
}


export async function createMovies(moviesData: { title: string, releaseDate: Date, imdbRating: number }[]) {
  return prisma.movies.createMany({
    data: moviesData.map(movie => ({
      title: movie.title,
      release_date: movie.releaseDate,
      imdb_rating: movie.imdbRating
    }))
  });
}

async function main() {
  await createMovies([
    { title: 'The Shawshank Redemption', releaseDate: new Date('1994-09-23'), imdbRating: 9.3 },
    { title: 'The Godfather', releaseDate: new Date('1972-03-24'), imdbRating: 9.2 },
    { title: 'The Dark Knight', releaseDate: new Date('2008-07-18'), imdbRating: 9.0 }
  ]);
  
  console.log('Database seeded successfully');
}

main()
  .catch(error => console.error(error))
  .finally(async () => await prisma.$disconnect());