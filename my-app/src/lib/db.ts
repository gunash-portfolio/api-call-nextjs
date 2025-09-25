import { Pool, PoolConfig } from 'pg';

// Declare the pool variable in the module scope.
let pool: Pool | undefined;

// This function will be our single point of access to the database pool.
const getPool = () => {
  // If the pool doesn't exist yet, create it.
  if (!pool) {
    console.log('Creating new PostgreSQL connection pool...');

    // Start with the base configuration.
    const config: PoolConfig = {
      connectionString: process.env.DATABASE_URL,
    };

    // --- THIS IS THE FIX ---
    // Only add the SSL configuration if we are in a 'production' environment.
    // When you run 'pnpm run dev', NODE_ENV is 'development', so this block is skipped.
    if (process.env.NODE_ENV === 'production') {
      config.ssl = {
        rejectUnauthorized: false,
      };
    }
    // --------------------

    pool = new Pool(config);
  }
  // Return the existing or newly created pool.
  return pool;
};

// Export the function as the default export.
export default getPool;