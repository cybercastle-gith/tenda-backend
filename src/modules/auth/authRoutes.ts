import { Router } from "express";
import { authController } from "../../shared/container";
import { ensureAuthenticated } from "../../shared/middlewares/ensureAuthenticated";
import { validateRefreshTokenOwnership } from "../../shared/middlewares/validateRefreshTokenOwnership";

const authRoutes = Router();

authRoutes.post("/login", authController.login.bind(authController));

authRoutes.post(
  "/refresh",
  ensureAuthenticated,
  validateRefreshTokenOwnership,
  authController.refresh.bind(authController),
);

authRoutes.post(
  "/logout",
  ensureAuthenticated,
  validateRefreshTokenOwnership,
  authController.logout.bind(authController),
);

export { authRoutes };
