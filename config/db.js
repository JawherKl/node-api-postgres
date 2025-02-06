require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  /*user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,*/
  connectionString: process.env.DATABASE_URL,
  ssl: false, // Disable SSL
});

pool.on('connect', () => {
  console.log('Connected to the database.');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
});

module.exports = pool;
