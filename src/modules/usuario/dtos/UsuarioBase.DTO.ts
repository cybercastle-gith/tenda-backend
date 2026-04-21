import { z } from "zod";
import { cpf } from "cpf-cnpj-validator";

export const UsuarioSchema = z.object({
  nome: z.string().min(3, "Nome muito curto"),
  papel: z.enum(["ADMIN", "ADMINUSINA", "USUARIO"], {
    message: "Papel deve ser 'ADMIN', 'ADMINUSINA' ou 'USUARIO'",
  }),
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
  telefone: z.string().min(10, "Telefone inválido"),
  cpf: z
    .string()
    .transform((val) => val.replace(/\D/g, "")) // Limpa pontos/traços
    .refine((val) => cpf.isValid(val), "CPF inválido"),
});

export type UsuarioBaseDTO = z.infer<typeof UsuarioSchema>;
