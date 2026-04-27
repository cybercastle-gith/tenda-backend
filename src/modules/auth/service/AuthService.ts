import jwt, { sign } from "jsonwebtoken";
import { AppError } from "../../../shared/errors/AppError";
import { IAuthRepository } from "../interfaces/IAuthRepository";
import bcrypt from "bcrypt";
import { LoginResponse } from "../../../shared/types/ApiResponse";
import { IUserRepository } from "../../user/interfaces/IUserRepository";
import { UserLogin } from "../validators/UserLoginDTO";

export class AuthService {
  constructor(
    private authRepository: IAuthRepository,
    private userRepository: IUserRepository,
  ) {}

  async login(dados: UserLogin): Promise<LoginResponse> {
    const user = await this.userRepository.findUserByEmailWithPassword(
      dados.email,
    );

    if (!user) {
      throw new AppError("Email ou senha inválidos", 401);
    }

    const passwordMatch = await bcrypt.compare(
      dados.password,
      user.password_hash,
    );
    if (!passwordMatch) {
      throw new AppError("Email ou senha inválidos", 401);
    }

    const accessToken = this.generateAccessToken(user);
    const expiresInDays = Number(process.env.JWT_REFRESH_EXPIRES_IN_DAYS || 7);

    const refreshToken = await this.authRepository.create(
      user.id,
      expiresInDays,
    );

    const profile =
      user.role === "admin" ? user.adminProfile : user.clientProfile;

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role as "admin" | "client",
        full_name: profile.full_name,
      },
      access_token: accessToken,
      refresh_token: refreshToken.token,
    };
  }

  private generateAccessToken(user: any): string {
    const secret = process.env.JWT_SECRET as string;
    const expiresIn = process.env.JWT_ACCESS_EXPIRES_IN || "15m";
    const options = { expiresIn } as unknown as jwt.SignOptions;
    return sign(
      { id: user.id, email: user.email, role: user.role },
      secret as unknown as jwt.Secret,
      options,
    );
  }

  async execute(oldRefreshToken: string) {
    const tokenRecord = await this.authRepository.findByToken(oldRefreshToken);

    if (!tokenRecord) {
      throw new AppError("Refresh token inválido", 401);
    }

    if (tokenRecord.expiresAt < new Date()) {
      await this.authRepository.revoke(oldRefreshToken);
      throw new AppError("Refresh token expirado, faça login novamente", 401);
    }

    const user = tokenRecord.user;
    const secret = process.env.JWT_SECRET as string;
    const accessExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN || "15m";
    const options = {
      expiresIn: accessExpiresIn,
    } as unknown as jwt.SignOptions;
    const newAccessToken = sign(
      { id: user.id, email: user.email, role: user.role },
      secret as unknown as jwt.Secret,
      options,
    );

    const expiresInDays = Number(process.env.JWT_REFRESH_EXPIRES_IN_DAYS || 7);
    const newRefreshToken = await this.authRepository.create(
      user.id,
      expiresInDays,
    );

    await this.authRepository.revoke(oldRefreshToken);

    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken.token,
    };
  }

  async revoke(refreshToken: string) {
    await this.authRepository.revoke(refreshToken);
  }
}
