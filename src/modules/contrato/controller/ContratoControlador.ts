import { Request, Response } from "express";
import { AuthRequest } from "../../../middlewares/autenticarJWT";
import { ContratoService } from "../service/ContratoService";

type AssinarContratoParams = {
  id: string;
};

export class ContratoControlador {
  constructor(private contratoService: ContratoService) {}

  async criar(req: AuthRequest, res: Response) {
    try {
      const usuario_id = req.user!.id;
      const contrato = await this.contratoService.criar(req.body, usuario_id);
      return res.status(201).json(contrato);
    } catch (error) {
      console.error("Erro ao criar contrato:", error);

      return res.status(400).json({
        mensagem: "Erro ao criar contrato",
        erro: error instanceof Error ? error.message : error,
      });
    }
  }

  async assinar(
    req: AuthRequest & Request<AssinarContratoParams>,
    res: Response,
  ) {
    try {
      const usuario_id = req.user!.id;
      const { id } = req.params;
      const ip =
        (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
        req.socket.remoteAddress ||
        req.ip ||
        "0.0.0.0";

      if (!usuario_id) {
        return res.status(401).json({ mensagem: "Usuário não autenticado." });
      }

      if (!id) {
        return res
          .status(400)
          .json({ mensagem: "ID do contrato não informado." });
      }

      if (!ip) {
        return res
          .status(400)
          .json({ mensagem: "Não foi possível identificar o IP." });
      }

      const contrato = await this.contratoService.assinar(id, usuario_id, ip);

      return res.status(200).json(contrato);
    } catch (error) {
      return res.status(400).json({
        mensagem: "Erro ao criar contrato",
        erro: error instanceof Error ? error.message : error,
      });
    }
  }
}
