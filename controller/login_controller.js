const usuarioService = require('../service/usuario_service');

async function realizarLogin(req, res) {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ erro: 'Email e palavra-passe são obrigatórios.' });
        }

        const resultado = await usuarioService.login(email, senha);
        res.status(200).json(resultado); // Retorna o Token e os dados com sucesso
    } catch (erro) {
        // Se a senha estiver errada ou o email não existir, retorna 401 Unauthorized
        res.status(401).json({ erro: erro.message });
    }
}

module.exports = {
    realizarLogin
};