const pool = require('./bd');

const clienteRepository = {
    criar: async (matricula, nome, tipo_cliente_id, email, telefone) => {
        const query = `
            INSERT INTO clientes (matricula, nome, tipo_cliente_id, email, telefone)
            VALUES ($1, $2, $3, $4, $5) RETURNING *
        `;
        const res = await pool.query(query, [matricula, nome, tipo_cliente_id, email, telefone]);
        return res.rows[0];
    },
    listarTodos: async () => {
        const res = await pool.query('SELECT * FROM clientes ORDER BY id');
        return res.rows;
    },
    buscarPorId: async (id) => {
        const query = 'SELECT * FROM clientes WHERE id = $1';
        const res = await pool.query(query, [id]);
        return res.rows[0];
    },
    // Retorna o cliente já com os dados do tipo de cliente (INNER JOIN)
    buscarPorIdComTipo: async (id) => {
        const query = `
            SELECT c.id, c.matricula, c.nome, c.email, c.telefone,
                   t.id AS tipo_cliente_id, t.nome AS tipo_cliente_nome, t.quantidade_maxima_livros
            FROM clientes c
            INNER JOIN tipos_cliente t ON c.tipo_cliente_id = t.id
            WHERE c.id = $1
        `;
        const res = await pool.query(query, [id]);
        return res.rows[0];
    },
    atualizar: async (id, matricula, nome, tipo_cliente_id, email, telefone) => {
        const query = `
            UPDATE clientes
            SET matricula = $1, nome = $2, tipo_cliente_id = $3, email = $4, telefone = $5
            WHERE id = $6 RETURNING *
        `;
        const res = await pool.query(query, [matricula, nome, tipo_cliente_id, email, telefone, id]);
        return res.rows[0];
    },
    deletar: async (id) => {
        const query = 'DELETE FROM clientes WHERE id = $1';
        await pool.query(query, [id]);
    },
    // Função auxiliar para verificar se o tipo de cliente possui clientes vinculados antes de deletar
    contarClientesPorTipo: async (tipo_cliente_id) => {
        const query = 'SELECT COUNT(*) FROM clientes WHERE tipo_cliente_id = $1';
        const res = await pool.query(query, [tipo_cliente_id]);
        return parseInt(res.rows[0].count);
    }
};

module.exports = clienteRepository;
