const emprestimoRepository = require('../repository/emprestimoRepository');
const livroRepository = require('../repository/livroRepository');
const clienteRepository = require('../repository/clienteRepository');

const QUINZE_DIAS_EM_MS = 15 * 24 * 60 * 60 * 1000;

const emprestimoService = {
    criar: async (cliente_id, livro_ids) => {
        if (!cliente_id || !Array.isArray(livro_ids) || livro_ids.length === 0) {
            throw new Error('Cliente e ao menos um livro são obrigatórios.');
        }

        // Verifica se o cliente existe e recupera o limite do seu tipo de cliente
        const cliente = await clienteRepository.buscarPorIdComTipo(cliente_id);
        if (!cliente) throw new Error('Cliente informado não existe.');

        // RN3: cliente não pode ultrapassar o limite de livros do seu tipo de cliente
        const livrosAtivos = await emprestimoRepository.contarLivrosAtivosPorCliente(cliente_id);
        const totalAposEmprestimo = livrosAtivos + livro_ids.length;
        if (totalAposEmprestimo > cliente.quantidade_maxima_livros) {
            throw new Error(
                `Limite excedido: o tipo de cliente "${cliente.tipo_cliente_nome}" permite no máximo ${cliente.quantidade_maxima_livros} livro(s) emprestado(s), e o cliente já está com ${livrosAtivos}.`
            );
        }

        // RN1: cada livro precisa existir e ter estoque disponível
        const livros = [];
        for (const livro_id of livro_ids) {
            const livro = await livroRepository.buscarPorIdComAutor(livro_id);
            if (!livro) throw new Error(`Livro de ID ${livro_id} não existe.`);
            if (livro.quantidade_estoque <= 0) {
                throw new Error(`Livro "${livro.titulo}" está indisponível (sem estoque).`);
            }
            livros.push(livro);
        }

        // RN2: prazo de entrega = data de retirada + 15 dias
        const dataEntrega = new Date(Date.now() + QUINZE_DIAS_EM_MS).toISOString().split('T')[0];

        const novoEmprestimo = await emprestimoRepository.criar(cliente_id, dataEntrega);

        // Vincula os livros ao empréstimo e desconta o estoque de cada um
        for (const livro of livros) {
            await emprestimoRepository.adicionarLivro(novoEmprestimo.id, livro.id);
            await livroRepository.diminuirEstoque(livro.id);
        }

        return await emprestimoService.buscarPorId(novoEmprestimo.id);
    },

    listarTodos: async () => {
        return await emprestimoRepository.listarTodos();
    },

    // Retorna o empréstimo com o cliente e a lista de livros já mesclados
    buscarPorId: async (id) => {
        const emprestimo = await emprestimoRepository.buscarPorIdComCliente(id);
        if (!emprestimo) throw new Error('Empréstimo não encontrado.');

        const livros = await emprestimoRepository.listarLivrosDoEmprestimo(id);

        return {
            id: emprestimo.id,
            data_retirada: emprestimo.data_retirada,
            data_entrega: emprestimo.data_entrega,
            data_devolucao: emprestimo.data_devolucao,
            status: emprestimo.status,
            cliente: {
                id: emprestimo.cliente_id,
                nome: emprestimo.cliente_nome,
                matricula: emprestimo.cliente_matricula
            },
            livros
        };
    },

    // RN4: registra a devolução, calcula os dias de atraso e libera os livros no estoque
    devolver: async (id) => {
        const emprestimo = await emprestimoRepository.buscarPorId(id);
        if (!emprestimo) throw new Error('Empréstimo não encontrado.');

        if (emprestimo.status === 'DEVOLVIDO') {
            throw new Error('Este empréstimo já foi devolvido.');
        }

        const livros = await emprestimoRepository.listarLivrosDoEmprestimo(id);

        const hoje = new Date();
        const dataDevolucaoStr = hoje.toISOString().split('T')[0];

        const emprestimoAtualizado = await emprestimoRepository.atualizarStatus(id, dataDevolucaoStr, 'DEVOLVIDO');

        // Libera cada exemplar de volta para o estoque
        for (const livro of livros) {
            await livroRepository.aumentarEstoque(livro.id);
        }

        // RN4: calcula dias de atraso em relação ao prazo de entrega
        const dataEntrega = new Date(emprestimo.data_entrega);
        const diffMs = hoje - dataEntrega;
        const diasAtraso = diffMs > 0 ? Math.ceil(diffMs / (1000 * 60 * 60 * 24)) : 0;

        return {
            ...emprestimoAtualizado,
            livros,
            dias_atraso: diasAtraso
        };
    },

    deletar: async (id) => {
        const emprestimo = await emprestimoRepository.buscarPorId(id);
        if (!emprestimo) throw new Error('Empréstimo não encontrado.');

        // Se ainda estava ativo, devolve os exemplares ao estoque antes de excluir o registro
        if (emprestimo.status === 'ATIVO') {
            const livros = await emprestimoRepository.listarLivrosDoEmprestimo(id);
            for (const livro of livros) {
                await livroRepository.aumentarEstoque(livro.id);
            }
        }

        await emprestimoRepository.deletar(id);
    }
};

module.exports = emprestimoService;
