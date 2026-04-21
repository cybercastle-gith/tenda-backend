# 🚀 Configuração do Ambiente com Docker - Tenda Back

Este guia explica como subir o ambiente de desenvolvimento da API de forma automatizada, garantindo que o banco de dados e as migrações estejam configurados corretamente.

---

## 🛠️ Pré-requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e rodando.
- Arquivo `.env` configurado (veja `.env.example`).

---

## 🏁 Passo a Passo Rápido

### 1. Preparar as Variáveis de Ambiente

Crie o arquivo `.env` na raiz do projeto copiando o exemplo:

```bash
cp .env.example .env
```

### 2. Iniciar os Containers

```bash
docker compose up -d --build
```

### 3. Rodar Migration vinda do github

```bash
docker exec -it api_solar npm run migration:run
```

Obs.:Confira se realmente tem um arquivo migration em src/shared/database/migration

## Comandos Úteis

#### Sobre a api no docker ou banco

```bash
docker logs -f api_solar
```

```bash
docker-compose stop
```

```bash
docker-compose start
```

```bash
docker-compose down -v
```

```bash
docker exec -it api_solar sh
```

---

## 🛠️ Resolvendo Conflitos de Banco

Se o banco de dados apresentar erros de "Relation already exists" ou as migrations entrarem em conflito:

1. **Limpe o banco:** `docker exec -it api_solar npm run schema:drop`
2. **Remova os volumes:** `docker-compose down -v`
3. **Suba tudo de novo:** `docker-compose up -d`
4. **Aplique as migrations:** `docker exec -it api_solar npm run migration:run`
   Obs.: Se voce excluiu as migrations dentro da src/shared/database/migrations, tera de criar uma
   com: `docker exec -it api_solar npm run migration:generate`
