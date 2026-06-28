const express = require('express');
const app = express();
const port = 3000;

// Importação das rotas
// const usuarioRouter = require('./router/usuario_router');
// const autorRouter = require('./router/autor_router');
// const livroRouter = require('./router/livro_router');
// const emprestimoRouter = require('./router/emprestimo_router');
// const loginController = require('./controller/login_controller');

app.use(express.json());

// Middlewares globais
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

app.get('/', (req, res) => {
    res.send('API da Biblioteca funcionando!');
});

// Rotas da aplicação
// app.post('/api/login', loginController.realizarLogin);
// app.use('/api/usuarios', usuarioRouter);
// app.use('/api/autores', autorRouter);
// app.use('/api/livros', livroRouter);
// app.use('/api/emprestimos', emprestimoRouter);

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});