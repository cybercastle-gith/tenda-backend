import { Request, Response } from "express";
import { UserService } from "../service/UserService";
import { registerClientSchema } from "../validators/RegisterClient.DTO";
import { registerAdminSchema } from "../validators/RegisterAdmin.DTO";
import { asyncHandler } from "../../../shared/middlewares/asyncHandler";
import {
  ApiResponse,
  RegisterResponse,
} from "../../../shared/types/ApiResponse";

export class UserController {
  constructor(private userService: UserService) {}

  registerClient = asyncHandler(async (req: Request, res: Response) => {
    const dados = registerClientSchema.parse(req.body);
    const user = await this.userService.registerClient(dados);

    const response: ApiResponse<RegisterResponse> = {
      status: "success",
      data: user,
    };
    res.status(201).json(response);
  });

  registerAdmin = asyncHandler(async (req: Request, res: Response) => {
    const dados = registerAdminSchema.parse(req.body);
    const admin = await this.userService.registerAdmin(dados);

    const response: ApiResponse<RegisterResponse> = {
      status: "success",
      data: admin,
    };
    res.status(201).json(response);
  });
}
