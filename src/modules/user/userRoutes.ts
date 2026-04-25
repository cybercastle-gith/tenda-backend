import { Router } from "express";
import { userController } from "../../shared/container";
import { RefreshController } from "./controller/RefreshController";

const userRoutes = Router();
const refreshController = new RefreshController();

userRoutes.post(
  "/register/user",
  userController.registerClient.bind(userController),
);

userRoutes.post(
  "/register/admin",
  userController.registerAdmin.bind(userController),
);

userRoutes.post(
  "/login/user",
  userController.login.bind(userController),
);

userRoutes.post(
  "/auth/refresh",
  refreshController.refresh.bind(refreshController),
);

userRoutes.post(
  "/auth/logout",
  refreshController.logout.bind(refreshController),
);

export { userRoutes };
