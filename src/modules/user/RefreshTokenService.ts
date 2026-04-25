import { getRepository } from 'typeorm';
import jwt, { sign } from 'jsonwebtoken';
import crypto from 'crypto';
import { RefreshToken } from './entities/RefreshToken';
import { User } from './entities/User';
import { AppError } from '../../shared/errors/AppError';

export class RefreshTokenService {
  async execute(oldRefreshToken: string) {
    const refreshTokenRepo = getRepository(RefreshToken);
    const tokenRecord = await refreshTokenRepo.findOne({
      where: { token: oldRefreshToken, revoked: false },
      relations: ['user'],
    });

    if (!tokenRecord) {
      throw new AppError('Refresh token inválido', 401);
    }

    if (tokenRecord.expiresAt < new Date()) {
      tokenRecord.revoked = true;
      await refreshTokenRepo.save(tokenRecord);
      throw new AppError('Refresh token expirado, faça login novamente', 401);
    }

    const user = tokenRecord.user;
    const secret = process.env.JWT_SECRET as string;
    const accessExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
    const options = { expiresIn: accessExpiresIn } as unknown as jwt.SignOptions;
    const newAccessToken = sign(
      { id: user.id, email: user.email, role: user.role },
      secret as unknown as jwt.Secret,
      options,
    );

    const newTokenValue = crypto.randomBytes(64).toString('hex');
    const expiresInDays = process.env.JWT_REFRESH_EXPIRES_IN_DAYS || 7;
    const newExpiresAt = new Date();
    newExpiresAt.setDate(newExpiresAt.getDate() + Number(expiresInDays));

    const newRefreshToken = refreshTokenRepo.create({
      userId: user.id,
      token: newTokenValue,
      expiresAt: newExpiresAt,
      revoked: false,
    });

    tokenRecord.revoked = true;
    await refreshTokenRepo.save(tokenRecord);
    await refreshTokenRepo.save(newRefreshToken);

    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken.token,
    };
  }

  async revoke(refreshToken: string) {
    const refreshTokenRepo = getRepository(RefreshToken);
    const tokenRecord = await refreshTokenRepo.findOne({ where: { token: refreshToken } });
    if (tokenRecord) {
      tokenRecord.revoked = true;
      await refreshTokenRepo.save(tokenRecord);
    }
  }
}
