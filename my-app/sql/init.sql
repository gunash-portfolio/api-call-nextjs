CREATE TABLE movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) UNIQUE NOT NULL,
    release_year INTEGER,
    rating NUMERIC(3, 1) CHECK (rating >= 0 AND rating <= 10)
);

-- (Optional) Insert some initial data
INSERT INTO movies (title, release_year, rating)
VALUES
    ('The Matrix', 1999, 8.7),
    ('Pulp Fiction', 1994, 8.9);