# 🔄 Ciclo de Desenvolvimento - Tenda Back

**Este é o GUIA DEFINITIVO** para o fluxo de trabalho do projeto Tenda. Todos os desenvolvedores **DEVEM** seguir estas regras **ESTRITAMENTE** para garantir a entrega do MVP em 60 dias sem retrabalho.

---

## 🏗️ Arquitetura de Repositórios

O projeto é dividido em **três repositórios separados** para evitar gargalos de dependências e isolar responsabilidades:

| Repositório               | Responsáveis           | Objetivo                  |
| ------------------------- | ---------------------- | ------------------------- |
| **tenda-backend**         | Ruan, Jorge, Jefferson | API e lógica de negócio   |
| **tenda-frontend-app**    | Vitor, Ethiel          | Aplicativo Mobile B2C     |
| **tenda-frontend-painel** | Felipe                 | Backoffice Administrativo |

---

## 📋 Estrutura de Branches

```
main (produção oficial)
  ├── sprint-01-autenticacao
  │   ├── sprint-01-autenticacao-task-02
  │   └── sprint-01-autenticacao-task-03
  ├── sprint-02-faturacao
  │   └── sprint-02-faturacao-task-01
  └── [outras branches de sprint]
```

### **main** (A "Foto Oficial")

- ✅ **Código oficial** do projeto em cada Sprint
- ✅ **APENAS Pull Requests**, NUNCA commit direto
- ✅ Atualizada no final de cada Sprint
- ✅ Base para todas as novas branches
- ⚠️ Scrum Master (Felipe) é responsável pelos merges

### **sprint-[numero]-[nome-curto]**

- 🚀 Branch principal de trabalho de uma Sprint
- 📌 **Padrão obrigatório:** `sprint-01-autenticacao`
- 📝 Pode conter sub-branches (tasks)
- 👥 Pode ser compartilhada entre desenvolvedores

### **sprint-[numero]-[nome]-task-[numero]** (Opcional)

- ✂️ Sub-branch para tarefas específicas dentro de uma Sprint
- 📌 **Padrão obrigatório:** `sprint-01-autenticacao-task-02`
- 👥 Usada quando a Sprint é dividida entre desenvolvedores
- 🔗 Sempre faz PR para a branch sprint-[numero]-[nome]

---

## ⏱️ Fluxo de Fechamento de Sprint (CRÍTICO)

O Git tem um fluxo especial nas horas finais da Sprint para garantir sincronização total.

### **12h Antes da Reunião de Sprint**

#### 🚫 Code Freeze (Congelamento)

- **NENHUM código novo** pode ser iniciado
- ❌ PROIBIDO criar novas branches
- ❌ PROIBIDO iniciar novas features
- ✅ **ÚNICO FOCO:** Terminar Pull Requests abertos

**Ação Obrigatória:**

```bash
# Finalize PRs abertos
# Não inicie trabalho novo
```

### **Durante ou Logo Após a Reunião**

#### 📥 Merge de Fechamento

- Scrum Master (Felipe) faz merge de todas as tasks aprovadas para `main`
- A `main` se torna a "**foto oficial**" daquela Sprint finalizada
- **Relatório de IA** deve estar anexado em cada PR

### **Pós-Reunião (A Nova Largada)**

#### 🔄 Sincronização Obrigatória

Todos os desenvolvedores **DEVEM** fazer isso imediatamente:

```bash
# 1. Voltar para main
git checkout main

# 2. Puxar as atualizações
git pull origin main

# 3. Verificar que está sincronizado
git log --oneline -5
```

> ⚠️ **CRÍTICO:** Não comece nada novo até fazer isso!

#### 🆕 Criar Novas Branches

As branches da próxima Sprint **SÓ PODEM** ser criadas após sincronizar:

```bash
# 1. Certifique-se de estar em main (atualizado)
git checkout main
git pull origin main

# 2. Crie a nova branch
git checkout -b sprint-02-faturacao
```

**Boa prática:** Acesse a main (`git checkout main`) e puxe as atualizações (`git pull origin main`) antes de começar qualquer coisa nova. Certifique-se de não ter arquivos não salvos.

---

## 👥 A Regra do Trabalho Focado (Single Thread)

### **Foco Total em Uma Linha de Raciocínio**

**REGRA:** Leads e ajudantes devem trabalhar na **mesma Task** se ela for Grande.

- ❌ **PROIBIDO:** Divisão de tasks paralelas isoladas
- ✅ **PERMITIDO:** Ramificar branches para dividir peso (mas o objetivo do dia é fechar a mesma linha)

### **Quando a Sprint É Grande**

Se uma Sprint grande precisar de divisão:

