import { UserController } from "../../modules/user/controller/UserController";
import { UserRepository } from "../../modules/user/repository/UserRepository";
import { User } from "../../modules/user/schema/User.schema";
import { RefreshToken } from "../../modules/auth/schema/RefreshToken.schema";
import { UserService } from "../../modules/user/service/UserService";
import { AppDataSource } from "../database/data-source";
import { AuthController } from "../../modules/auth/controller/AuthController";
import { AuthService } from "../../modules/auth/service/AuthService";
import { AuthRepository } from "../../modules/auth/repository/AuthRepository";

// Users
const userRepository = new UserRepository(AppDataSource.getRepository(User));

const userService = new UserService(userRepository);

export const userController = new UserController(userService);

// Auth
export const authRepository = new AuthRepository(
  AppDataSource.getRepository(RefreshToken),
);

const authService = new AuthService(authRepository, userRepository);

export const authController = new AuthController(authService);
