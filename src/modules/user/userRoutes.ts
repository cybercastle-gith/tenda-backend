import { Router } from "express";
import { userController } from "../../shared/container";

const userRoutes = Router();

userRoutes.post("/", userController.registerClient.bind(userController));

userRoutes.post("/admin", userController.registerAdmin.bind(userController));

export { userRoutes };
