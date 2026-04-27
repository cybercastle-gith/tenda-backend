import { Request, Response, NextFunction } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import authConfig from "../config/auth";

interface ITokenPayload extends JwtPayload {
  iat: number;
  exp: number;
  id: string;
  email: string;
  role: string;
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

  console.log("🔐 Verificando token...");
  console.log("Secret configurada:", secret.substring(0, 10) + "...");

  try {
    // Usamos o '!' no token e no secret para garantir que são strings
    const decoded = verify(token!, secret!) as ITokenPayload;

    const { id } = decoded;

    if (!id) {
      console.error("❌ ID não encontrado no token!");
      response
        .status(401)
        .json({ message: "Token inválido: sem identificador." });
      return;
    }

    request.user = { id };

    console.log("User definido:\n", request.user);

    return next();
  } catch (err) {
    console.error(
      "❌ Erro ao verificar token:",
      err instanceof Error ? err.message : err,
    );
    response.status(401).json({ message: "Token inválido ou expirado." });
    return;
  }
}
