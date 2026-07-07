require('dotenv').config();

const express = require('express');
const pool = require('./repository/bd');

//att Herian: import das rotas
const autorRouter = require('./router/autorRouter');
const livroRouter = require('./router/livroRouter');

//att Alexandre: import das rotas
const usuarioRouter = require('./router/usuario_router');
const loginController = require('./controller/login_controller');

//att Nicollas: import das rotas de emprestimos, clientes e tipos-cliente
const emprestimoRouter = require('./router/emprestimoRouter');
const tipoClienteRouter = require('./router/tipoClienteRouter');
const clienteRouter = require('./router/clienteRouter');

const app = express();

app.use(express.json());

// Rota inicial de teste
app.get('/', (req, res) => {
    res.send('API da Biblioteca OK!');
});

//           REGISTRO DAS ROTAS

//att Alexandre: rotas de autenticação e usuários
app.post('/api/login', loginController.realizarLogin);
app.use('/api/usuarios', usuarioRouter);

//att Herian: registro das rotas no express
app.use('/api', autorRouter);
app.use('/api', livroRouter);

//att Nicollas: registro das rotas de emprestimos, clientes e tipos-cliente
app.use('/api', emprestimoRouter);
app.use('/api', tipoClienteRouter);
app.use('/api', clienteRouter);

// Teste de conexão com o banco e inicialização do servidor

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
