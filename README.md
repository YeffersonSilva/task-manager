# Task Manager API

Este projeto é uma aplicação backend e frontend para gerenciamento de tarefas. A API é construída com Node.js, Express e MongoDB, enquanto o frontend utiliza React.

![Macbook-Air-task-manager-2t9e vercel app](https://github.com/user-attachments/assets/ff86d8f0-6e64-4f68-8233-7c1b96e882fd)

## Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Instalação](#instalação)
3. [Configuração](#configuração)
4. [Scripts Disponíveis](#scripts-disponíveis)
5. [Utilizando Docker](#utilizando-docker)
6. [Documentação da API](#documentação-da-api)
7. [Tecnologias Utilizadas](#tecnologias-utilizadas)
8. [Como Contribuir](#como-contribuir)
9. [Deploy](#deploy)
10. [Licença](#licença)

## Pré-requisitos

- Node.js (v18 ou superior)
- NPM
- Docker (opcional)
- MongoDB

## Instalação

### Backend

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/task-manager.git
# Navegue até a pasta do backend
cd task-manager/server
# Instale as dependências
npm install
```

### Frontend

```bash
# Navegue até a pasta do frontend
cd task-manager/client
# Instale as dependências
npm install
```

## Configuração

### Backend (.env)

```
PORT=8000
MONGO_URI=sua_conexao_com_mongodb
JWT_SECRET=sua_chave_secreta
CLIENT_URL=http://localhost:3000
```

### Frontend (.env)

```
REACT_APP_API_URL=http://localhost:8000/api/v1
```

## Scripts Disponíveis

### Backend

- **Desenvolvimento**: `npm run dev`
- **Build**: `npm run build`
- **Testes**: `npm test`

### Frontend

- **Desenvolvimento**: `npm start`
- **Build**: `npm run build`

## Utilizando Docker

```bash
docker-compose up --build
```

## Documentação da API

Acesse [http://localhost:8000/api-docs](http://localhost:8000/api-docs) para a documentação Swagger.

![image](https://github.com/user-attachments/assets/b2ee25f3-ba55-4cb0-b79c-95b2b257b955)


### Principais Endpoints

#### Autenticação:

- **POST** `/api/v1/auth/register`
- **POST** `/api/v1/auth/login`
- **POST** `/api/v1/auth/logout`

#### Tarefas:

- **POST** `/api/v1/task/create`
- **GET** `/api/v1/tasks`
- **GET** `/api/v1/task/:id`
- **PATCH** `/api/v1/task/:id`
- **DELETE** `/api/v1/task/:id`
- **DELETE** `/api/v1/tasks`

### Filtros de Tarefas

#### Filtro de Prioridade

As tarefas podem ser filtradas de acordo com sua prioridade, proporcionando uma melhor organização e visualização:

- 🟢 **Baixa Prioridade**: Tarefas que não precisam de atenção imediata, marcadas com a cor **verde**.
- 🟡 **Média Prioridade**: Tarefas que requerem atenção, mas não são urgentes, identificadas pela cor **amarela**.
- 🔴 **Alta Prioridade**: Tarefas que precisam ser concluídas o mais rápido possível, destacadas em **vermelho**.

#### Filtro de Status

Visualize as tarefas de acordo com seu status atual:

- ✅ **Concluída**: Tarefas que já foram finalizadas.
- ⏳ **Pendente**: Tarefas que ainda estão em aberto e precisam ser concluídas.

![iPhone-13-PRO-task-manager-2t9e vercel app](https://github.com/user-attachments/assets/51fb1ede-f1fd-4cd9-82f1-ebbe938edb95)


## Tecnologias Utilizadas

- **Backend**: ![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white) ![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white) ![Mongoose](https://img.shields.io/badge/Mongoose-AA2929?logo=mongodb&logoColor=white) ![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white)
- **Frontend**: ![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black) ![Context API](https://img.shields.io/badge/Context%20API-61DAFB?logo=react&logoColor=black) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
- **Containerização**: ![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white) ![Docker Compose](https://img.shields.io/badge/Docker%20Compose-2496ED?logo=docker&logoColor=white)


## Como Contribuir

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Faça commit das suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Deploy
```bash
https://task-manager-2t9e.vercel.app/login
```
## Licença

Distribuído sob a licença MIT. Veja [LICENSE](LICENSE) para mais informações.
