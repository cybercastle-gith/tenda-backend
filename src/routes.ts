import { Router } from "express";
import { userRoutes } from "./modules/user/userRoutes";

const routesMain = Router();

routesMain.use("/api/v1", userRoutes);

export default routesMain;