- **Divida em tasks menores** no Trello
- Crie **sub-branches** para cada tarefa
- Exemplo:
  - `sprint-01-autenticacao` (main branch)
    - `sprint-01-autenticacao-task-01` (Ruan - Setup)
    - `sprint-01-autenticacao-task-02` (Jorge - JWT)
    - `sprint-01-autenticacao-task-03` (Jefferson - Validações)

### **Branches da Sprint - Padrão Obrigatório**

Sua branch **DEVE** refletir a Sprint do Trello:

```
Padrão: sprint-[numero]-[nome-curto]
Exemplos Corretos:
  ✅ sprint-01-autenticacao
  ✅ sprint-02-faturacao
  ✅ sprint-03-notificacoes-email

Padrão (com tasks): sprint-[numero]-[nome-curto]-task-[numero]
Exemplos Corretos:
  ✅ sprint-01-autenticacao-task-02
  ✅ sprint-02-faturacao-task-01

Exemplos ERRADOS (NÃO FAÇA):
  ❌ feature/autenticacao
  ❌ bugfix/ajustes
  ❌ meu-branch
  ❌ novo-codigo
```

---

## 💾 Padrão de Commits (A História do Projeto)

**SEU COMMIT CONTA A HISTÓRIA DO PROJETO.**

### ⚠️ Regra RIGOROSA

- ❌ **PROIBIDO:** Commits genéricos como "ajustes", "teste", "wip"
- ✅ **OBRIGATÓRIO:** Todo commit deve referenciar a Task

### **Formato Obrigatório**

```
Task [numero]: Descrição do que foi feito

- Detalhe 1
- Detalhe 2
- Detalhe 3
```

### **Exemplos Corretos**

```
Task 1: Criação da rota de login e integração do bcrypt

- Implementa middleware de autenticacao
- Cria DTO de login com validacoes
- Integra bcrypt para hash de senhas
- Adiciona testes unitarios
```

```
Task 3: Ajuste de espaçamento no botão primário

- Aumenta padding de 8px para 12px
- Corrige marginRight da label
- Valida com design system
```

```
Task 2: Refatoração do Service de Unidade Consumidora

- Extrai lógica de validação para método separado
- Implementa cache de consultas
- Reduz complexidade ciclomática
```

### **O Que NÃO Fazer**

```
❌ "ajustes"
❌ "teste"
❌ "wip"
❌ "fix bug"
❌ "código novo"
```

---

## 📤 Pull Requests (PR) e Revisão

**Ninguém faz commit direto na `main`.** Todo código vai via Pull Request.

### **Passo 1️⃣: Gerar o Relatório de IA**

Quando sua task está pronta:

**Gere um arquivo com as diferenças:**

```bash
git fetch origin
git diff origin/main...HEAD > alteracoes_pr.txt
```

**Copie o conteúdo do arquivo e cole na IA:**

```
Atue como um Engenheiro de Software Sênior. Abaixo estão as
alterações de código (Git Diff) que acabei de realizar.

Gere um relatório de Pull Request (PR) enxuto, profissional
e formatado em Markdown, pronto para GitHub.

O relatório deve conter:

✅ Resumo da Entrega
Uma frase clara dizendo o objetivo (qual problema foi resolvido
ou funcionalidade criada).

✅ Arquivos Alterados
Lista em bullet points com os principais arquivos e o que mudou.
Ignore arquivos gerados automaticamente (package-lock.json).

✅ Impacto e Lógica Aplicada
Explique a arquitetura utilizada. Destaque se houve:
- Instalação de novas dependências
- Mudanças no Banco de Dados
- Novas Variáveis de Ambiente (.env)

✅ Checklist para o Revisor
3 bullet points com caixas de seleção (- [ ]) com os principais
pontos que o Tech Lead deve testar.

[COLE O CONTEÚDO DO SEU ARQUIVO alteracoes_pr.txt AQUI]
```

> **💡 Dica:** Se usa GitHub Copilot, a geração automática é mais rápida e otimizada.

### **Passo 2️⃣: Abrir o Pull Request**

No GitHub:

1. Acesse **Pull Requests** → **New Pull Request**
2. **Compare:** `main` ← `sua-branch`
3. Título claro e descritivo
4. Cole o **relatório da IA** na descrição
5. Clique em **Create Pull Request**

### **Passo 3️⃣: Notificar e Aguardar Revisão**

- Notifique o **Scrum Master (Felipe)** no grupo
- Felipe realizará a revisão e o merge
- **NUNCA feche o PR por conta própria**

### **Passo 4️⃣: Se Pedir Alterações**

Se Felipe pedir mudanças:

