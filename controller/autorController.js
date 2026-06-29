const autorService = require('../service/autorService');

const autorController = {
    criar: async (req, res) => {
        try {
            const { nome } = req.body;
            const novoAutor = await autorService.criar(nome);
            res.status(201).json(novoAutor);
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    },
    listarTodos: async (req, res) => {
        try {
            const autores = await autorService.listarTodos();
            res.status(200).json(autores);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    },
    buscarPorId: async (req, res) => {
        try {
            const { id } = req.params;
            const autor = await autorService.buscarPorId(id);
            res.status(200).json(autor);
        } catch (error) {
            res.status(404).json({ erro: error.message });
        }
    },
    atualizar: async (req, res) => {
        try {
            const { id } = req.params;
            const { nome } = req.body;
            const autorAtualizado = await autorService.atualizar(id, nome);
            res.status(200).json(autorAtualizado);
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    },
    deletar: async (req, res) => {
        try {
            const { id } = req.params;
            await autorService.deletar(id);
            res.status(204).send(); // Sem conteúdo, mas sucesso na exclusão
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    }
};

module.exports = autorController;