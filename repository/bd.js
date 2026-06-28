const { Pool } = require('pg');
require('dotenv').config(); // biblioteca para ler o arquivo .env

const pool = new Pool({
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD, // puxa a senha do arquivo .env
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || "biblioteca_db"
});

async function connect() {
    return await pool.connect();
}

module.exports = {
    connect
}