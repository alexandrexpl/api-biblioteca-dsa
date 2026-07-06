const usuarioRepository = require('../repository/usuario_repository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// A chave secreta deve vir do .env, com um fallback de segurança
const JWT_SECRET = process.env.JWT_SECRET || 'chave_super_secreta_biblioteca';

async function cadastrar(usuario) {
    // 1. Validar se o email já está registado
    const usuarioExistente = await usuarioRepository.buscarPorEmail(usuario.email);
    if (usuarioExistente) {
        throw new Error('Este email já está em uso.');
    }

    // 2. Criptografar (hash) a palavra passe com bcrypt
    const saltRounds = 10;
    usuario.senha = await bcrypt.hash(usuario.senha, saltRounds);

    // 3. Salvar na base de dados
    return await usuarioRepository.inserir(usuario);
}

async function login(email, senha) {
    // 1. Procurar o usuario pelo email
    const usuario = await usuarioRepository.buscarPorEmail(email);
    if (!usuario) {
        throw new Error('Email ou palavra-passe inválidos.');
    }

    // 2. Comparar a palavra passe enviada com a hash no banco
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
        throw new Error('Email ou palavra-passe inválidos.');
    }

    // 3. Gerar o Token JWT
    // Colocamos o ID, Email e Role dentro do "payload" do token
    const token = jwt.sign(
        { id: usuario.id, email: usuario.email, role: usuario.role },
        JWT_SECRET,
        { expiresIn: '2h' }
    );

    // Retorna o token e os dados básicos do usuario
    return {
        token,
        usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email }
    };
}

module.exports = {
    cadastrar,
    login
};