import { Repository } from "typeorm";
import { RefreshToken } from "../schema/RefreshToken.schema";
import * as crypto from "crypto";
import { IAuthRepository } from "../interfaces/IAuthRepository";

export function hashRefreshToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export class AuthRepository implements IAuthRepository {
  constructor(private repository: Repository<RefreshToken>) {}

  async create(userId: string, expiresInDays: number): Promise<{ refreshToken: RefreshToken; token: string }> {
    const tokenValue = crypto.randomBytes(64).toString("hex");
    const tokenHash = hashRefreshToken(tokenValue);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    const refreshToken = this.repository.create({
      user: { id: userId },
      token: tokenHash,
      expiresAt,
      revoked: false,
    });

    return {
      refreshToken: await this.repository.save(refreshToken),
      token: tokenValue,
    };
  }

  async findByToken(tokenHash: string): Promise<RefreshToken | null> {
    return await this.repository.findOne({
      where: { token: tokenHash, revoked: false },
      relations: ["user"],
    });
  }

  async revokeByUserId(userId: string): Promise<void> {
    await this.repository.update(
      { user: { id: userId }, revoked: false },
      { revoked: true },
    );
  }

  async revoke(tokenHash: string): Promise<void> {
    await this.repository.delete({ token: tokenHash });
  }
}
