import { Repository } from "typeorm";
import { Contrato } from "../schema/Contrato.schema";
import { IContratoRepositorio } from "./IContratoRepositorio";

export class ContratoRepositorio implements IContratoRepositorio {
  constructor(private repositorio: Repository<Contrato>) {}

  async criar(dados: Partial<Contrato>): Promise<Contrato> {
    const contrato = this.repositorio.create(dados);
    return await this.repositorio.save(contrato);
  }

  async buscarPorId(id: string): Promise<Contrato | null> {
    return await this.repositorio.findOne({
      where: { id },
      relations: ["usuario"],
    });
  }

  async listarPorUsuario(usuario_id: string): Promise<Contrato[]> {
    return await this.repositorio.find({
      where: { usuario_id },
      order: { criado_em: "DESC" },
    });
  }

  async salvar(contrato: Contrato): Promise<Contrato> {
    return await this.repositorio.save(contrato);
  }
}
