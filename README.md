# API Biblioteca - Trabalho Final (DSA)

Este repositório contém o back-end do trabalho final da disciplina de Desenvolvimento de
Serviços e APIs. A aplicação é uma API RESTful para gerenciar o acervo, os clientes e os
empréstimos de uma biblioteca, utilizando Node.js, Express e PostgreSQL.

## Arquitetura do Projeto

O projeto foi estruturado com base no modelo de camadas:

- **`/router`** — Define os endpoints (URLs) e os verbos HTTP (GET, POST, PUT, DELETE)
- **`/controller`** — Recebe a requisição, extrai os parâmetros/body e chama a regra de
  negócio. Retorna os status codes corretos (200, 201, 400, 404, etc.)
- **`/service`** — Onde fica o "coração" da aplicação: validações e regras de negócio
- **`/repository`** — Acesso direto ao banco de dados PostgreSQL (comandos SQL)
- **`/middleware`** — Interceptadores, como a validação do token JWT para rotas protegidas

```
Router → Controller → Service → Repository → Banco de Dados
```

## Modelo de dados

```
usuarios                              (bibliotecários que fazem login no sistema)

autores (1) ──< (N) livros

tipos_cliente (1) ──< (N) clientes (1) ──< (N) emprestimos (1) ──< (N) emprestimo_livros >── (N) livros
```

- **usuarios** — quem faz login/autenticação no sistema (diferente de "cliente")
- **autores / livros** — acervo da biblioteca
- **tipos_cliente** — define o limite máximo de livros que um tipo de cliente pode ter emprestados
- **clientes** — quem retira os livros na biblioteca
- **emprestimos** — cada empréstimo pertence a um cliente e guarda retirada, prazo e status
- **emprestimo_livros** — tabela associativa: permite vários livros em um mesmo empréstimo

## Como Rodar o Projeto Localmente

Cada integrante deve seguir estes passos na sua própria máquina:

### 1. Clonar o repositório
```bash
git clone https://github.com/SEU_USUARIO/api-biblioteca-dsa.git
cd api-biblioteca-dsa
```

### 2. Instalar as dependências
```bash
npm install
```

### 3. Configurar Variáveis de Ambiente (.env)
Crie um arquivo `.env` na raiz do projeto (ele é ignorado pelo Git de propósito, cada
integrante tem o seu, com sua própria senha local):
```
DB_USER=postgres
DB_PASSWORD=sua_senha_do_postgres_aqui
DB_HOST=localhost
DB_PORT=5432
DB_NAME=biblioteca_db
PORT=3000
```

### 4. Configurar o Banco de Dados
1. Abra o pgAdmin e crie um banco de dados chamado `biblioteca_db`
2. Abra o arquivo `database.sql` na raiz do projeto, copie todo o conteúdo
3. No pgAdmin, abra a **Query Tool**, cole o código e execute (F5)
4. Isso cria as 7 tabelas: `usuarios`, `autores`, `livros`, `tipos_cliente`, `clientes`,
   `emprestimos`, `emprestimo_livros`
5. (Opcional) Rode também o `seed.sql` para popular dados de teste

### 5. Iniciar o Servidor
```bash
npm run dev
```
O servidor estará rodando em `http://localhost:3000`.

## Fluxo de Trabalho com Branches

Para que todos possam programar ao mesmo tempo sem sobrepor o trabalho uns dos outros,
**nunca commitem diretamente na branch `main`**. Utilizem o seguinte fluxo:

1. **Atualize seu código local:**
   ```bash
   git checkout main
   git pull origin main
   ```
2. **Crie sua própria branch de trabalho:**
   ```bash
   git checkout -b nome-da-sua-branch
   ```
3. **Programe e faça commits pequenos e descritivos:**
   ```bash
   git add .
   git commit -m "feat: descrição da mudança"
   ```
4. **Envie sua branch para o GitHub:**
   ```bash
   git push -u origin nome-da-sua-branch
   ```
5. **Abra um Pull Request** no site do GitHub para `main`, e peça revisão do grupo antes
   do merge.

## Divisão de Tarefas do Grupo

### Membro 1 — Segurança e Usuários
**Branch:** `feature/auth-usuarios`
- CRUD de usuários
- Autenticação com hash de senha (`bcrypt`) e login com token JWT (`/api/login`)
- `auth_middleware.js` para bloquear rotas que exigem login

