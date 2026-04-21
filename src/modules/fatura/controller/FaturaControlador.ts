import { Request, Response } from "express";
import { PegarDadosFatura } from "../../../shared/services/TesseractService";
import fs from "fs";

export async function create(req: Request, res: Response): Promise<Response> {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Arquivo não enviado" });
    }

    const pegarDadosFatura = new PegarDadosFatura();

    // Passamos o path do arquivo que o Multer salvou
    const dados = await pegarDadosFatura.processarFatura(req.file.path);

    // Opcional: deletar arquivo após processar
    // await fs.promises.unlink(req.file.path);

    return res.json(dados);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao processar fatura" });
  }
}
