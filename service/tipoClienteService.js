const tipoClienteRepository = require('../repository/tipoClienteRepository');
const clienteRepository = require('../repository/clienteRepository');

const tipoClienteService = {
    criar: async (nome, quantidade_maxima_livros) => {
        if (!nome || !quantidade_maxima_livros) {
            throw new Error('Nome e quantidade máxima de livros são obrigatórios.');
        }
        if (quantidade_maxima_livros <= 0) {
            throw new Error('A quantidade máxima de livros deve ser maior que zero.');
        }
        return await tipoClienteRepository.criar(nome, quantidade_maxima_livros);
    },
    listarTodos: async () => {
        return await tipoClienteRepository.listarTodos();
    },
    buscarPorId: async (id) => {
        const tipo = await tipoClienteRepository.buscarPorId(id);
        if (!tipo) throw new Error('Tipo de cliente não encontrado.');
        return tipo;
    },
    atualizar: async (id, nome, quantidade_maxima_livros) => {
        if (!nome || !quantidade_maxima_livros) {
            throw new Error('Nome e quantidade máxima de livros são obrigatórios.');
        }
        if (quantidade_maxima_livros <= 0) {
            throw new Error('A quantidade máxima de livros deve ser maior que zero.');
        }
        await tipoClienteService.buscarPorId(id); // Valida se o tipo existe
        return await tipoClienteRepository.atualizar(id, nome, quantidade_maxima_livros);
    },
    deletar: async (id) => {
        await tipoClienteService.buscarPorId(id); // Valida se o tipo existe

        // Impede a exclusão de um tipo de cliente se ele tiver clientes associados
        const totalClientes = await clienteRepository.contarClientesPorTipo(id);
        if (totalClientes > 0) {
            throw new Error('Não é possível excluir um tipo de cliente que possui clientes associados.');
        }

        await tipoClienteRepository.deletar(id);
    }
};

module.exports = tipoClienteService;
