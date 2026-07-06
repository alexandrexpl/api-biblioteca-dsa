const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'chave_super_secreta_biblioteca';

// Interceptador para rotas protegidas
function verificarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ erro: 'Acesso negado. Token não fornecido.' });
    }

    try {
        // Verifica se o token é válido
        const decodificado = jwt.verify(token, JWT_SECRET);

        // Colocamos os dados do usuário dentro da requisição (req)
        req.usuario = decodificado;

        next(); // Permite que a requisição vá para o controller
    } catch (erro) {
        res.status(403).json({ erro: 'Token inválido ou expirado.' });
    }
}

module.exports = {
    verificarToken
};