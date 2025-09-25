INSERT INTO movies (title, release_year, rating)
VALUES ($1, $2, $3) -- Simplified to 3 parameters
RETURNING *;