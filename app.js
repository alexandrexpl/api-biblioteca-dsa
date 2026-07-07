require('dotenv').config();

const express = require('express');
const pool = require('./repository/bd');

//att Herian: import das rotas
const autorRouter = require('./router/autorRouter');
const livroRouter = require('./router/livroRouter');
const emprestimoRouter = require('./router/emprestimoRouter');
const tipoClienteRouter = require('./router/tipoClienteRouter');
const clienteRouter = require('./router/clienteRouter');

const app = express();

app.use(express.json());

//att Herian: registro das rotas no express
app.use('/api', autorRouter);
app.use('/api', livroRouter);
app.use('/api', emprestimoRouter);
app.use('/api', tipoClienteRouter);
app.use('/api', clienteRouter);

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
