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
        - Validação de Esquema com Zod.
        - Proteção contra Mass Assignment (campo 'papel' restrito).
        - Autenticação via JWT Bearer Token.
        - Vínculo automático de registros ao usuário autenticado.
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
          description: "Insira o token JWT retornado no login.",
        },
      },
      schemas: {
        // --- USUÁRIO ---

        // Entrada para Cadastro (Seguro: sem 'papel')
        CriarUsuario: {
          type: "object",
          required: ["nome", "email", "telefone", "senha", "cpf"],
          properties: {
            nome: { type: "string", example: "Ruan Silva Oliveira" },
            email: {
              type: "string",
              format: "email",
              example: "ruan.silva@provedor.com.br",
            },
            telefone: { type: "string", example: "67992999998" },
            senha: { type: "string", format: "password", example: "Senha@123" },
            cpf: { type: "string", example: "45730310023" }, // CPF Válido para passar no Zod
          },
        },

        // Resposta de Cadastro (Conforme seu RespostaCadastroDTO)
        RespostaCadastro: {
          type: "object",
          properties: {
            token: { type: "string", example: "eyJhbGciOiJIUzI1..." },
            usuario: {
              type: "object",
              properties: {
                id: { type: "string", format: "uuid" },
                nome: { type: "string" },
              },
            },
          },
        },

        // Entrada para Login
        Login: {
          type: "object",
          required: ["email", "senha"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "ruan.silva@provedor.com.br",
            },
            senha: { type: "string", example: "Senha@123" },
          },
        },

        // Resposta de Login (Retorna papel para o Front-end gerenciar permissões)
        RespostaLogin: {
          type: "object",
          properties: {
            token: { type: "string" },
            papel: { type: "string", example: "USUARIO" },
          },
        },

        // --- ENDEREÇO ---

        // Entrada para Endereço (usuario_id NÃO é enviado no body, é pego pelo Token)
        CriarEndereco: {
          type: "object",
          required: ["cep", "numero", "rua", "bairro", "cidade"],
          properties: {
            cep: { type: "string", example: "79002010" },
            rua: { type: "string", example: "Avenida Afonso Pena" },
            numero: { type: "string", example: "1234" },
            bairro: { type: "string", example: "Centro" },
            cidade: { type: "string", example: "Campo Grande" },
            complemento: { type: "string", example: "Bloco B, Apt 201" },
          },
        },

        Endereco: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            cep: { type: "string" },
            rua: { type: "string" },
            numero: { type: "string" },
            bairro: { type: "string" },
            cidade: { type: "string" },
            usuario_id: { type: "string", format: "uuid" },
          },
        },

        // --- GERAL ---
        Erro: {
          type: "object",
          properties: {
            mensagem: { type: "string", example: "CPF inválido" },
            erros: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  code: { type: "string" },
                  message: { type: "string" },
                  path: { type: "array", items: { type: "string" } },
                },
              },
            },
          },
        },
      },
    },
    paths: {
      // Rotas de Usuário
      "/": {
        get: {
          tags: ["Sistema"],
          summary: "Um aviso amigável (ou não)",
          description: "Retorna o estilo de fala de uma adolescente chata.",
          responses: {
            "200": {
              description: "Mensagem recebida com sucesso",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: `oiiiiii, tiuru poom????, seu ip é ::1 e o método da requisição é GET`,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },

      "/usuarios/cadastrar": {
        post: {
          tags: ["Usuários"],
          summary: "Registrar novo usuário",
          description:
            "O papel (role) será definido como 'USUARIO' por padrão por segurança.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CriarUsuario" },
              },
            },
          },
          responses: {
            "201": {
              description: "Criado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/RespostaCadastro" },
                },
              },
            },
            "400": {
              description: "Erro de validação",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Erro" },
                },
              },
            },
          },
        },
      },
      "/usuarios/login": {
        post: {
          tags: ["Usuários"],
          summary: "Autenticação",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Login" },
              },
            },
          },
          responses: {
            "200": {
              description: "Sucesso",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/RespostaLogin" },
                },
              },
            },
            "401": { description: "Credenciais inválidas" },
          },
        },
      },

      // Rotas de Endereço
      "/endereco/cadastrar": {
        post: {
          tags: ["Endereços"],
          summary: "Vincular endereço ao usuário",
          description:
            "Requer Token JWT. O ID do usuário é extraído automaticamente do token.",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CriarEndereco" },
              },
            },
          },
          responses: {
            "201": {
              description: "Endereço cadastrado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Endereco" },
                },
              },
            },
            "400": {
              description: "Erro nos dados",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Erro" },
                },
              },
            },
            "401": { description: "Não autorizado" },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
