# 🚀 Configuração do Ambiente com Docker - Tenda Back

Este guia explica como subir o ambiente de desenvolvimento da API de forma automatizada, garantindo que o banco de dados e as migrações estejam configurados corretamente.

---

## 🛠️ Pré-requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e rodando.
- Arquivo `.env` configurado (veja `.env.example`).

---

## 🏁 Inicialização Rápida

### 1. Preparar as Variáveis de Ambiente

Crie o arquivo `.env` na raiz do projeto:

```bash
cp .env.example .env
```

### 2. Iniciar os Containers

```bash
docker compose up -d --build
```

Detecta mudanças, reconstrói a imagem e substitui o container antigo automaticamente.

### 3. Rodar as Migrations

```bash
docker exec -it api_solar npm run migration:run
```

> **Nota:** Confirme se realmente existe um arquivo de migration em `src/shared/database/migrations`

---

## 📋 Comandos Úteis

### Ver Logs

```bash
docker logs -f api_solar
```

Exibe os logs em tempo real da API.

### Parar os Containers

```bash
docker compose stop
```

Pausa os containers sem removê-los (pode ser reiniciado com `start`).

### Reiniciar os Containers

```bash
docker compose start
```

Reinicia containers que foram parados.

### Remover Containers e Volumes

```bash
docker compose down -v
```

Remove containers, redes e volumes (⚠️ apaga dados do banco).

### Acessar o Container

```bash
docker exec -it api_solar sh
```

Abre um shell dentro do container da API.

### Listar Containers

```bash
docker ps              # Containers ativos
docker ps -a           # Todos os containers
docker ps -aq | wc -l  # Quantidade total de containers
```

### Parar um Container Específico

```bash
docker stop <id_container ou nome>
```

---

## 🔧 Resolvendo Conflitos de Banco

### Erro: "Relation already exists" ou Migrations em Conflito

**Solução passo a passo:**

1. Limpe o banco:

   ```bash
   docker exec -it api_solar npm run schema:drop
   ```

2. Remova os volumes:

   ```bash
   docker compose down -v
   ```

3. Suba tudo novamente:

   ```bash
   docker compose up -d --build
   ```

4. Aplique as migrations:
   ```bash
   docker exec -it api_solar npm run migration:run
   ```

### Migrations Foram Deletadas

Se você deletou as migrations em `src/shared/database/migrations`, crie uma nova:

```bash
docker exec -it api_solar npm run migration:generate
```

### Reset Completo (Após Importar Nova Biblioteca)

```bash
docker compose down
docker compose build --no-cache
docker compose up
```

Reconstrói tudo do zero, garantindo que novas dependências sejam instaladas.
