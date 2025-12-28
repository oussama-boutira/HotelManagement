const { Pool } = require("pg");
require("dotenv").config();

// Supabase pooler connection
const connectionString = process.env.DATABASE_URL 
const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

// Test connection
pool
  .connect()
  .then((client) => {
    console.log("Connected to PostgreSQL database");
    client.release();
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err.message);
  });

module.exports = pool;
