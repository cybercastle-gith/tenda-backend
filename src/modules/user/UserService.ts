import bcrypt from 'bcrypt';
import jwt, { sign } from 'jsonwebtoken';
import crypto from 'crypto';
import { getRepository } from 'typeorm';
import { UsuarioLoginDTO } from './dtos/UserLoginDTO';
import { User } from './entities/User';
import { RefreshToken } from './entities/RefreshToken';
import { AppError } from '../../shared/errors/AppError';

export class UserService {
  async execute({ email, senha }: UsuarioLoginDTO) {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      throw new AppError('Email ou senha inválidos', 401);
    }

    const passwordMatch = await bcrypt.compare(senha, user.password_hash);
    if (!passwordMatch) {
      throw new AppError('Email ou senha inválidos', 401);
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = await this.generateAndStoreRefreshToken(user);

    const { password_hash: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      access_token: accessToken,
      refresh_token: refreshToken.token,
    };
  }

  private generateAccessToken(user: User): string {
    const secret = process.env.JWT_SECRET as string;
    const expiresIn = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
    const options = { expiresIn } as unknown as jwt.SignOptions;
    return sign(
      { id: user.id, email: user.email, role: user.role },
      secret as unknown as jwt.Secret,
      options,
    );
  }

  private async generateAndStoreRefreshToken(user: User): Promise<RefreshToken> {
    const refreshTokenRepo = getRepository(RefreshToken);
    
    await refreshTokenRepo.update(
      { userId: user.id, revoked: false },
      { revoked: true }
    );

    const tokenValue = crypto.randomBytes(64).toString('hex');
    const expiresInDays = process.env.JWT_REFRESH_EXPIRES_IN_DAYS || 7;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + Number(expiresInDays));

    const refreshToken = refreshTokenRepo.create({
      userId: user.id,
      token: tokenValue,
      expiresAt,
      revoked: false,
    });

    await refreshTokenRepo.save(refreshToken);
    return refreshToken;
  }
}
