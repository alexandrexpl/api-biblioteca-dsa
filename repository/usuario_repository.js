const pool = require('./bd');

async function inserir(usuario) {
    const sql = `
        INSERT INTO usuarios (nome, email, senha) 
        VALUES ($1, $2, $3) 
        RETURNING id, nome, email, role
    `;
    const valores = [usuario.nome, usuario.email, usuario.senha];

    const res = await pool.query(sql, valores);
    return res.rows[0]; // Retorna o usuario criado (sem a palavra-passe)
}

// Função para procurar o usuario pelo email (usado no login e validação)
async function buscarPorEmail(email) {
    const sql = 'SELECT * FROM usuarios WHERE email = $1';
    const res = await pool.query(sql, [email]);
    return res.rows[0]; // Retorna os dados ou undefined se não encontrar
}

module.exports = {
    inserir,
    buscarPorEmail
};