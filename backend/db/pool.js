const { Pool } = require('pg');

/*
//debugging
console.log('Environment variables check:', {
    DB_USER: process.env.DB_USER,
    DB_HOST: process.env.DB_HOST,
    DB_NAME: process.env.DB_NAME,
    DB_PORT: process.env.DB_PORT,
    DB_PASSWORD_EXISTS: !!process.env.DB_PASSWORD
});
*/

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});

// Basic connection test
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('DB Connection error', err.stack);
    }
    else {
        console.log('DB Connection successful', res.rows[0]);
    }
});

module.exports = pool;