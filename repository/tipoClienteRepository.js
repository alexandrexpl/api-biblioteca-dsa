const pool = require('./bd');

const tipoClienteRepository = {
    criar: async (nome, quantidade_maxima_livros) => {
        const query = 'INSERT INTO tipos_cliente (nome, quantidade_maxima_livros) VALUES ($1, $2) RETURNING *';
        const res = await pool.query(query, [nome, quantidade_maxima_livros]);
        return res.rows[0];
    },
    listarTodos: async () => {
        const res = await pool.query('SELECT * FROM tipos_cliente ORDER BY id');
        return res.rows;
    },
    buscarPorId: async (id) => {
        const query = 'SELECT * FROM tipos_cliente WHERE id = $1';
        const res = await pool.query(query, [id]);
        return res.rows[0];
    },
    atualizar: async (id, nome, quantidade_maxima_livros) => {
        const query = 'UPDATE tipos_cliente SET nome = $1, quantidade_maxima_livros = $2 WHERE id = $3 RETURNING *';
        const res = await pool.query(query, [nome, quantidade_maxima_livros, id]);
        return res.rows[0];
    },
    deletar: async (id) => {
        const query = 'DELETE FROM tipos_cliente WHERE id = $1';
        await pool.query(query, [id]);
    }
};

module.exports = tipoClienteRepository;
