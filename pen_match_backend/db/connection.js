const mysql = require('mysql2/promise');
require('dotenv').config();

// Create connection pool
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'pen_match',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Enable SSL for production/cloud databases (required for TiDB/Aiven)
if (process.env.NODE_ENV === 'production' || process.env.DB_SSL === 'true') {
  dbConfig.ssl = {
    rejectUnauthorized: false // Allow self-signed certs for compatibility
  };
}

const pool = mysql.createPool(dbConfig);

// Test connection
pool.getConnection()
  .then(connection => {
    console.log('✓ MySQL database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('✗ MySQL connection error:', err.message);
    process.exit(1);
  });

module.exports = pool;
