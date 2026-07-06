const express = require('express');
const router = express.Router();
const usuarioController = require('../controller/usuario_controller');
const authMiddleware = require('../middleware/auth_middleware');

// POST /api/usuarios - rota pública para criar conta
router.post('/', usuarioController.cadastrar);

// GET /api/usuarios/perfil - rota protegida de exemplo
router.get('/perfil', authMiddleware.verificarToken, (req, res) => {
    // Como passou pelo middleware, o "req.usuario" já tem os dados extraídos do Token
    res.status(200).json({
        mensagem: 'Acesso autorizado',
        dados_do_token: req.usuario
    });
});

module.exports = router;