Task Manager API

Este projeto é uma aplicação backend e frontend para gerenciamento de tarefas. A API é construída com Node.js, Express e MongoDB, enquanto o frontend utiliza React.

Índice

- Pré-requisitos
- Instalação
- Configuração
- Scripts Disponíveis
- Utilizando Docker
- Documentação da API
- Tecnologias Utilizadas
- Como Contribuir
- Licença

Pré-requisitos

- Node.js (v18 ou superior)
- NPM
- Docker (opcional)
- MongoDB

Instalação

Backend

git clone https://github.com/seu-usuario/task-manager.git
cd task-manager/server
npm install

Frontend

cd task-manager/client
npm install

Configuração

Backend (.env)

PORT=8000
MONGO_URI=sua_conexao_com_mongodb
JWT_SECRET=sua_chave_secreta
CLIENT_URL=http://localhost:3000

Frontend (.env)

REACT_APP_API_URL=http://localhost:8000/api/v1

Scripts Disponíveis

Backend

- Desenvolvimento: npm run dev
- Build: npm run build
- Testes: npm test

Frontend

- Desenvolvimento: npm start
- Build: npm run build

Utilizando Docker

docker-compose up --build

Documentação da API

Acesse http://localhost:8000/api-docs para a documentação Swagger.

Principais Endpoints

- Autenticação:
  - POST /api/v1/auth/register
  - POST /api/v1/auth/login
  - POST /api/v1/auth/logout

- Tarefas:
  - POST /api/v1/task/create
  - GET /api/v1/tasks
  - GET /api/v1/task/:id
  - PATCH /api/v1/task/:id
  - DELETE /api/v1/task/:id
  - DELETE /api/v1/tasks

Tecnologias Utilizadas

- Backend: Node.js, Express, MongoDB, Mongoose, JWT
- Frontend: React, Context API, TypeScript
- Docker e Docker Compose

Como Contribuir

1. Faça um fork do repositório
2. Crie uma branch para sua feature (git checkout -b feature/AmazingFeature)
3. Faça commit das suas mudanças (git commit -m 'Add some AmazingFeature')
4. Push para a branch (git push origin feature/AmazingFeature)
5. Abra um Pull Request

Licença

Distribuído sob a licença MIT. Veja LICENSE para mais informações.
