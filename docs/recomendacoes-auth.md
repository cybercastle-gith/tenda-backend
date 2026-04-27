# 📋 Recomendações de Melhoria - Módulo Auth

## ✅ Pontos Positivos

- Estrutura bem organizada com camadas (Controller → Service → Repository)
- Validação de senhas com bcrypt (salt 12)
- JWT com access token e refresh token separados
- DTOs com Zod para validação
- Tratamento de erros com classes customizadas
- Profiles separados para Admin e Cliente

---

## 🔴 Problemas Críticos

### 1. **Falta Proteção nas Rotas (SEGURANÇA)**

- ❌ `POST /logout` deveria exigir autenticação (Bearer Token)
- ❌ `POST /refresh` deveria validar o Bearer Token junto com o refresh_token
- ✅ **Solução**: Aplicar middleware `ensureAuthenticated` nas rotas

```typescript
authRoutes.post(
  "/logout",
  ensureAuthenticated,
  authController.logout.bind(authController),
);
```

### 2. **Refresh Token Sem Validação DTO**

- ❌ O body do `/refresh` não tem DTO/schema de validação
- ✅ **Solução**: Criar `RefreshTokenDTO.ts` com Zod

```typescript
export const refreshTokenSchema = z.object({
  refresh_token: z.string().min(1, "Refresh token é obrigatório"),
});

export type RefreshToken = z.infer<typeof refreshTokenSchema>;
```

### 3. **Logout Sem Proteger Token Revogado**

- ❌ Qualquer pessoa pode fazer logout de outro usuário passando um refresh_token válido
- ✅ **Solução**: Validar que o token pertence ao usuário autenticado

```typescript
logout = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id; // Do JWT
  const { refresh_token } = req.body;

  // Validar que o token pertence ao usuário
  const tokenRecord = await this.authService.verifyTokenOwnership(
    userId,
    refresh_token,
  );

  await this.authService.revoke(refresh_token);
  res.status(204).send();
});
```

---

## 🟡 Melhorias Recomendadas

### 4. **Adicionar Rota GET /me (Perfil do Usuário)**

- Usuário autenticado pode consultar seus dados
- ✅ Implementar em `AuthController`:

```typescript
me = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const user = await this.userService.getUserById(userId);

  res.status(200).json({
    status: "success",
    data: user,
  });
});

// Route
authRoutes.get(
  "/me",
  ensureAuthenticated,
  authController.me.bind(authController),
);
```

### 5. **Melhorar Resposta do Login**

- ✅ Adicionar `expires_in` (segundos) dos tokens nas respostas

```typescript
return {
  user: { ... },
  access_token: accessToken,
  access_token_expires_in: 900, // 15 minutos em segundos
  refresh_token: refreshToken.token,
  refresh_token_expires_in: 604800, // 7 dias em segundos
};
```

### 6. **Adicionar Rota DELETE /logout/:tokenId (Logout Remoto)**

- Admin pode revogar sessões de qualquer usuário
- Requer role "admin"

### 7. **Padronizar Errors com Detalhes**

- Sempre retornar com estrutura: `{ status: "error", message: "...", code: "..." }`

```typescript
// Hoje:
{ status: "error", message: "Refresh token é obrigatório" }

// Proposto:
{
  status: "error",
  message: "Refresh token é obrigatório",
  code: "MISSING_REFRESH_TOKEN",
  timestamp: "2026-04-27T10:30:00Z"
}
```

---

## 🔧 Implementação Prioritária

| Prioridade | Tarefa                                      | Impacto               |
| ---------- | ------------------------------------------- | --------------------- |
| 🔴 ALTA    | Proteger `/logout` com JWT                  | CRÍTICO - Segurança   |
| 🔴 ALTA    | Validar pertencimento de token em `/logout` | CRÍTICO - Segurança   |
| 🟡 MÉDIA   | Criar RefreshTokenDTO                       | Validação de input    |
| 🟡 MÉDIA   | Adicionar rota `GET /me`                    | UX/Funcionalidade     |
| 🟢 BAIXA   | Adicionar `expires_in` nas respostas        | Melhor UX no frontend |
| 🟢 BAIXA   | Padronizar códigos de erro                  | Melhor debugging      |

---

## 📝 Checklist para Revisão

- [ ] AuthController protegido com ensureAuthenticated
- [ ] RefreshTokenDTO criado e validado
- [ ] Logout valida pertencimento do token
- [ ] Rota GET /me implementada
- [ ] Respostas com expires_in
- [ ] Testes de segurança de logout
- [ ] Swagger atualizado com todas as rotas e segurança
