-- Script de Inicialização do Banco de Dados da Biblioteca
-- Copiem este código e rodem no Query Tool do pgAdmin local
-- Versão atualizada: inclui tipos_cliente, clientes e empréstimos com múltiplos livros

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER'
);

CREATE TABLE autores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE livros (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    ano INT,
    autor_id INT NOT NULL,
    quantidade_estoque INT DEFAULT 0,
    FOREIGN KEY (autor_id) REFERENCES autores(id) ON DELETE RESTRICT
);

-- Tipos de cliente
-- RN3: cada tipo define quantos livros o cliente pode retirar ao mesmo tempo
CREATE TABLE tipos_cliente (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    quantidade_maxima_livros INT NOT NULL
);

-- Clientes
-- Quem retira os livros. Diferente de "usuarios" (que são os bibliotecários que fazem login)
CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    matricula VARCHAR(20) UNIQUE NOT NULL,
    nome VARCHAR(100) NOT NULL,
    tipo_cliente_id INT NOT NULL,
    email VARCHAR(100),
    telefone VARCHAR(20),
    FOREIGN KEY (tipo_cliente_id) REFERENCES tipos_cliente(id)
);

-- Empréstimos
-- Cada empréstimo pertence a um cliente e já guarda o prazo de entrega (RN2)
CREATE TABLE emprestimos (
    id SERIAL PRIMARY KEY,
    cliente_id INT NOT NULL,
    data_retirada DATE NOT NULL DEFAULT CURRENT_DATE,
    data_entrega DATE NOT NULL,          -- RN2: retirada + 15 dias, calculado na criação
    data_devolucao DATE,                 -- só é preenchido quando o cliente devolve
    status VARCHAR(20) DEFAULT 'ATIVO',  -- ATIVO ou DEVOLVIDO
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

-- Itens do empréstimo
-- Tabela associativa que permite VÁRIOS livros no mesmo empréstimo
CREATE TABLE emprestimo_livros (
    id SERIAL PRIMARY KEY,
    emprestimo_id INT NOT NULL,
    livro_id INT NOT NULL,
    FOREIGN KEY (emprestimo_id) REFERENCES emprestimos(id) ON DELETE CASCADE,
    FOREIGN KEY (livro_id) REFERENCES livros(id)
);
