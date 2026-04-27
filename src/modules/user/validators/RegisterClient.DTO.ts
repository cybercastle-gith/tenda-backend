import z from "zod";

export const registerClientSchema = z.object({
  email: z.email(),
  password: z.string(),
  full_name: z.string(),
  cpf: z.string(),
  phone: z.string(),
});

export type RegisterClient = z.infer<typeof registerClientSchema>;
