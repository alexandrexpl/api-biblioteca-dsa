const emprestimoService = require('../service/emprestimoService');

const emprestimoController = {
    criar: async (req, res) => {
        try {
            const { cliente_id, livro_ids } = req.body;
            const novoEmprestimo = await emprestimoService.criar(cliente_id, livro_ids);
            res.status(201).json(novoEmprestimo);
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    },
    listarTodos: async (req, res) => {
        try {
            const emprestimos = await emprestimoService.listarTodos();
            res.status(200).json(emprestimos);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    },
    buscarPorId: async (req, res) => {
        try {
            const { id } = req.params;
            const emprestimo = await emprestimoService.buscarPorId(id);
            res.status(200).json(emprestimo);
        } catch (error) {
            res.status(404).json({ erro: error.message });
        }
    },
    devolver: async (req, res) => {
        try {
            const { id } = req.params;
            const emprestimoAtualizado = await emprestimoService.devolver(id);
            res.status(200).json(emprestimoAtualizado);
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    },
    deletar: async (req, res) => {
        try {
            const { id } = req.params;
            await emprestimoService.deletar(id);
            res.status(204).send();
        } catch (error) {
            res.status(404).json({ erro: error.message });
        }
    }
};

module.exports = emprestimoController;
