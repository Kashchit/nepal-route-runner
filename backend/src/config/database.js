const { Pool } = require('pg');
require('dotenv').config({ path: '../config.env' });

// Create connection pool using DATABASE_URL directly
const createPool = () => {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is required');
    }
    
    return new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });
  } catch (error) {
    console.error('Error creating database pool:', error);
    throw error;
  }
};

const pool = createPool();

// Test database connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Database connected successfully');
    client.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};

// Initialize database tables
const initializeTables = async () => {
  try {
    const client = await pool.connect();
    
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create routes table
    await client.query(`
      CREATE TABLE IF NOT EXISTS routes (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        distance DECIMAL(10,2),
        elevation_gain INTEGER,
        difficulty VARCHAR(20),
        district VARCHAR(50),
        coordinates JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create user_runs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_runs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        route_id INTEGER REFERENCES routes(id),
        start_time TIMESTAMP,
        end_time TIMESTAMP,
        duration INTEGER,
        distance DECIMAL(10,2),
        pace DECIMAL(5,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create leaderboard table
    await client.query(`
      CREATE TABLE IF NOT EXISTS leaderboard (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        route_id INTEGER REFERENCES routes(id),
        best_time INTEGER,
        total_runs INTEGER,
        total_distance DECIMAL(10,2),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, route_id)
      )
    `);

    console.log('✅ Database tables initialized successfully');
    client.release();
  } catch (error) {
    console.error('❌ Error initializing database tables:', error);
    throw error;
  }
};

module.exports = {
  pool,
  testConnection,
  initializeTables
};
