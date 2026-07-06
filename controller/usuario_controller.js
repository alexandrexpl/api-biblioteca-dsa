const usuarioService = require('../service/usuario_service');

async function cadastrar(req, res) {
    try {
        const usuario = req.body;

        // Validação dos campos
        if (!usuario.nome || !usuario.email || !usuario.senha) {
            return res.status(400).json({ erro: 'Nome, email e palavra-passe são obrigatórios.' });
        }

        const usuarioCriado = await usuarioService.cadastrar(usuario);
        res.status(201).json(usuarioCriado); // 201 Created
    } catch (erro) {
        if (erro.message === 'Este email já está em uso.') {
            return res.status(409).json({ erro: erro.message }); // 409 Conflict
        }
        console.error('Erro ao cadastrar:', erro);
        res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
}

module.exports = {
    cadastrar
};