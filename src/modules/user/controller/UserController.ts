import { Request, Response } from "express";
import { UserService } from "../service/UserService";
import { RegisterClientDTO } from "../dtos/RegisterClient.DTO";
import { RegisterAdminDTO } from "../dtos/RegisterAdmin.DTO";
import { asyncHandler } from "../../../shared/middlewares/asyncHandler";
import { AppError } from "../../../shared/errors/AppError";

export class UserController {
  constructor(private userService: UserService) {}

  registerClient = asyncHandler(async (req: Request, res: Response) => {

    const dados = req.body as RegisterClientDTO;
    const user = await this.userService.registerClient(dados);
    res.status(201).json(user);
    
  });

  registerAdmin = asyncHandler(async (req: Request, res: Response) => {

    const dados = req.body as RegisterAdminDTO;
    const admin = await this.userService.registerAdmin(dados);
    res.status(201).json(admin);

  });

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({
          status: "error",
          message: "Email e senha são obrigatórios",
        });
      }

      const result = await this.userService.execute({ email, senha });

      return res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
      }
      console.error("Login error:", error);
      return res.status(500).json({
        status: "error",
        message: "Erro interno no servidor",
      });
    }
  }
}
