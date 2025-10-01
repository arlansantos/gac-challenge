# API de Unidades Organizacionais (Closure Table)

![NestJS](https://imgshields.io/badge/NestJS-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Postgres](https://img.shields.io/badge/PostgreSQL-4169E1.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED.svg?style=for-the-badge&logo=docker&logoColor=white)

API RESTful desenvolvida em **NestJS** e **TypeScript** para gerenciar uma hierarquia de Unidades Organizacionais (usuários e grupos), utilizando o padrão **Closure Table** para consultas de alta performance em um banco de dados **PostgreSQL**.

Este projeto foi construído como solução para o desafio técnico do Grupo Adriano Cobuccio, com foco em código limpo, arquitetura modular, performance e observabilidade.

## Focos do Projeto

* **Arquitetura Modular:** A aplicação é estruturada em módulos de funcionalidades (`Users`, `Groups`, `Nodes`), promovendo a separação de responsabilidades e facilitando a manutenção.
* **Performance com Closure Table:** O coração do projeto é a implementação do padrão *Closure Table* para modelar a hierarquia. Isso permite consultas de ancestralidade e descendência (`ancestors`, `descendants`, `organizations`) com altíssima performance, evitando a necessidade de queries recursivas no banco de dados.
* **Segurança e Consistência:** Todas as operações de escrita que afetam a hierarquia são executadas dentro de transações atômicas (`QueryRunner`), garantindo a integridade dos dados. A lógica inclui validações robustas para prevenir a criação de ciclos na estrutura.
* **Tipagem Estrita:** O código é 100% tipado, utilizando DTOs para validação de entrada (`class-validator`) e `interfaces`/`types` para garantir a segurança de tipos em toda a aplicação.

## Tech Stack

* **Framework:** NestJS
* **Linguagem:** TypeScript
* **Banco de Dados:** PostgreSQL
* **ORM:** TypeORM
* **Containerização:** Docker & Docker Compose
* **Documentação:** Swagger (OpenAPI)

## Como Executar o Projeto

Siga os passos abaixo para executar a aplicação e todas as suas dependências em um ambiente local containerizado.

### Pré-requisitos

* [Docker](https://www.docker.com/get-started/)
* [Docker Compose](https://docs.docker.com/compose/install/)
* [Node.js](https://nodejs.org/)
* [Git](https://git-scm.com/)

### 1. Clonar o Repositório

```bash
git clone https://github.com/arlansantos/gac-challenge.git
cd gac-challenge
```

### 2. Configurar Variáveis de Ambiente

Crie uma cópia do arquivo de exemplo `.env.example` e renomeie para `.env`. Os valores padrão já estão configurados para funcionar com o `docker-compose.yaml`.

```bash
cp .env.example .env
```

### 3. Subir os Containers

Execute o comando abaixo para construir as imagens e iniciar os containers da API, do banco de dados e do Adminer.

```bash
docker-compose up -d --build
```

* A API estará disponível em `http://localhost:3000`.
* A documentação interativa do Swagger estará em `http://localhost:3000/api-docs`.
* O Adminer (gerenciador de banco) estará em `http://localhost:8080`.

### 4. Rodar as Migrations

Com os containers em execução, aplique as migrations para criar a estrutura de tabelas no banco de dados.

```bash
npm run migration:run
```

Pronto! A aplicação está no ar e pronta para ser utilizada.

## Documentação da API (Swagger)

A API é documentada utilizando a especificação OpenAPI, com uma interface interativa gerada pelo **Swagger UI**.

Para acessar a documentação e interagir com os endpoints diretamente pelo navegador, visite:

**[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**

## Executando os Testes do Desafio (Seção para os Avaliadores)

Para validar a API com os testes de integração e carga fornecidos no repositório do desafio:

1.  **Clone o repositório do desafio** e siga as instruções de instalação das dependências Python (`pip install -r requirements.txt`).

2.  **Configure a variável de ambiente `BASE_URL`**. Este passo é crucial para que os testes saibam o endereço da sua API.

    * **No Windows (PowerShell):**
        ```powershell
        $env:BASE_URL = "http://localhost:3000"
        ```
    * **No Linux, macOS ou Git Bash:**
        ```bash
        export BASE_URL="http://localhost:3000"
        ```

3.  **Execute os testes de integração (pytest)** no mesmo terminal onde configurou a variável:
    ```bash
    pytest -v
    ```

4.  **Execute os testes de carga (locust)**:
    ```bash
    # No Windows (PowerShell)
    locust -f locustfile.py --headless -u 30 -r 5 -t 1m --host "$env:BASE_URL"

    # No Linux, macOS ou Git Bash
    locust -f locustfile.py --headless -u 30 -r 5 -t 1m --host "$BASE_URL"
    ```

## Observabilidade (Rastreamento de Requisições)

Para melhorar a observabilidade, a aplicação utiliza um `TraceInterceptor` global.

Este interceptor é responsável por:
* **Adicionar um `traceId` único** a cada requisição HTTP que chega à API.
* **Logar o início e o fim** de cada requisição, incluindo seu `método`, `URL` e a **duração total** da operação.


## Endpoints da API

| Método | Rota                         | Descrição                                                                      |
| :----- | :--------------------------- | :------------------------------------------------------------------------------- |
| `POST` | `/users`                     | Cria um novo usuário.                                                            |
| `POST` | `/groups`                    | Cria um novo grupo, opcionalmente associado a um `parentId`.                     |
| `POST` | `/users/:id/groups`          | Associa um usuário existente a um grupo.                                         |
| `GET`  | `/users/:id/organizations`   | Lista todas as organizações (grupos) de um usuário, diretas e herdadas, ordenadas por `depth`. |
| `GET`  | `/nodes/:id/ancestors`       | Lista todos os ancestrais de um nó (usuário ou grupo), com `depth >= 1`.         |
| `GET`  | `/nodes/:id/descendants`     | Lista todos os descendentes de um nó (usuário ou grupo), com `depth >= 1`.       |
````
