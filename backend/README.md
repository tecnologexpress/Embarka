# Embarka Backend

Uma API RESTful construída com NestJS, TypeScript e PostgreSQL.

## 🚀 Tecnologias

- **NestJS** - Framework Node.js progressivo
- **TypeScript** - Superset tipado do JavaScript
- **PostgreSQL** - Banco de dados relacional
- **TypeORM** - ORM para TypeScript/JavaScript
- **JWT** - Autenticação baseada em tokens
- **Swagger** - Documentação da API
- **Docker** - Containerização

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
```

## 🔧 Configuração

Configure as variáveis de ambiente no arquivo `.env`:

```bash
# App
NODE_ENV=development
PORT=3000
CORS_ORIGINS=http://localhost:3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=embarka
DB_SSL=false

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
```

## 🐳 Docker

```bash
# Subir banco de dados
docker-compose up -d

# Executar migrações
npm run migration:run
```

## 🏃‍♂️ Executando

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

## 📚 Documentação da API

Acesse a documentação Swagger em: `http://localhost:3000/api/docs`

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Coverage
npm run test:cov
```

## 📁 Estrutura do Projeto

```
src/
├── config/          # Configurações da aplicação
├── modules/         # Módulos da aplicação
│   ├── auth/        # Autenticação e autorização
│   ├── users/       # Gerenciamento de usuários
│   └── health/      # Health checks
├── common/          # Utilitários e shared resources
├── app.module.ts    # Módulo principal
└── main.ts          # Entry point da aplicação
```

## 🔐 Endpoints Principais

### Autenticação
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/register` - Registro

### Usuários
- `GET /api/v1/users` - Listar usuários
- `GET /api/v1/users/:id` - Buscar usuário
- `PATCH /api/v1/users/:id` - Atualizar usuário
- `DELETE /api/v1/users/:id` - Remover usuário

### Health
- `GET /api/v1/health` - Status da aplicação

## 🤝 Contribuição

1. Faça o fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE).