require('dotenv').config();

const express = require('express');
const pool = require('./repository/bd');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('API da Biblioteca OK!');
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Erro ao conectar no Banco de Dados:', err.message);
    } else {
        console.log('✅ Banco de Dados conectado com sucesso');

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    }
});