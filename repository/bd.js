const { Pool } = require('pg');

// O ideal no futuro é trocar isso por variáveis de ambiente (.env)
const pool = new Pool({
    user: "postgres",
    password: "sua_senha_aqui",
    host: "localhost",
    port: 5432,
    database: "biblioteca_db"
});

async function connect() {
    return await pool.connect();
}

module.exports = {
    connect
}