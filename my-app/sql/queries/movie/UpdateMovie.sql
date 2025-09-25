UPDATE movies
SET
    title = COALESCE($2, title),
    release_year = COALESCE($3, release_year),
    rating = COALESCE($4, rating) -- Simplified and re-numbered
WHERE id = $1
RETURNING *;