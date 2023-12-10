require("dotenv").config();

const mysql = require("mysql2/promise");

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

async function query(query, value) {
  try {
    const [executeQuery] = await db.query(query, value ?? []); // hasil dari query
    return executeQuery;
  } catch (error) {
    console.log(error);
  }
}

module.exports = query;
