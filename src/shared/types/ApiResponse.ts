/**
 * Tipo genérico para padronizar todas as respostas da API
 */
export type ApiResponse<T = any> = {
  status: "success" | "error";
  data?: T;
  message?: string;
};

/**
 * Resposta padrão para operações de criação/registro
 */
export type RegisterResponse = {
  id: string;
  email: string;
  role: "admin" | "client";
  full_name: string;
  createdAt: Date;
};

/**
 * Resposta padrão para login
 */
export type LoginResponse = {
  user: {
    id: string;
    email: string;
    role: "admin" | "client";
    full_name: string;
  };
  access_token: string;
  refresh_token: string;
};