- ✅ **NÃO feche o PR**
- ✅ Faça novos commits na mesma branch
- ✅ O PR atualizará automaticamente
- ✅ Notifique novamente quando pronto

```bash
# Fazer ajustes
# ... editar arquivos ...

# Commit dos ajustes
git add .
git commit -m "Task X: Ajustes conforme review

- Mudança 1
- Mudança 2"

# Push atualiza o PR automaticamente
git push origin sua-branch
```

---

---

## 🆘 Resolução de Conflitos (Código Vermelho)

### **SE DER CONFLITO DE MERGE: PARE IMEDIATAMENTE**

> ⚠️ **NUNCA tente resolver conflitos sozinho no "escuro".**
> Risco: Apagar código de outro desenvolvedor.

### **Ação Obrigatória**

1. **PARE** qualquer operação
2. **Notifique IMEDIATAMENTE** o Scrum Master (Felipe)
3. **AGUARDE** orientação dele
4. Felipe irá:
   - Orientar a resolução, OU
   - Assumir a verificação linha por linha
   - Completar o merge com segurança

````bash
# Se entrou em conflito por acidente:
git merge --abort      # Desfaz o merge
# Ou
git rebase --abort     # Desfaz o rebase

```bash
# Se entrou em conflito por acidente:
git merge --abort      # Desfaz o merge
# Ou
git rebase --abort     # Desfaz o rebase

# AVISE FELIPE IMEDIATAMENTE
````

---

## 📚 Tutorial: Migração de Código (Sprint 1)

**Responsabilidade:** Apenas os Leads (Ruan no Backend, Vitor no Frontend)

Os demais membros da equipe **SÓ CLONARO** após o Passo 3.

### **Passo 1: Subir o Código Legado (Apenas o Lead)**

O código legado é a "estaca zero" e vai direto para `main` (SEM PR).

```bash
# 1. No GitHub: Crie o repositório novo
# (pode marcar "Add a README file")

# 2. No seu computador:
git clone [url-do-novo-repo]
cd [nome-do-repo]

# 3. Copie TODOS os arquivos do projeto antigo
# (EXCETO a pasta .git oculta e node_modules)
# para dentro desta nova pasta

# 4. CERTIFIQUE-SE que .gitignore está lá:
# - Deve ignorar node_modules
# - Deve ignorar .env
# - Deve ignorar arquivos sensíveis

# 5. Envie para main (DIRETO, SEM PR):
git add .
git commit -m "Task 1: Setup inicial com código legado"
git push origin main
```

### **Passo 2: Branch de Refatoração (Apenas o Lead)**

Com o legado em `main`, crie o ambiente isolado para limpeza.

```bash
# 1. Crie a branch a partir de main
git checkout main
git pull origin main
git checkout -b sprint-01-refatoracao

# 2. Realize a limpeza:
# - Remova bibliotecas em desuso
# - Reestruture pastas
# - Exclua arquivos mortos
# - Organize as dependências

# 3. Salve as mudanças:
git add .
git commit -m "Task 3: Limpeza e reestruturação da base

- Remove bibliotecas em desuso
- Reorganiza estrutura de pastas
- Exclui arquivos temporários e duplicados
- Atualiza dependências obsoletas"

git push origin sprint-01-refatoracao
```

### **Passo 3: Pull Request e Liberação (Apenas o Lead)**

Com a estrutura limpa, oficialize a fundação na `main`.

```bash
# 1. No GitHub: Abra PR de sprint-01-refatoracao → main
# 2. Anexe o relatório da IA na descrição
# 3. Detalhe:
#    - O que foi mantido
#    - O que foi removido
#    - Por que cada decisão
# 4. Notifique Felipe (Scrum Master)
# 5. Felipe aprova e faz o merge
```

### **Passo 4: Liberação para a Equipe**

Somente APÓS a `main` estar limpa e oficial:

```bash
# O restante da equipe (Jorge, Jefferson, etc) pode clonar:
git clone [url-do-novo-repositorio]
cd [nome-do-repositorio]

# E começar as próximas tarefas a partir de sprint-01-refatoracao
```

---

## 🔧 Desenvolvendo Localmente

### **Subir o Ambiente**

```bash
# 1. Instalar dependências (primeira vez)
npm install

# 2. Subir ambiente com Docker
docker compose up -d --build

# 3. Rodar migrations (se houver)
docker exec -it api_solar npm run migration:run

# 4. Ver logs em tempo real
docker logs -f api_solar
```

### **Durante o Desenvolvimento**

```bash
# Ver mudanças
git status
git diff

# Stage files
git add .

# Commit com referência à task
git commit -m "Task X: Descrição clara

