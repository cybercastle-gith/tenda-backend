import z from "zod";

export const registerAdminSchema = z.object({
  email: z.email(),
  password: z.string(),
  full_name: z.string(),
  department: z.string(),
});

export type RegisterAdmin = z.infer<typeof registerAdminSchema>;
