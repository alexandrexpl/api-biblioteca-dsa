const clienteService = require('../service/clienteService');

const clienteController = {
    criar: async (req, res) => {
        try {
            const { matricula, nome, tipo_cliente_id, email, telefone } = req.body;
            const novoCliente = await clienteService.criar(matricula, nome, tipo_cliente_id, email, telefone);
            res.status(201).json(novoCliente);
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    },
    listarTodos: async (req, res) => {
        try {
            const clientes = await clienteService.listarTodos();
            res.status(200).json(clientes);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    },
    buscarPorId: async (req, res) => {
        try {
            const { id } = req.params;
            const cliente = await clienteService.buscarPorId(id);
            res.status(200).json(cliente);
        } catch (error) {
            res.status(404).json({ erro: error.message });
        }
    },
    atualizar: async (req, res) => {
        try {
            const { id } = req.params;
            const { matricula, nome, tipo_cliente_id, email, telefone } = req.body;
            const clienteAtualizado = await clienteService.atualizar(id, matricula, nome, tipo_cliente_id, email, telefone);
            res.status(200).json(clienteAtualizado);
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    },
    deletar: async (req, res) => {
        try {
            const { id } = req.params;
            await clienteService.deletar(id);
            res.status(204).send();
        } catch (error) {
            res.status(404).json({ erro: error.message });
        }
    }
};

module.exports = clienteController;
