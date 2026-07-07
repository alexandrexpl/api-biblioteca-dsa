const pool = require('./bd');

const emprestimoRepository = {
    criar: async (cliente_id, data_entrega) => {
        const query = 'INSERT INTO emprestimos (cliente_id, data_entrega) VALUES ($1, $2) RETURNING *';
        const res = await pool.query(query, [cliente_id, data_entrega]);
        return res.rows[0];
    },
    // Vincula um livro ao empréstimo (permite múltiplos livros por empréstimo)
    adicionarLivro: async (emprestimo_id, livro_id) => {
        const query = 'INSERT INTO emprestimo_livros (emprestimo_id, livro_id) VALUES ($1, $2) RETURNING *';
        const res = await pool.query(query, [emprestimo_id, livro_id]);
        return res.rows[0];
    },
    listarTodos: async () => {
        const res = await pool.query('SELECT * FROM emprestimos ORDER BY id');
        return res.rows;
    },
    buscarPorId: async (id) => {
        const query = 'SELECT * FROM emprestimos WHERE id = $1';
        const res = await pool.query(query, [id]);
        return res.rows[0];
    },
    // Dados do empréstimo já com o cliente vinculado (INNER JOIN)
    buscarPorIdComCliente: async (id) => {
        const query = `
            SELECT e.id, e.data_retirada, e.data_entrega, e.data_devolucao, e.status,
                   c.id AS cliente_id, c.nome AS cliente_nome, c.matricula AS cliente_matricula
            FROM emprestimos e
            INNER JOIN clientes c ON e.cliente_id = c.id
            WHERE e.id = $1
        `;
        const res = await pool.query(query, [id]);
        return res.rows[0];
    },
    // Lista os livros pertencentes a um empréstimo
    listarLivrosDoEmprestimo: async (emprestimo_id) => {
        const query = `
            SELECT l.id, l.titulo, l.ano
            FROM emprestimo_livros el
            INNER JOIN livros l ON el.livro_id = l.id
            WHERE el.emprestimo_id = $1
        `;
        const res = await pool.query(query, [emprestimo_id]);
        return res.rows;
    },

    contarLivrosAtivosPorCliente: async (cliente_id) => {
        const query = `
            SELECT COUNT(*)
            FROM emprestimo_livros el
            INNER JOIN emprestimos e ON el.emprestimo_id = e.id
            WHERE e.cliente_id = $1 AND e.status = 'ATIVO'
        `;
        const res = await pool.query(query, [cliente_id]);
        return parseInt(res.rows[0].count);
    },
    atualizarStatus: async (id, data_devolucao, status) => {
        const query = 'UPDATE emprestimos SET data_devolucao = $1, status = $2 WHERE id = $3 RETURNING *';
        const res = await pool.query(query, [data_devolucao, status, id]);
        return res.rows[0];
    },
    deletar: async (id) => {
        const query = 'DELETE FROM emprestimos WHERE id = $1';
        await pool.query(query, [id]);
    }
};

module.exports = emprestimoRepository;
