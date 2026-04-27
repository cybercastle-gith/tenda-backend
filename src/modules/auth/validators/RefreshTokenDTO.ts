import z from "zod";

export const refreshTokenSchema = z.object({
  refresh_token: z.string(),
});

export type RefreshToken = z.infer<typeof refreshTokenSchema>;
