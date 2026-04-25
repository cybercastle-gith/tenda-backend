import { UserAlreadyUserExistsError } from "../../../shared/errors/UserAlreadyExitis";
import { AppError } from "../../../shared/errors/AppError";
import { RegisterAdminDTO } from "../dtos/RegisterAdmin.DTO";
import { RegisterClientDTO } from "../dtos/RegisterClient.DTO";
import { UsuarioLoginDTO } from "../dtos/UserLoginDTO";
import { IUserRepository } from "../repository/IUserRepository";
import bcrypt from "bcrypt";
import jwt, { sign } from "jsonwebtoken";
import crypto from "crypto";
import { getRepository } from "typeorm";
import { User } from "../entities/User";
import { RefreshToken } from "../entities/RefreshToken";

export class UserService {
  constructor(private userRepository: IUserRepository) {}

  private async verifyUserExists(email: string) {
    const userExists = await this.userRepository.findUserByEmail(email);

    if (userExists) {
      throw new UserAlreadyUserExistsError();
    }
  }

  private async hashPassword(password: string) {
    return bcrypt.hash(password, 12);
  }

  async execute({ email, senha }: UsuarioLoginDTO) {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      throw new AppError("Email ou senha inválidos", 401);
    }

    const passwordMatch = await bcrypt.compare(senha, user.password_hash);
    if (!passwordMatch) {
      throw new AppError("Email ou senha inválidos", 401);
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
    const expiresIn = process.env.JWT_ACCESS_EXPIRES_IN || "15m";
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

    const tokenValue = crypto.randomBytes(64).toString("hex");
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

  async registerClient(userData: RegisterClientDTO) {
    if (
      !userData.email ||
      !userData.cpf ||
      !userData.full_name ||
      !userData.password ||
      !userData.phone
    ) {
      throw new Error("Há campos faltando.");
    }

    await this.verifyUserExists(userData.email);

    const password_hash = await this.hashPassword(userData.password);

    const user = await this.userRepository.createUser({
      cpf: userData.cpf,
      email: userData.email,
      password: password_hash,
      full_name: userData.full_name,
      phone: userData.phone,
    });

    return {
      usuario: {
        id: user.id,
        name: user.clientProfile.full_name,
      },
    };
  }

  async registerAdmin(userData: RegisterAdminDTO) {
    if (
      !userData.department ||
      !userData.email ||
      !userData.full_name ||
      !userData.password
    ) {
      throw new Error("Há campos faltando.");
    }

    await this.verifyUserExists(userData.email);

    const password_hash = await this.hashPassword(userData.password);

    const user = await this.userRepository.createAdmin({
      email: userData.email,
      password: password_hash,
      full_name: userData.full_name,
      department: userData.department,
    });

    return {
      usuario: {
        id: user.id,
        name: user.adminProfile.full_name,
      },
    };
  }
}
