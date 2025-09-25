import { readFileSync } from 'fs';
import { join } from 'path';

// Helper function to read a .sql file
export function loadQuery(dir: string, file: string): string {
  // Construct the full path to the .sql file
  // process.cwd() gives the root directory of the Next.js project
  const fullPath = join(process.cwd(), 'sql', 'queries', dir, `${file}.sql`);
  
  try {
    return readFileSync(fullPath, 'utf-8');
  } catch (error) {
    console.error(`Error loading query file: ${fullPath}`, error);
    throw new Error(`Could not load query: ${file}`);
  }
}