import dotenv from 'dotenv';
dotenv.config();

import mysql from 'mysql2/promise';

const {
  DB_HOST,
  DB_USERNAME,
  DB_PASSWORD,
  DB_DATABASE,
  DB_CONNECTION_LIMIT,
  DB_ENABLE_KEEP_ALIVE,
  DB_KEEP_ALIVE_INITIAL_DELAY,
} = process.env;

const db = mysql.createPool({
  host: DB_HOST,
  user: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  connectionLimit: DB_CONNECTION_LIMIT,
  enableKeepAlive: DB_ENABLE_KEEP_ALIVE,
  keepAliveInitialDelay: DB_KEEP_ALIVE_INITIAL_DELAY,
});

async function query(query, values) {
  try {
    const [results] = await db.query(query, values ?? []);
    return results;
  } catch (error) {
    console.error(`Error executing query: ${query}`, error);
    throw new Error("Database error");
  }
}

export default query;
