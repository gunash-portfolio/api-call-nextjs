import { Pool } from 'pg';

const pool = new Pool({
  user: 'gunashfarzaliyev',
  host: 'localhost',
  database: 'Cinama',
  password: '',
  port: 5432,
});

export async function query(text: string, params?: any[]){
    try{
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now()-start;
    console.log('Executed query', {text, duration, rows: res.rowCount});
    return res;
} catch (error){
    console.error('Error executing query', error);
    throw error;
}
}


export default pool;