import { Repository } from "typeorm";
import { User } from "../schema/User.schema";
import { IUserRepository } from "../interfaces/IUserRepository";
import { RegisterClientInput } from "./inputs/RegisterClient.input";
import { RegisterAdminInput } from "./inputs/RegisterAdmin.input";

export class UserRepository implements IUserRepository {
  constructor(private repositorio: Repository<User>) {}

  async createUser(dados: RegisterClientInput): Promise<User> {
    return await this.repositorio.manager.transaction(async (tm) => {
      const user = tm.create(User, {
        email: dados.email,
        password_hash: dados.password_hash,
        role: "client",
        clientProfile: {
          full_name: dados.full_name,
          cpf: dados.cpf,
          phone: dados.phone,
        },
      });

      return await tm.save(user);
    });
  }

  async createAdmin(dados: RegisterAdminInput): Promise<User> {
    return await this.repositorio.manager.transaction(async (tm) => {
      const admin = tm.create(User, {
        email: dados.email,
        password_hash: dados.password_hash,
        role: "admin",
        adminProfile: {
          full_name: dados.full_name,
          department: dados.department,
        },
      });

      return await tm.save(admin);
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.repositorio.findOne({
      where: { email },
      relations: ["clientProfile", "adminProfile"],
    });

    return user;
  }

  async findUserByEmailWithPassword(email: string): Promise<User | null> {
    const user = await this.repositorio.findOne({
      where: { email },
      select: ["id", "email", "password_hash", "role"],
      relations: ["clientProfile", "adminProfile"],
    });

    return user;
  }
}
