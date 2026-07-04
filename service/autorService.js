const autorRepository = require('../repository/autorRepository');
const livroRepository = require('../repository/livroRepository');

const autorService = {
    criar: async (nome) => {
        if (!nome) throw new Error('O nome do autor é obrigatório.');
        return await autorRepository.criar(nome);
    },
    listarTodos: async () => {
        return await autorRepository.listarTodos();
    },
    buscarPorId: async (id) => {
        const autor = await autorRepository.buscarPorId(id);
        if (!autor) throw new Error('Autor não encontrado.');
        return autor;
    },
    atualizar: async (id, nome) => {
        if (!nome) throw new Error('O nome do autor é obrigatório.');
        await autorService.buscarPorId(id); // Valida se o autor existe
        return await autorRepository.atualizar(id, nome);
    },
    deletar: async (id) => {
        await autorService.buscarPorId(id); // Valida se o autor existe

        // Exigência do trabalho: Impedir a exclusão de Autor se ele tiver livros associados
        const totalLivros = await livroRepository.contarLivrosPorAutor(id);
        if (totalLivros > 0) {
            throw new Error('Não é possível excluir um autor que possui livros associados.');
        }

        await autorRepository.deletar(id);
    }
};

module.exports = autorService;