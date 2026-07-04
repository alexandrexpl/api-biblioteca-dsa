const pool = require('./bd');

const livroRepository = {
    criar: async (titulo, ano, autor_id, quantidade_estoque) => {
        const query = 'INSERT INTO livros (titulo, ano, autor_id, quantidade_estoque) VALUES ($1, $2, $3, $4) RETURNING *';
        const res = await pool.query(query, [titulo, ano, autor_id, quantidade_estoque]);
        return res.rows[0];
    },
    listarTodos: async () => {
        const res = await pool.query('SELECT * FROM livros ORDER BY id');
        return res.rows;
    },
    // Exigência do trabalho: Retornar dados do Livro + dados do Autor usando INNER JOIN
    buscarPorIdComAutor: async (id) => {
        const query = `
            SELECT l.id, l.titulo, l.ano, l.quantidade_estoque,
                   a.id AS autor_id, a.nome AS autor_nome
            FROM livros l
            INNER JOIN autores a ON l.autor_id = a.id
            WHERE l.id = $1
        `;
        const res = await pool.query(query, [id]);
        return res.rows[0];
    },
    atualizar: async (id, titulo, ano, autor_id, quantidade_estoque) => {
        const query = 'UPDATE livros SET titulo = $1, ano = $2, autor_id = $3, quantidade_estoque = $4 WHERE id = $5 RETURNING *';
        const res = await pool.query(query, [titulo, ano, autor_id, quantidade_estoque, id]);
        return res.rows[0];
    },
    deletar: async (id) => {
        const query = 'DELETE FROM livros WHERE id = $1';
        await pool.query(query, [id]);
    },
    // Função auxiliar para verificar se o autor possui livros vinculados antes de deletar
    contarLivrosPorAutor: async (autor_id) => {
        const query = 'SELECT COUNT(*) FROM livros WHERE autor_id = $1';
        const res = await pool.query(query, [autor_id]);
        return parseInt(res.rows[0].count);
    }
};

module.exports = livroRepository;