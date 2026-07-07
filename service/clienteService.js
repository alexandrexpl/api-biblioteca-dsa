const clienteRepository = require('../repository/clienteRepository');
const tipoClienteRepository = require('../repository/tipoClienteRepository');

const clienteService = {
    criar: async (matricula, nome, tipo_cliente_id, email, telefone) => {
        if (!matricula || !nome || !tipo_cliente_id) {
            throw new Error('Matrícula, nome e tipo de cliente são obrigatórios.');
        }

        // Verifica se o tipo de cliente informado realmente existe
        const tipoExiste = await tipoClienteRepository.buscarPorId(tipo_cliente_id);
        if (!tipoExiste) throw new Error('Tipo de cliente informado não existe.');

        return await clienteRepository.criar(matricula, nome, tipo_cliente_id, email, telefone);
    },
    listarTodos: async () => {
        return await clienteRepository.listarTodos();
    },
    buscarPorId: async (id) => {
        const cliente = await clienteRepository.buscarPorIdComTipo(id);
        if (!cliente) throw new Error('Cliente não encontrado.');

        // Formata o retorno para ficar um objeto limpo contendo dados do cliente e o tipo aninhado
        return {
            id: cliente.id,
            matricula: cliente.matricula,
            nome: cliente.nome,
            email: cliente.email,
            telefone: cliente.telefone,
            tipo_cliente: {
                id: cliente.tipo_cliente_id,
                nome: cliente.tipo_cliente_nome,
                quantidade_maxima_livros: cliente.quantidade_maxima_livros
            }
        };
    },
    atualizar: async (id, matricula, nome, tipo_cliente_id, email, telefone) => {
        if (!matricula || !nome || !tipo_cliente_id) {
            throw new Error('Matrícula, nome e tipo de cliente são obrigatórios.');
        }

        const clienteExiste = await clienteRepository.buscarPorId(id);
        if (!clienteExiste) throw new Error('Cliente não encontrado.');

        const tipoExiste = await tipoClienteRepository.buscarPorId(tipo_cliente_id);
        if (!tipoExiste) throw new Error('Tipo de cliente informado não existe.');

        return await clienteRepository.atualizar(id, matricula, nome, tipo_cliente_id, email, telefone);
    },
    deletar: async (id) => {
        const clienteExiste = await clienteRepository.buscarPorId(id);
        if (!clienteExiste) throw new Error('Cliente não encontrado.');

        await clienteRepository.deletar(id);
    }
};

module.exports = clienteService;
