import { NextFunction, Request, Response } from "express";
import { authRepository } from "../container";

export async function validateRefreshTokenOwnership(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userIdToken = req.user.id;
  const { refresh_token } = req.body;

  if (!refresh_token) {
    return res.status(400).json({
      status: "error",
      message: "Refresh token é obrigatório",
    });
  }

  const tokenRecord = await authRepository.findByToken(refresh_token);

  console.log("Cade essa merda", tokenRecord);

  console.log("User id:", userIdToken);

  if (!tokenRecord) {
    return res.status(401).json({
      status: "error",
      message: "Refresh token inválido ou expirado",
    });
  }

  if (tokenRecord?.user.id !== userIdToken) {
    return res.status(403).json({
      status: "error",
      message: "Você não pode usar tokens de outros usuários",
    });
  }

  req.refreshTokenRecord = tokenRecord;

  next();
}
