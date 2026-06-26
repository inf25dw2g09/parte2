# TaskManager — Aplicação Web Cliente (Parte 2)

Aplicação Web desenvolvida em **ReactJS** para gestão de tarefas pessoais, que consome a API REST desenvolvida na Parte 1.

## Tecnologias

- **ReactJS 18** — biblioteca de UI
- **React Context API** — gestão de estado global de autenticação
- **Fetch API** — comunicação com a API REST
- **CSS puro** — estilização responsiva sem dependências externas
- **Docker + Nginx** — containerização e serving em produção

## Estrutura do Projeto

```
task-manager-client/
├── public/
│   └── index.html
├── src/
│   ├── context/
│   │   └── AuthContext.js       # Estado global de autenticação
│   ├── pages/
│   │   ├── LoginPage.js         # Login e Registo
│   │   ├── TasksPage.js         # CRUD de Tarefas
│   │   ├── CategoriesPage.js    # CRUD de Categorias
│   │   └── ProfilePage.js       # Editar perfil / Apagar conta
│   ├── services/
│   │   └── api.js               # Camada de acesso à API REST
│   ├── App.js                   # Shell principal com sidebar
│   ├── App.css                  # Estilos globais
│   └── index.js                 # Ponto de entrada React
├── .env                         # URL da API
├── Dockerfile                   # Build multi-stage (Node → Nginx)
├── docker-compose.yml
└── nginx.conf
```

## Funcionalidades

### Autenticação (OAuth2 — Resource Owner Password Credentials)
- Login com email e password
- Registo de nova conta (com auto-login após registo)
- Armazenamento do `access_token` em `localStorage`
- Logout com limpeza do token
- Proteção automática: redireciona para login se token expirado/inválido

### Tarefas (CRUD completo)
- Listagem das tarefas do utilizador autenticado
- Estatísticas por estado (pendente / em progresso / feito)
- Filtragem por estado
- Criar, editar e apagar tarefas via modal
- Confirmação antes de apagar

### Categorias (CRUD completo)
- Listagem de todas as categorias
- Criar, editar e apagar categorias
- Visualização com cores distintas por categoria

### Perfil
- Ver dados do utilizador autenticado
- Editar nome e email
- Apagar conta (com confirmação)

## Executar em desenvolvimento

### Pré-requisitos
- Node.js 18+
- API da Parte 1 a correr em `http://localhost:3000`

```bash
npm install
npm start
```

A aplicação abre em `http://localhost:3001`.

**Conta de teste:** `igor1@email.com` / `123`

## Executar com Docker

```bash
docker-compose up --build
```

A aplicação fica disponível em `http://localhost:80`.

> A API da Parte 1 deve estar a correr separadamente (ver `docker-compose.yml` da Parte 1).

## Fluxo de Autenticação

```
1. Utilizador introduz email + password no LoginPage
2. Cliente envia POST /oauth/token com grant_type=password + client_id + client_secret
3. API valida credenciais e devolve { access_token, token_type, expires_in }
4. Cliente guarda o token em localStorage
5. Todas as chamadas seguintes incluem o header: Authorization: Bearer <token>
6. Se a API devolver 401/403, o token é removido e o utilizador é redireccionado para o login
```

Este fluxo corresponde ao **Resource Owner Password Credentials Grant** do OAuth 2.0 (RFC 6749 §4.3).

## Variáveis de Ambiente

| Variável              | Valor por defeito          | Descrição               |
|-----------------------|----------------------------|-------------------------|
| `REACT_APP_API_URL`   | `http://localhost:3000`    | URL base da API REST    |
