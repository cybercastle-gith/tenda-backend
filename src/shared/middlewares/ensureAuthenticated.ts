import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import authConfig from "../config/auth";

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    response.status(401).json({ message: "Token não enviado." });
    return;
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2) {
    response.status(401).json({ message: "Token malformatado." });
    return;
  }

  // AQUI A SOLUÇÃO: Forçamos o TS a entender que o array está cheio
  const [scheme, token] = parts as [string, string];

  if (!/^Bearer$/i.test(scheme)) {
    response
      .status(401)
      .json({ message: "Token deve seguir o padrão Bearer." });
    return;
  }

  const { secret } = authConfig.jwt;

  if (!secret) {
    response.status(500).json({ message: "JWT Secret não configurado." });
    return;
  }

  try {
    // Usamos o '!' no token e no secret para garantir que são strings
    const decoded = verify(token!, secret!);

    const { sub } = decoded as ITokenPayload;

    request.user = {
      id: sub,
    };

    return next();
  } catch (err) {
    response.status(401).json({ message: "Token inválido ou expirado." });
    return;
  }
}