### Membro 2 — Catálogo e Relacionamentos
**Branch:** `feature/crud-livros`
- CRUD de autores
- CRUD de livros, com `GET /livros/:id` retornando o autor mesclado (INNER JOIN)
- Impede a exclusão de um autor que tenha livros associados

### Membro 3 — Transações e Regras de Negócio
**Branch:** `feature/emprestimos`
- CRUD de tipos de cliente
- CRUD de clientes
- CRUD de empréstimos, unindo cliente e livro(s), com as regras de negócio abaixo

## Regras de Negócio (Empréstimos)

| Regra | Descrição |
|---|---|
| **RN1** | Um livro só pode ser retirado se estiver disponível (`quantidade_estoque > 0`) |
| **RN2** | A data de entrega é calculada automaticamente como retirada + 15 dias |
| **RN3** | Um cliente não pode retirar mais livros do que o limite do seu tipo de cliente |
| **RN4** | Ao devolver, calcula-se o número de dias de atraso, se houver |

## Endpoints

### Autenticação e Usuários (Membro 1)
| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/login` | Realiza login e retorna um token JWT |
| ... | `/api/usuarios/...` | CRUD de usuários |

### Autores e Livros (Membro 2)
| Método | Rota | Descrição |
|---|---|---|
| ... | `/api/autores/...` | CRUD de autores |
| ... | `/api/livros/...` | CRUD de livros (com autor mesclado no GET por ID) |

### Tipos de Cliente (Membro 3)
| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/tipos-cliente` | Cria um tipo de cliente |
| GET | `/api/tipos-cliente` | Lista todos os tipos |
| GET | `/api/tipos-cliente/:id` | Busca um tipo por ID |
| PUT | `/api/tipos-cliente/:id` | Atualiza um tipo |
| DELETE | `/api/tipos-cliente/:id` | Remove um tipo (bloqueado se houver clientes vinculados) |

### Clientes (Membro 3)
| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/clientes` | Cria um cliente |
| GET | `/api/clientes` | Lista todos os clientes |
| GET | `/api/clientes/:id` | Busca um cliente por ID (com o tipo de cliente aninhado) |
| PUT | `/api/clientes/:id` | Atualiza um cliente |
| DELETE | `/api/clientes/:id` | Remove um cliente |

### Empréstimos (Membro 3)
| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/emprestimos` | Cria um empréstimo (aplica RN1, RN2 e RN3) |
| GET | `/api/emprestimos` | Lista todos os empréstimos |
| GET | `/api/emprestimos/:id` | Busca um empréstimo por ID (cliente e livros mesclados) |
| PUT | `/api/emprestimos/:id/devolver` | Registra a devolução (aplica RN4) |
| DELETE | `/api/emprestimos/:id` | Remove um empréstimo |

## Roteiro de testes sugerido

1. **Autenticação** — criar usuário, fazer login, testar rota protegida com e sem token
2. **Autores e Livros** — criar autor, criar livro, buscar livro por ID com autor mesclado
3. **Tipos de Cliente** — criar, listar, buscar, atualizar
4. **Clientes** — criar (vinculado a um tipo), listar, buscar (com tipo mesclado), atualizar
5. **Empréstimos**:
   - Criar um empréstimo válido (confirma RN2)
   - Tentar criar com livro sem estoque (confirma RN1 — erro 400)
   - Tentar exceder o limite do tipo de cliente (confirma RN3 — erro 400)
   - Buscar por ID (confirma o merge de cliente + livros)
   - Devolver (confirma RN4 — `dias_atraso`)
   - Tentar devolver de novo (confirma bloqueio de duplicidade — erro 400)
6. **Exclusões finais** — deletar clientes, depois tipos de cliente (testando também o
   bloqueio ao tentar deletar um tipo ainda vinculado a um cliente)

## Melhorias futuras identificadas

- Uso de transações de banco (`BEGIN`/`COMMIT`/`ROLLBACK`) na criação de empréstimos, para
  garantir atomicidade caso algo falhe no meio do processo
- Validação de formato para o campo `telefone`
- Impedir a exclusão de um cliente que ainda possua empréstimos ativos
