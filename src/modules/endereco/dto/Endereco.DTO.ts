import { z } from "zod";

export const EnderecoSchema = z.object({
  cep: z
    .string()
    .transform((v) => v.replace(/\D/g, "")) // Remove o hífen "-" automaticamente
    .refine((v) => v.length === 8, "O CEP deve ter 8 dígitos"),

  numero: z.string().min(1, "O número é obrigatório"),

  rua: z.string().min(3, "A rua deve ser informada"),

  bairro: z.string().min(2, "O bairro deve ser informado"),

  cidade: z.string().min(2, "A cidade deve ser informada"),

  complemento: z.string().optional(),

  // Garante que o ID do usuário que vincularemos existe e está no formato correto
  usuario_id: z.string().uuid("ID de usuário inválido"),
});

// Substitua sua interface manual por esta:
export type EnderecoDTO = z.infer<typeof EnderecoSchema>;
