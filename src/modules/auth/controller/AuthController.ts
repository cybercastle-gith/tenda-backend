import { Request, Response } from "express";
import { AuthService } from "../service/AuthService";
import { asyncHandler } from "../../../shared/middlewares/asyncHandler";
import { userLoginSchema } from "../validators/UserLoginDTO";
import { ApiResponse, LoginResponse } from "../../../shared/types/ApiResponse";
import { refreshTokenSchema } from "../validators/RefreshTokenDTO";

export class AuthController {
  constructor(private authService: AuthService) {}

  login = asyncHandler(async (req: Request, res: Response) => {
    const dados = userLoginSchema.parse(req.body);
    const result = await this.authService.login(dados);

    const response: ApiResponse<LoginResponse> = {
      status: "success",
      data: result,
    };
    res.status(200).json(response);
  });

  refresh = asyncHandler(async (req: Request, res: Response) => {
    const { refresh_token } = refreshTokenSchema.parse(req.body);

    const tokens = await this.authService.execute(refresh_token);
    res.status(200).json({
      status: "success",
      data: tokens,
    });
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    const { refresh_token } = req.body;

    if (refresh_token) {
      await this.authService.revoke(refresh_token);
    }

    res.status(204).send();
  });
}
