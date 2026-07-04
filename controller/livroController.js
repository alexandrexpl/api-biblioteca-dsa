const livroService = require('../service/livroService');

const livroController = {
    criar: async (req, res) => {
        try {
            const { titulo, ano, autor_id, quantidade_estoque } = req.body;
            const novoLivro = await livroService.criar(titulo, ano, autor_id, quantidade_estoque);
            res.status(201).json(novoLivro);
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    },
    listarTodos: async (req, res) => {
        try {
            const livros = await livroService.listarTodos();
            res.status(200).json(livros);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    },
    buscarPorId: async (req, res) => {
        try {
            const { id } = req.params;
            const livro = await livroService.buscarPorId(id);
            res.status(200).json(livro);
        } catch (error) {
            res.status(404).json({ erro: error.message });
        }
    },
    atualizar: async (req, res) => {
        try {
            const { id } = req.params;
            const { titulo, ano, autor_id, quantidade_estoque } = req.body;
            const livroAtualizado = await livroService.atualizar(id, titulo, ano, autor_id, quantidade_estoque);
            res.status(200).json(livroAtualizado);
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    },
    deletar: async (req, res) => {
        try {
            const { id } = req.params;
            await livroService.deletar(id);
            res.status(204).send();
        } catch (error) {
            res.status(404).json({ erro: error.message });
        }
    }
};

module.exports = livroController;