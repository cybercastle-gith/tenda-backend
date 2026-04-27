import { Router } from "express";
import { userRoutes } from "./modules/user/userRoutes";
import { authRoutes } from "./modules/auth/authRoutes";

const routesMain = Router();

routesMain.use("/api/v1/users", userRoutes);
routesMain.use("/api/v1/auth", authRoutes);

export default routesMain;
