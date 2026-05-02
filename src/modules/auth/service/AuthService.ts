import jwt, { sign } from "jsonwebtoken";
import { AppError } from "../../../shared/errors/AppError";
import { IAuthRepository } from "../interfaces/IAuthRepository";
import * as crypto from "crypto";
import bcrypt from "bcrypt";
import { LoginResponse } from "../../../shared/types/ApiResponse";
import { IUserRepository } from "../../user/interfaces/IUserRepository";
import { UserLogin } from "../validators/UserLoginDTO";
import { AppDataSource } from "../../../shared/database/data-source";
import { hashRefreshToken } from "../repository/AuthRepository";
import { RefreshToken } from "../schema/RefreshToken.schema";

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

    const { refreshToken, token } = await this.authRepository.create(
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
        full_name: profile?.full_name ?? "",
      },
      access_token: accessToken,
      refresh_token: token,
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
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const tokenRepo = queryRunner.manager.getRepository(RefreshToken);
      const refreshTokenHash = hashRefreshToken(oldRefreshToken);

      const tokenRecord = await tokenRepo.findOne({
        where: { token: refreshTokenHash },
        relations: ["user"],
        lock: { mode: "pessimistic_write" },
      });

      if (!tokenRecord) {
        throw new AppError("Refresh token inválido", 401);
      }

      if (tokenRecord.expiresAt < new Date()) {
        await tokenRepo.delete({ id: tokenRecord.id });
        await queryRunner.commitTransaction();
        throw new AppError("Refresh token expirado, faça login novamente", 401);
      }

      const user = tokenRecord.user;
      const secret = process.env.JWT_SECRET as string;
      const accessExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN || "15m";
      const options = { expiresIn: accessExpiresIn } as unknown as jwt.SignOptions;
      const newAccessToken = sign(
        { id: user.id, email: user.email, role: user.role },
        secret as unknown as jwt.Secret,
        options,
      );

      const newRefreshTokenValue = crypto.randomBytes(64).toString("hex");
      const newRefreshTokenHash = hashRefreshToken(newRefreshTokenValue);
      const expiresInDays = Number(process.env.JWT_REFRESH_EXPIRES_IN_DAYS || 7);
      const newExpiresAt = new Date();
      newExpiresAt.setDate(newExpiresAt.getDate() + expiresInDays);

      await tokenRepo.delete({ id: tokenRecord.id });

      const newRefreshToken = tokenRepo.create({
        user: { id: user.id },
        token: newRefreshTokenHash,
        expiresAt: newExpiresAt,
        revoked: false,
      });

      await tokenRepo.save(newRefreshToken);
      await queryRunner.commitTransaction();

      return {
        access_token: newAccessToken,
        refresh_token: newRefreshTokenValue,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async revoke(refreshToken: string) {
    const refreshTokenHash = hashRefreshToken(refreshToken);
    await this.authRepository.revoke(refreshTokenHash);
  }
}
