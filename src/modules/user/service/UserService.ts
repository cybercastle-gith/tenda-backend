import { UserAlreadyUserExistsError } from "../../../shared/errors/UserAlreadyExitis";
import { RegisterAdmin } from "../validators/RegisterAdmin.DTO";
import { RegisterClient } from "../validators/RegisterClient.DTO";
import { IUserRepository } from "../interfaces/IUserRepository";
import { RegisterResponse } from "../../../shared/types/ApiResponse";
import bcrypt from "bcrypt";

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

  async registerClient(userData: RegisterClient): Promise<RegisterResponse> {
    await this.verifyUserExists(userData.email);

    const password_hash = await this.hashPassword(userData.password);

    const user = await this.userRepository.createUser({
      cpf: userData.cpf,
      email: userData.email,
      password_hash: password_hash,
      full_name: userData.full_name,
      phone: userData.phone,
    });

    return {
      id: user.id,
      email: user.email,
      role: "client",
      full_name: user.clientProfile.full_name,
      createdAt: user.created_at,
    };
  }

  async registerAdmin(userData: RegisterAdmin): Promise<RegisterResponse> {
    await this.verifyUserExists(userData.email);

    const password_hash = await this.hashPassword(userData.password);

    const user = await this.userRepository.createAdmin({
      email: userData.email,
      password_hash: password_hash,
      full_name: userData.full_name,
      department: userData.department,
    });

    return {
      id: user.id,
      email: user.email,
      role: "admin",
      full_name: user.adminProfile.full_name,
      createdAt: user.created_at,
    };
  }
}
