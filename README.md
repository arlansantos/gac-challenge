# API de Unidades Organizacionais (Closure Table)

![NestJS](https://img.shields.io/badge/NestJS-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Postgres](https://img.shields.io/badge/PostgreSQL-4169E1.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED.svg?style=for-the-badge&logo=docker&logoColor=white)

API RESTful desenvolvida em **NestJS** e **TypeScript** para gerenciar uma hierarquia de Unidades Organizacionais (usuários e grupos), utilizando o padrão **Closure Table** para consultas de alta performance em um banco de dados **PostgreSQL**.

Este projeto foi construído como solução para o desafio técnico do Grupo Adriano Cobuccio, com foco em código limpo, arquitetura modular, performance e observabilidade.

## Focos do Projeto

* **Arquitetura Modular:** A aplicação é estruturada em módulos de funcionalidades (`Users`, `Groups`, `Nodes`), promovendo a separação de responsabilidades e facilitando a manutenção.
* **Performance com Closure Table:** O coração do projeto é a implementação do padrão *Closure Table* para modelar a hierarquia. Isso permite consultas de ancestralidade e descendência (`ancestors`, `descendants`, `organizations`) com altíssima performance, evitando a necessidade de queries recursivas (`WITH RECURSIVE`) no banco de dados.
* **Segurança e Consistência:** Todas as operações de escrita que afetam a hierarquia são executadas dentro de transações atômicas (`QueryRunner`), garantindo a integridade dos dados. A lógica inclui validações robustas para prevenir a criação de ciclos na estrutura.
* **Tipagem Estrita:** O código é 100% tipado, utilizando DTOs para validação de entrada e `interfaces`/`types` para garantir a segurança de tipos em toda a aplicação.

## Tech Stack

* **Framework:** NestJS
* **Linguagem:** TypeScript
* **Banco de Dados:** PostgreSQL
* **ORM:** TypeORM
* **Containerização:** Docker & Docker Compose

## Como Executar o Projeto

Siga os passos abaixo para executar a aplicação e todas as suas dependências em um ambiente local containerizado.

### Pré-requisitos

* [Docker](https://www.docker.com/get-started/)
* [Docker Compose](https://docs.docker.com/compose/install/)
* [Node.js](https://nodejs.org/) (para a CLI do NestJS e scripts)
* [Git](https://git-scm.com/)

### 1. Clonar o Repositório

```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd <NOME_DA_PASTA>
```

### 2. Configurar Variáveis de Ambiente

Crie uma cópia do arquivo de exemplo `.env.example` e renomeie para `.env`. Os valores padrão já estão configurados para funcionar com o `docker-compose.yaml`.

```bash
cp .env.example .env
```

### 3. Subir os Containers

Execute o comando abaixo para construir as imagens e iniciar os containers da API, do banco de dados e do Adminer (gerenciador de banco de dados web).

```bash
docker-compose up -d
```

* A API estará disponível em `http://localhost:3000`.
* O banco de dados estará acessível na porta `5432`.
* O Adminer estará disponível em `http://localhost:8080`.

### 4. Rodar as Migrations

Com os containers em execução, aplique as migrations para criar a estrutura de tabelas no banco de dados.

```bash
npm run migration:run
```

Pronto! A aplicação está no ar e pronta para receber requisições.

## Executando os Testes do Desafio

Para validar a API com os testes de integração e carga fornecidos no repositório do desafio:

1.  **Clone o repositório do desafio** e siga as instruções de instalação das dependências Python (`pip install -r requirements.txt`).
2.  **Exporte a variável de ambiente `BASE_URL`**:
    ```bash
    export BASE_URL="http://localhost:3000"
    ```
3.  **Execute os testes de integração (pytest)**:
    ```bash
    pytest -v
    ```
4.  **Execute os testes de carga (locust)**:
    ```bash
    locust -f locustfile.py --headless -u 30 -r 5 -t 1m --host "$BASE_URL"
    ```

## Documentação da API

| Método | Rota                                       | Descrição                                                                      |
| :----- | :----------------------------------------- | :------------------------------------------------------------------------------- |
| `POST` | `/users`                                   | Cria um novo usuário.                                                            |
| `POST` | `/groups`                                  | Cria um novo grupo, opcionalmente associado a um `parentId`.                     |
| `POST` | `/users/:id/groups`                        | Associa um usuário existente a um ou mais grupos.                                |
| `GET`  | `/users/:id/organizations`                 | Lista todas as organizações (grupos) de um usuário, diretas e herdadas, ordenadas por `depth`. |
| `GET`  | `/nodes/:id/ancestors`                     | Lista todos os ancestrais de um nó (usuário ou grupo), com `depth >= 1`.         |
| `GET`  | `/nodes/:id/descendants`                   | Lista todos os descendentes de um nó (usuário ou grupo), com `depth >= 1`.       |

---
