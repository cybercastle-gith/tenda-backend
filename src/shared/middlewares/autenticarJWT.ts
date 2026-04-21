// src/middlewares/autenticarJWT.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../../../config";

export interface JwtPayload {
  id: string;
  email: string;
  papel: "ADMIN" | "CLIENTE";
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export function autenticarJWT(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ mensagem: "Token não fornecido." });
    return;
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
    res.status(401).json({ mensagem: "Token mal formatado." });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.secret, {
      algorithms: ["HS256"],
    }) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ mensagem: "Token inválido ou expirado." });
  }
}
