import swaggerJsdoc, { Options } from "swagger-jsdoc";

const options: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Tenda Solar API",
      version: "1.0.0",
      description: `
        Documentação da API Tenda Solar.
        
        **Segurança implementada:**
        - Validação de input obrigatória com Zod.
        - Hash de senhas com bcrypt (salt 12).
        - Autenticação via JWT Bearer Token.
        - Refresh Token com expiração.
        - Profiles separados para Admin e Cliente.
        - Middleware de autenticação e tratamento de erros.
      `,
    },
    servers: [
      {
        url: process.env.API_URL || "http://localhost:3000",
        description: "Servidor de Desenvolvimento",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "Insira o token JWT retornado no login. Formato: Bearer <token>",
        },
      },
      schemas: {
        // --- LOGIN / AUTENTICAÇÃO ---

        // Request: Login
        LoginDTO: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "usuario@example.com",
            },
            password: {
              type: "string",
              format: "password",
              minLength: 8,
              example: "SenhaForte123",
            },
          },
        },

        // Request: Refresh Token
        RefreshTokenDTO: {
          type: "object",
          required: ["refresh_token"],
          properties: {
            refresh_token: {
              type: "string",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            },
          },
        },

        // Response: User Info (usado em LoginResponse)
        UserInfo: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              example: "550e8400-e29b-41d4-a716-446655440000",
            },
            email: {
              type: "string",
              format: "email",
              example: "usuario@example.com",
            },
            role: {
              type: "string",
              enum: ["admin", "client"],
              example: "client",
            },
            full_name: {
              type: "string",
              example: "João da Silva",
            },
          },
        },

        // Response: Login
        LoginResponse: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "success",
            },
            data: {
              type: "object",
              properties: {
                user: {
                  $ref: "#/components/schemas/UserInfo",
                },
                access_token: {
                  type: "string",
                  example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                  description: "Token de acesso. Válido por 15 minutos.",
                },
                refresh_token: {
                  type: "string",
                  example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                  description: "Token para renovar sessão. Válido por 7 dias.",
                },
              },
            },
          },
        },

        // Response: Refresh
        RefreshResponse: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "success",
            },
            data: {
              type: "object",
              properties: {
                access_token: {
                  type: "string",
                  example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                },
                refresh_token: {
                  type: "string",
                  example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                },
              },
            },
          },
        },

        // --- USUÁRIO / REGISTRO ---

        // Request: Cadastro de Cliente
        RegisterClientDTO: {
          type: "object",
          required: ["email", "password", "full_name", "cpf", "phone"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "cliente@example.com",
            },
            password: {
              type: "string",
              format: "password",
              minLength: 8,
              description: "Mínimo 8 caracteres. Será feito hash com bcrypt.",
              example: "SenhaForte123",
            },
            full_name: {
              type: "string",
              example: "João da Silva",
            },
            cpf: {
              type: "string",
              pattern: "^\\d{11}$",
              description: "CPF sem máscara (11 dígitos)",
              example: "12345678901",
            },
            phone: {
              type: "string",
              example: "67992999998",
            },
          },
        },

        // Request: Cadastro de Admin
        RegisterAdminDTO: {
          type: "object",
          required: ["email", "password", "full_name", "department"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "admin@example.com",
            },
            password: {
              type: "string",
              format: "password",
              minLength: 8,
              example: "SenhaForte123",
            },
            full_name: {
              type: "string",
              example: "Administrador",
            },
            department: {
              type: "string",
              description: "Departamento do admin",
              example: "Financeiro",
            },
          },
        },

        // Request: Atualizar Cliente
        UpdateClientDTO: {
          type: "object",
          properties: {
            full_name: {
              type: "string",
              minLength: 3,
              example: "João Silva Atualizado",
            },
            phone: {
              type: "string",
              minLength: 10,
              example: "67992999998",
            },
          },
        },

        // Request: Atualizar Admin
        UpdateAdminDTO: {
          type: "object",
          properties: {
            full_name: {
              type: "string",
              minLength: 3,
              example: "Admin Atualizado",
            },
            department: {
              type: "string",
              example: "Financeiro",
            },
          },
        },

        // Response: Register (genérico)
        RegisterResponse: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "success",
            },
            data: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  format: "uuid",
                },
                email: {
                  type: "string",
                  format: "email",
                },
                role: {
                  type: "string",
                  enum: ["admin", "client"],
                },
                full_name: {
                  type: "string",
                },
                createdAt: {
                  type: "string",
                  format: "date-time",
                },
              },
            },
          },
        },

        // Response: User Completo (com profile)
        UserDetailResponse: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "success",
            },
            data: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  format: "uuid",
                },
                email: {
                  type: "string",
                  format: "email",
                },
                role: {
                  type: "string",
                  enum: ["admin", "client"],
                },
                adminProfile: {
                  $ref: "#/components/schemas/AdminProfile",
                  description: "Presente se o usuário for admin",
                },
                clientProfile: {
                  $ref: "#/components/schemas/ClientProfile",
                  description: "Presente se o usuário for cliente",
                },
                created_at: {
                  type: "string",
                  format: "date-time",
                },
                updated_at: {
                  type: "string",
                  format: "date-time",
                },
              },
            },
          },
        },

        // Response: Update Success

        // --- PROFILES ---

        // Profile de Cliente
        ClientProfile: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            full_name: {
              type: "string",
            },
            cpf: {
              type: "string",
            },
            phone: {
              type: "string",
            },
            created_at: {
              type: "string",
              format: "date-time",
            },
            updated_at: {
              type: "string",
              format: "date-time",
            },
          },
        },

        // Profile de Admin
        AdminProfile: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            full_name: {
              type: "string",
            },
            department: {
              type: "string",
            },
            created_at: {
              type: "string",
              format: "date-time",
            },
            updated_at: {
              type: "string",
              format: "date-time",
            },
          },
        },

        // --- ERROS ---

        // Erro Geral
        ErrorResponse: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "error",
            },
            message: {
              type: "string",
              example: "Erro ao processar requisição",
            },
          },
        },

        // Erro de Validação
        ValidationErrorResponse: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "error",
            },
            message: {
              type: "string",
              example: "Erro de validação",
            },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: {
                    type: "string",
                    example: "email",
                  },
                  message: {
                    type: "string",
                    example: "Email inválido",
                  },
                },
              },
            },
          },
        },
      },
    },
    paths: {
      // ========== AUTENTICAÇÃO ==========

      "/api/v1/auth/login": {
        post: {
          tags: ["Autenticação"],
          summary: "Login do usuário",
          description:
            "Autentica um usuário e retorna access_token e refresh_token.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/LoginDTO",
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Login realizado com sucesso",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/LoginResponse",
                  },
                },
              },
            },
            "400": {
              description: "Email ou senha inválidos",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                  },
                },
              },
            },
            "422": {
              description: "Erro de validação",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ValidationErrorResponse",
                  },
                },
              },
            },
          },
        },
      },

      "/api/v1/auth/refresh": {
        post: {
          tags: ["Autenticação"],
          summary: "Renovar token de acesso",
          description: "Renova o access_token usando um refresh_token válido.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/RefreshTokenDTO",
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Token renovado com sucesso",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/RefreshResponse",
                  },
                },
              },
            },
            "400": {
              description: "Refresh token inválido ou expirado",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                  },
                },
              },
            },
            "401": {
              description: "Refresh token expirado",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                  },
                },
              },
            },
          },
        },
      },

      "/api/v1/auth/logout": {
        post: {
          tags: ["Autenticação"],
          summary: "Logout do usuário",
          description:
            "Revoga o refresh_token do usuário, encerrando sua sessão.",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/RefreshTokenDTO",
                },
              },
            },
          },
          responses: {
            "204": {
              description: "Logout realizado com sucesso",
            },
            "400": {
              description: "Erro ao fazer logout",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                  },
                },
              },
            },
            "401": {
              description: "Não autorizado",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                  },
                },
              },
            },
          },
        },
      },

      // ========== USUÁRIOS ==========

      "/api/v1/users": {
        post: {
          tags: ["Usuários"],
          summary: "Registrar novo cliente",
          description:
            "Cria um novo usuário com role 'client' e seu respectivo ClientProfile.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/RegisterClientDTO",
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Cliente registrado com sucesso",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/RegisterResponse",
                  },
                },
              },
            },
            "400": {
              description: "Erro de validação ou email já existe",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                  },
                },
              },
            },
            "422": {
              description: "Erro de validação dos dados",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ValidationErrorResponse",
                  },
                },
              },
            },
          },
        },
      },

      "/api/v1/users/admin": {
        post: {
          tags: ["Usuários"],
          summary: "Registrar novo administrador",
          description:
            "Cria um novo usuário com role 'admin' e seu respectivo AdminProfile. Requer autenticação de admin.",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/RegisterAdminDTO",
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Admin registrado com sucesso",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/RegisterResponse",
                  },
                },
              },
            },
            "400": {
              description: "Erro de validação ou email já existe",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                  },
                },
              },
            },
            "401": {
              description: "Não autorizado - requer autenticação de admin",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                  },
                },
              },
            },
            "422": {
              description: "Erro de validação dos dados",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ValidationErrorResponse",
                  },
                },
              },
            },
          },
        },
      },

      "/api/v1/users/me": {
        get: {
          tags: ["Usuários"],
          summary: "Obter dados do usuário autenticado",
          description:
            "Retorna os dados completos do usuário logado, incluindo seu profile (admin ou client).",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": {
              description: "Dados do usuário recuperados com sucesso",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/UserDetailResponse",
                  },
                },
              },
            },
            "401": {
              description: "Não autorizado - token inválido ou expirado",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                  },
                },
              },
            },
          },
        },
      },

      "/api/v1/users/edit": {
        patch: {
          tags: ["Usuários"],
          summary: "Atualizar dados do usuário",
          description:
            "Atualiza os dados do perfil do usuário autenticado. Os campos disponíveis variam conforme o role (admin ou client).",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  oneOf: [
                    {
                      $ref: "#/components/schemas/UpdateClientDTO",
                    },
                    {
                      $ref: "#/components/schemas/UpdateAdminDTO",
                    },
                  ],
                  discriminator: {
                    propertyName: "role",
                    description: "O schema depende do role do usuário",
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Usuário atualizado com sucesso",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/UserDetailResponse",
                  },
                },
              },
            },
            "400": {
              description: "Erro de validação",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                  },
                },
              },
            },
            "401": {
              description: "Não autorizado - token inválido ou expirado",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                  },
                },
              },
            },
            "422": {
              description: "Erro de validação dos dados",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ValidationErrorResponse",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
