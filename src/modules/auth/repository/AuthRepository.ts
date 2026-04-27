import { Repository } from "typeorm";
import { RefreshToken } from "../schema/RefreshToken.schema";
import crypto from "crypto";
import { IAuthRepository } from "../interfaces/IAuthRepository";

export class AuthRepository implements IAuthRepository {
  constructor(private repository: Repository<RefreshToken>) {}

  async create(userId: string, expiresInDays: number): Promise<RefreshToken> {
    await this.revokeByUserId(userId);

    const tokenValue = crypto.randomBytes(64).toString("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    const refreshToken = this.repository.create({
      user: { id: userId },
      token: tokenValue,
      expiresAt,
      revoked: false,
    });

    return await this.repository.save(refreshToken);
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    return await this.repository.findOne({
      where: { token, revoked: false },
      relations: ["user"],
    });
  }

  async revokeByUserId(userId: string): Promise<void> {
    await this.repository.update(
      { user: { id: userId }, revoked: false },
      { revoked: true },
    );
  }

  async revoke(token: string): Promise<void> {
    const tokenRecord = await this.repository.findOne({ where: { token } });
    if (tokenRecord) {
      tokenRecord.revoked = true;
      await this.repository.save(tokenRecord);
    }
  }
}
