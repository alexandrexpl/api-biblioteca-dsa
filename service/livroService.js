const livroRepository = require('../repository/livroRepository');
const autorRepository = require('../repository/autorRepository');

const livroService = {
    criar: async (titulo, ano, autor_id, quantidade_estoque) => {
        if (!titulo || !autor_id) throw new Error('Título e ID do Autor são obrigatórios.');
        
        // Verifica se o autor informado realmente existe antes de cadastrar o livro
        const autorExiste = await autorRepository.buscarPorId(autor_id);
        if (!autorExiste) throw new Error('Autor informado não existe.');

        return await livroRepository.criar(titulo, ano, autor_id, quantidade_estoque || 0);
    },
    listarTodos: async () => {
        return await livroRepository.listarTodos();
    },
    buscarPorId: async (id) => {
        const livro = await livroRepository.buscarPorIdComAutor(id);
        if (!livro) throw new Error('Livro não encontrado.');
        
        // Formata o retorno para ficar um objeto limpo contendo dados do livro e o autor aninhado
        return {
            id: livro.id,
            titulo: livro.titulo,
            ano: livro.ano,
            quantidade_estoque: livro.quantidade_estoque,
            autor: {
                id: livro.autor_id,
                nome: livro.autor_nome
            }
        };
    },
    atualizar: async (id, titulo, ano, autor_id, quantidade_estoque) => {
        if (!titulo || !autor_id) throw new Error('Título e ID do Autor são obrigatórios.');
        
        const livroExiste = await livroRepository.buscarPorIdComAutor(id);
        if (!livroExiste) throw new Error('Livro não encontrado.');

        const autorExiste = await autorRepository.buscarPorId(autor_id);
        if (!autorExiste) throw new Error('Autor informado não existe.');

        return await livroRepository.atualizar(id, titulo, ano, autor_id, quantidade_estoque);
    },
    deletar: async (id) => {
        const livroExiste = await livroRepository.buscarPorIdComAutor(id);
        if (!livroExiste) throw new Error('Livro não encontrado.');
        
        await livroRepository.deletar(id);
    }
};

module.exports = livroService;