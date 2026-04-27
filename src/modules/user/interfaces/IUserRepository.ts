import { User } from "../schema/User.schema";
import { RegisterClientInput } from "../repository/inputs/RegisterClient.input";
import { RegisterAdminInput } from "../repository/inputs/RegisterAdmin.input";

export interface IUserRepository {
  createUser(userData: RegisterClientInput): Promise<User>;
  createAdmin(userData: RegisterAdminInput): Promise<User>;
  findUserByEmail(email: string): Promise<User | null>;
  findUserByEmailWithPassword(email: string): Promise<User | null>;
}
