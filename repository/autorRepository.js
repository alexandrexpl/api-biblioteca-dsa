const pool = require('./bd');

const autorRepository = {
    criar: async (nome) => {
        const query = 'INSERT INTO autores (nome) VALUES ($1) RETURNING *';
        const res = await pool.query(query, [nome]);
        return res.rows[0];
    },
    listarTodos: async () => {
        const res = await pool.query('SELECT * FROM autores ORDER BY id');
        return res.rows;
    },
    buscarPorId: async (id) => {
        const query = 'SELECT * FROM autores WHERE id = $1';
        const res = await pool.query(query, [id]);
        return res.rows[0];
    },
    atualizar: async (id, nome) => {
        const query = 'UPDATE autores SET nome = $1 WHERE id = $2 RETURNING *';
        const res = await pool.query(query, [nome, id]);
        return res.rows[0];
    },
    deletar: async (id) => {
        const query = 'DELETE FROM autores WHERE id = $1';
        await pool.query(query, [id]);
    }
};

module.exports = autorRepository;