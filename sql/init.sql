CREATE TABLE IF NOT EXISTS movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL UNIQUE,
    release_date DATE NOT NULL UNIQUE,
    imdb_rating DECIMAL(3,1) NOT NULL UNIQUE
);

INSERT INTO movies (title, release_date, imdb_rating) VALUES ('The Dark Knight', '2008-07-18', 9.0);