- Detalhe 1
- Detalhe 2"

# Push para a nuvem
git push origin sua-branch
```

### **Testes e Validação**

```bash
# Executar testes (se configurado)
npm test

# Lint/Formato
npm run lint

# Build
npm run build
```

---

## 📊 Resumo do Workflow Completo

```
┌─────────────────────────────────────────────────┐
│ 1. SINCRONIZAR COM MAIN (após fechamento sprint) │
├─────────────────────────────────────────────────┤
│ $ git checkout main                              │
│ $ git pull origin main                           │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│ 2. CRIAR BRANCH (com nome padrão)               │
├─────────────────────────────────────────────────┤
│ $ git checkout -b sprint-01-autenticacao        │
│ (ou sprint-01-autenticacao-task-02)             │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│ 3. DESENVOLVER E FAZER COMMITS                  │
├─────────────────────────────────────────────────┤
│ $ git add .                                     │
│ $ git commit -m "Task X: Descrição             │
│   - Detalhe 1                                  │
│   - Detalhe 2"                                 │
│ $ git push origin sua-branch                    │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│ 4. GERAR RELATÓRIO IA & ABRIR PR               │
├─────────────────────────────────────────────────┤
│ $ git diff origin/main...HEAD > alteracoes.txt  │
│ (Copie conteúdo para IA, gere relatório)       │
│ (Abra PR no GitHub com relatório anexado)      │
│ (Notifique Felipe para revisar)                 │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│ 5. REVISÃO E AJUSTES (se necessário)            │
├─────────────────────────────────────────────────┤
│ (Se Felipe pedir mudanças:)                     │
│ $ git add .                                     │
│ $ git commit -m "Task X: Ajustes conforme..."   │
│ $ git push origin sua-branch (PR atualiza auto)│
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│ 6. MERGE NA MAIN (pelo Scrum Master)            │
├─────────────────────────────────────────────────┤
│ (Felipe faz o merge no GitHub)                  │
│ (Sua branch é deletada remotamente)             │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│ 7. SINCRONIZAR LOCAL (próxima task)             │
├─────────────────────────────────────────────────┤
│ $ git checkout main                              │
│ $ git pull origin main                           │
│ $ git branch -d sua-branch (local)               │
└─────────────────────────────────────────────────┘
```

---

## 🎯 Checklist de Boas Práticas

### ✅ **FAÇA SEMPRE:**

- [ ] Sincronize com `main` antes de criar nova branch
- [ ] Use o padrão de nome exato: `sprint-XX-nome` ou `sprint-XX-nome-task-XX`
- [ ] Faça commits com referência à Task
- [ ] Gere relatório da IA antes de abrir PR
- [ ] Abra PR apontando para `main`
- [ ] Notifique Felipe (Scrum Master) após abrir PR
- [ ] Não feche PR se pedir alterações, faça novos commits
- [ ] Aguarde sincronização pós-sprint antes de nova branch
- [ ] Documente mudanças e decisões técnicas

### ❌ **NUNCA FAÇA:**

- [ ] Commit direto em `main`
- [ ] Branches com nomes genéricos (`teste`, `novo`, `feature`)
- [ ] Commits sem referência à Task
- [ ] Abrir PR sem relatório da IA
- [ ] Resolver conflitos sozinho
- [ ] Push force em `main`
- [ ] Deixar PRs abertas e abandonadas
- [ ] Iniciar código novo durante Code Freeze
- [ ] Pular sincronização pós-sprint

---

## 🆘 Troubleshooting Rápido

### **Conflito de Merge**

```bash
git status              # Ver conflitos
# AVISE FELIPE IMEDIATAMENTE
```

### **Branch Desatualizada**

```bash
git fetch origin
git rebase origin/main
```

### **Desfazer Último Commit (local)**

```bash
git reset --soft HEAD~1    # Mantém mudanças
git reset --hard HEAD~1    # Descarta mudanças
```

### **Ver Histórico**

```bash
git log --oneline -10           # Últimos 10
git log --graph --all --oneline # Visualizar estrutura
```

---

## 📞 Contatos de Emergência

- **Scrum Master (Merge/Conflitos):** Felipe
- **Lead Backend (Dúvidas técnicas):** Ruan
- **Lead Frontend App (Dúvidas técnicas):** Vitor

---

## 📌 Lembre-se

> **Este é o guia definitivo.** Todos os desenvolvedores devem seguir RIGOROSAMENTE. A disciplina no Git é o que diferencia um MVP entregue do caos de código.
>
> **Quando em dúvida, PERGUNTE ao Scrum Master ou ao Lead da sua area antes de agir.**
