import { z } from "zod";
import { Request, Response } from "express";
import { EnderecoServico } from "../service/EnderecoServico";
import { EnderecoSchema } from "../dto/Endereco.DTO";

export class EnderecoControlador {
  constructor(private enderecoService: EnderecoServico) {}

  async cadastrar(req: Request, res: Response) {
    try {
      const usuario_id = req.user!.id;

      const dadosParaValidar = {
        ...req.body,
        usuario_id: usuario_id, // Aqui injetamos o ID
      };

      const dadosValidados = EnderecoSchema.parse(dadosParaValidar);

      const endereco = await this.enderecoService.cadastrar(dadosValidados);

      return res.status(201).json(endereco);
      
    } catch (error: any) {
      // Seu try/catch firme e forte aqui
      if (error instanceof z.ZodError) {
        return res.status(400).json({ erros: error.issues });
      }
      return res.status(400).json({ mensagem: error.message });
    }
  }
}
