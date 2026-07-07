const tipoClienteService = require('../service/tipoClienteService');

const tipoClienteController = {
    criar: async (req, res) => {
        try {
            const { nome, quantidade_maxima_livros } = req.body;
            const novoTipo = await tipoClienteService.criar(nome, quantidade_maxima_livros);
            res.status(201).json(novoTipo);
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    },
    listarTodos: async (req, res) => {
        try {
            const tipos = await tipoClienteService.listarTodos();
            res.status(200).json(tipos);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    },
    buscarPorId: async (req, res) => {
        try {
            const { id } = req.params;
            const tipo = await tipoClienteService.buscarPorId(id);
            res.status(200).json(tipo);
        } catch (error) {
            res.status(404).json({ erro: error.message });
        }
    },
    atualizar: async (req, res) => {
        try {
            const { id } = req.params;
            const { nome, quantidade_maxima_livros } = req.body;
            const tipoAtualizado = await tipoClienteService.atualizar(id, nome, quantidade_maxima_livros);
            res.status(200).json(tipoAtualizado);
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    },
    deletar: async (req, res) => {
        try {
            const { id } = req.params;
            await tipoClienteService.deletar(id);
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    }
};

module.exports = tipoClienteController;
