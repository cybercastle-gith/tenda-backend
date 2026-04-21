import { z } from "zod";
import { Request, Response } from "express";
import { UsuarioService } from "../service/UsuarioServico";
import { UsuarioSchema } from "../dtos/UsuarioBase.DTO";
import { UsuarioLoginDTO } from "../dtos/UsuarioLogin.DTO";

export class UsuarioControlador {
  constructor(private usuarioService: UsuarioService) {}

  async hello(req: Request, res: Response) {
    res.status(200).json({
      message: `oiiiii, tiuru poom????, seu ip é ${req.ip} e o método da requisição é ${req.method}`,
    });
  }

  async cadastrarControlador(req: Request, res: Response) {
    try {
      const dados = UsuarioSchema.parse(req.body);

      const resultado = await this.usuarioService.cadastrar(dados);

      res.status(201).json(resultado);
    } catch (error: any) {
      return this.tratarErro(res, error);
    }
  }

  async loginControlador(req: Request, res: Response) {
    try {
      const dados = req.body as UsuarioLoginDTO;

      const { token, papel } = await this.usuarioService.login(dados);

      res.status(200).json({
        mensagem: "Deu certo o login, toma seu token",
        token: token,
        papel: papel,
      });
    } catch (error) {
      return this.tratarErro(res, error);
    }
  }

  private tratarErro(res: Response, error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        status: "erro_validacao",
        detalhes: error.issues.map((i) => ({
          campo: i.path[0],
          mensagem: i.message,
        })),
      });
    }
    return res.status(400).json({
      status: "erro",
      mensagem: error.message || "Houve um problema na requisição",
    });
  }
}
